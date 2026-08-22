import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /**
     * `User.passwordChangedAt` as of the moment this token was minted. When the
     * stored value moves past it the token is refused — see the jwt callback in
     * src/auth.ts.
     */
    pwdAt?: number;
    /** When the check above last ran, so it can be throttled. */
    pwdCheckedAt?: number;
  }
}
