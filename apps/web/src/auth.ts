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

        const user = await prisma.user.findUnique({ where: { email } });
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
      const lastChecked = token.pwdCheckedAt ?? 0;
      const due = Date.now() - lastChecked >= REVALIDATE_MS;
      if (!user && !due) return token;

      const account = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { passwordChangedAt: true },
      });

      // The account was deleted while the session was open.
      if (!account) return null;

      const changedAt = account.passwordChangedAt?.getTime() ?? 0;

      if (user) {
        // Fresh sign-in: this token is by definition current.
        token.pwdAt = changedAt;
      } else if (changedAt > (token.pwdAt ?? 0)) {
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
