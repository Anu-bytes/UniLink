"use client";

import {
  SessionProvider as AuthSessionProvider,
  signOut,
  useSession as useAuthSession,
} from "next-auth/react";
import type { SessionUser } from "@/lib/auth/types";

interface SessionCtx {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}

export function useSession(): SessionCtx {
  const { data, status, update } = useAuthSession();
  const authUser = data?.user;
  const fullName = authUser?.name?.trim() || authUser?.email || "Student";

  const user: SessionUser | null = authUser?.id
    ? {
        id: authUser.id,
        email: authUser.email ?? "",
        fullName,
        role: "student",
      }
    : null;

  return {
    user,
    loading: status === "loading",
    refresh: async () => {
      await update();
    },
    logout: async () => {
      await signOut({ redirect: false });
    },
  };
}
