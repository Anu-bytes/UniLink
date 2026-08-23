import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// The jwt callback in src/auth.ts stashes `pwdAt` and `pwdCheckedAt` on the
// token. They are deliberately not declared here: `next-auth/jwt` is only
// `export * from "@auth/core/jwt"` and declares no JWT of its own, so
// augmenting it adds a second, unrelated interface instead of merging into the
// one the callback is typed with — the fields stay `unknown` and the build
// fails on the arithmetic. auth.ts narrows them with `typeof` instead, which
// holds regardless of how the packages re-export each other.
