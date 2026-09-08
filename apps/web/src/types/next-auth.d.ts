import type { DefaultSession, DefaultUser } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // Mirrored from User.role by the jwt/session callbacks in src/auth.ts.
      // Good enough to decide what the navigation renders; NOT the authority
      // for access. Anything that grants admin power re-reads the row (see
      // requireAdmin in src/lib/admin.ts), because the token is refreshed at
      // most once a minute and would otherwise keep a demoted admin in.
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: UserRole;
  }
}

// The jwt callback in src/auth.ts stashes `pwdAt`, `pwdCheckedAt` and `role`
// on the token. They are deliberately not declared here: `next-auth/jwt` is
// only `export * from "@auth/core/jwt"` and declares no JWT of its own, so
// augmenting it adds a second, unrelated interface instead of merging into the
// one the callback is typed with — the fields stay `unknown` and the build
// fails on the arithmetic. auth.ts narrows them with `typeof` instead, which
// holds regardless of how the packages re-export each other.
