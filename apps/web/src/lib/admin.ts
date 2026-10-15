// The admin gate.
//
// Three admin levels, read from `User.role`:
//
//   3  ADMIN             the super admin: edits everything, manages admins
//   2  REVIEWER          approves pending edits, reads the statistics
//   1  UNIVERSITY_ADMIN  edits only assigned universities; every edit waits
//                        in the review queue (see lib/admin-changes.ts)
//
// `session.user.role` is mirrored onto the JWT and refreshed at most once a
// minute (see the jwt callback in src/auth.ts). It is cheap, and fine for
// deciding what the navigation renders, but it is never the authority. The
// functions below re-read the user from the database on every call:
//
//   requireAdmin()      for `/api/admin/*` route handlers
//   requireAdminPage()  for every page under `[locale]/(admin)/admin`
//   getAdminActor()     the shared lookup both are built on
//
// Both guards default to level 3, so every route and page written before the
// levels existed stays super-admin only until it explicitly opts lower ones in.
//
// WHY EVERY PAGE CALLS THE GUARD ITSELF, rather than leaning on the layout:
// Next.js only re-executes a layout when the incoming router state does not
// already match that segment. On a client-side navigation between two pages
// that share the admin layout (which is what every sidebar link is) the layout
// is skipped and only the page segment renders. A guard that lives solely in
// `layout.tsx` therefore protects the first hard request and nothing after
// it. Authorization has to sit with the code that reads the data.

import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import type { UserRole } from "@prisma/client";

import { auth } from "@/auth";
import { currentApproval } from "@/lib/admin-context";
import { prisma } from "@/lib/prisma";

export type AdminRole = Extract<UserRole, "ADMIN" | "REVIEWER" | "UNIVERSITY_ADMIN">;
export type AdminLevel = 1 | 2 | 3;

export const ADMIN_LEVEL: Record<AdminRole, AdminLevel> = {
  UNIVERSITY_ADMIN: 1,
  REVIEWER: 2,
  ADMIN: 3,
};

export const ADMIN_ROLES = Object.keys(ADMIN_LEVEL) as AdminRole[];

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return role != null && role in ADMIN_LEVEL;
}

export type AdminActor = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: AdminRole;
  level: AdminLevel;
  /** Universities a level-1 admin may edit. Empty for levels 2 and 3. */
  universityIds: string[];
};

/** A level-3 admin, or a level-1 admin assigned to this university. */
export function canEditUniversity(actor: AdminActor, universityId: string) {
  return actor.level === 3 || (actor.level === 1 && actor.universityIds.includes(universityId));
}

/**
 * Resolve the signed-in admin of any level, or `null` when the caller is
 * anonymous, not an admin, or their account is disabled or banned.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      adminAssignments: { select: { universityId: true } },
    },
  });

  if (!user || user.status !== "ACTIVE" || !isAdminRole(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    level: ADMIN_LEVEL[user.role],
    universityIds:
      user.role === "UNIVERSITY_ADMIN"
        ? user.adminAssignments.map((assignment) => assignment.universityId)
        : [],
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
 * `minLevel` defaults to 3 (super admin). While a reviewer is approving a
 * queued change the original write is replayed as them (see
 * lib/admin-changes.ts); that replay passes this guard whatever their level,
 * because approving is what they are allowed to do.
 *
 * 401 separates "you are not signed in" from 403 "you are, but not allowed".
 * Neither response says anything about whether the addressed record exists.
 */
export async function requireAdmin(
  options: { minLevel?: AdminLevel } = {},
): Promise<AdminGuard> {
  const approval = currentApproval();
  if (approval) return { ok: true, actor: approval.approver };

  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not signed in" }, { status: 401 }),
    };
  }

  const actor = await getAdminActor();
  if (!actor || actor.level < (options.minLevel ?? 3)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, actor };
}

/**
 * Guard for the pages under `[locale]/(admin)/admin`. Use it as the first
 * statement of every one of them:
 *
 *     export default async function Page() {
 *       await requireAdminPage();            // super admin only
 *       await requireAdminPage({ minLevel: 1 }); // any admin
 *
 * It repeats what the admin layout does, on purpose: the layout does not run
 * on a client-side navigation, so it cannot be the only check.
 *
 *   anonymous            -> the login page, with a callback back to the console
 *   not an admin         -> 404 (nothing in the product links a student here)
 *   admin, level too low -> the console's front page, which every level has
 *
 * `redirect` and `notFound` throw, so the caller never sees a null actor.
 */
export async function requireAdminPage(
  options: { minLevel?: AdminLevel } = {},
): Promise<AdminActor> {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  }

  const actor = await getAdminActor();
  if (!actor) notFound();
  if (actor.level < (options.minLevel ?? 3)) redirect(`/${locale}/admin`);

  return actor;
}

/**
 * For the catalogue editor pages: super admins and university admins.
 * Reviewers approve changes but do not edit, so they go back to the console.
 */
export async function requireEditorPage(): Promise<AdminActor> {
  const actor = await requireAdminPage({ minLevel: 1 });
  if (actor.level === 2) redirect(`/${await getLocale()}/admin`);
  return actor;
}

/**
 * The universities a page may show: every one for a super admin, only the
 * assigned ones for a university admin. Spread into a Prisma `where` on the
 * university id (or `universityId`).
 */
export function universityIdScope(actor: AdminActor): { in: string[] } | undefined {
  return actor.level === 1 ? { in: actor.universityIds } : undefined;
}
