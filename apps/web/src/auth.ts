import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// How stale the password-change check below is allowed to get.
const REVALIDATE_MS = 60_000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Credentials provider requires JWT sessions (database sessions are not
  // supported for it), so we use JWT for all strategies.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw, request) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Two independent windows: per-account (stops a single email being
        // guessed from many IPs) and per-IP (stops one IP spraying many
        // emails). Both keyed loosely on purpose — this only needs to slow a
        // script down, not survive a distributed attack.
        const accountOk = rateLimit(`login:acct:${email.toLowerCase()}`, {
          limit: 5,
          windowMs: 60_000,
        });
        const ipOk = rateLimit(`login:ip:${clientIp(request)}`, {
          limit: 20,
          windowMs: 60_000,
        });
        if (!accountOk || !ipOk) return null;

        // Case-insensitive, matching how the account was ever resolvable via
        // password reset (see findAccount in lib/password-reset.ts) — without
        // this, an account whose stored email carries different casing than
        // what the user types here silently fails to sign in.
        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.sub = user.id;
      if (!token.sub) return token;

      // Resetting a password has to end sessions that were already open,
      // otherwise the reset does not evict whoever the user is resetting
      // *because of*. JWT sessions cannot be deleted server-side, so instead
      // each token carries the account's `passwordChangedAt` and is refused
      // once the stored value moves past it.
      //
      // The check costs one primary-key lookup, throttled to once a minute per
      // session rather than run on every request. The tradeoff is that a
      // reset takes up to REVALIDATE_MS to evict an open session; dropping
      // this to 0 makes eviction immediate at the cost of a query per request.
      //
      // `JWT extends Record<string, unknown>`, so anything stashed on the token
      // reads back as `unknown` and must be narrowed before it is used.
      // Declaring the fields via module augmentation does not work here:
      // next-auth/jwt only re-exports @auth/core/jwt, so `declare module
      // "next-auth/jwt"` creates a second, unrelated JWT rather than merging
      // into the one the callback is actually typed with.
      const lastChecked =
        typeof token.pwdCheckedAt === "number" ? token.pwdCheckedAt : 0;
      const due = Date.now() - lastChecked >= REVALIDATE_MS;
      if (!user && !due) return token;

      const account = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { passwordChangedAt: true },
      });

      // The account was deleted while the session was open.
      if (!account) return null;

      const changedAt = account.passwordChangedAt?.getTime() ?? 0;
      const stamped = typeof token.pwdAt === "number" ? token.pwdAt : 0;

      if (user) {
        // Fresh sign-in: this token is by definition current.
        token.pwdAt = changedAt;
      } else if (changedAt > stamped) {
        // Returning null clears the session cookie (see @auth/core's session
        // action), which is what signs the stale session out.
        return null;
      }

      token.pwdCheckedAt = Date.now();
      return token;
    },
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
