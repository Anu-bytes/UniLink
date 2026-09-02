// The admin gate.
//
// `session.user.role` is mirrored onto the JWT and refreshed at most once a
// minute (see the jwt callback in src/auth.ts). It is cheap, and fine for
// deciding what the navigation renders — but it is never the authority. The
// three functions below re-read `User.role` from the database on every call:
//
//   requireAdmin()      — for `/api/admin/*` route handlers
//   requireAdminPage()  — for every page under `[locale]/(admin)/admin`
//   getAdminActor()     — the shared lookup both are built on
//
// One primary-key lookup per admin request is nothing next to the queries the
// dashboard itself runs, and it means "remove this person's access" takes
// effect on their very next click.
//
// WHY EVERY PAGE CALLS THE GUARD ITSELF, rather than leaning on the layout:
// Next.js only re-executes a layout when the incoming router state does not
// already match that segment. On a client-side navigation between two pages
// that share the admin layout — which is what every sidebar link is — the
// layout is skipped and only the page segment renders. A guard that lives
// solely in `layout.tsx` therefore protects the first hard request and nothing
// after it, and a signed-in non-admin can reach the same payload directly by
// sending an RSC request whose `Next-Router-State-Tree` already matches
// through the `admin` segment. Authorization has to sit with the code that
// reads the data. See requireAdminPage below.

import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";

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

/**
 * Guard for the pages under `[locale]/(admin)/admin`. Use it as the first
 * statement of every one of them, including the ones that do not otherwise
 * need the actor:
 *
 *     export default async function Page() {
 *       await requireAdminPage();
 *       ...
 *
 * It repeats what the admin layout does, on purpose — see the note at the top
 * of this file: the layout does not run on a client-side navigation, so it
 * cannot be the only check. The two outcomes match the layout's so that the
 * page and the shell around it can never disagree:
 *
 *   anonymous          -> the login page, with a callback back to the console.
 *   signed in, not an
 *   admin              -> 404. Not a "forbidden" page: nothing in the product
 *                         links a student here, so confirming the route exists
 *                         only tells someone where to start guessing.
 *
 * Both `redirect` and `notFound` throw, so the caller never sees a null actor.
 */
export async function requireAdminPage(): Promise<AdminActor> {
  const session = await auth();
  if (!session?.user?.id) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  }

  const actor = await getAdminActor();
  if (!actor) {
    notFound();
  }

  return actor;
}
