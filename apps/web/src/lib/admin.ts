// The admin gate.
//
// Two layers, deliberately:
//
//   1. `session.user.role` — mirrored onto the JWT and refreshed at most once
//      a minute (see the jwt callback in src/auth.ts). Cheap, and fine for
//      deciding what the navigation renders.
//   2. `requireAdmin()` — re-reads `User.role` from the database on every
//      call. This is the authority. Without it, demoting an admin would leave
//      them with full write access until their token happened to refresh.
//
// One primary-key lookup per admin request is nothing next to the queries the
// dashboard itself runs, and it means "remove this person's access" takes
// effect on their very next click.

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminActor = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

/**
 * Resolve the signed-in admin, or `null` when the caller is anonymous or not
 * an ADMIN. Callers that render UI use this; route handlers use
 * `requireAdmin` below, which turns the same check into a response.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!user || user.role !== "ADMIN") return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}

export type AdminGuard =
  | { ok: true; actor: AdminActor }
  | { ok: false; response: NextResponse };

/**
 * Guard for `/api/admin/*` route handlers. Use it as the first statement of
 * every one of them:
 *
 *     const guard = await requireAdmin();
 *     if (!guard.ok) return guard.response;
 *
 * 401 separates "you are not signed in" from 403 "you are, but you are not an
 * admin", which is what lets the client redirect to the login page in the
 * first case and show a plain refusal in the second. Neither response says
 * anything about whether the addressed record exists.
 */
export async function requireAdmin(): Promise<AdminGuard> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not signed in" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    actor: { id: user.id, name: user.name, email: user.email, image: user.image },
  };
}
