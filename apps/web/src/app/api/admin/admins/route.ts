import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, isAdminRole, requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { grantAdminAccess } from "@/lib/admin-accounts";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  role: z.enum(ADMIN_ROLES as [string, ...string[]]),
  universityIds: z.array(z.string().min(1)).max(200).default([]),
});

/**
 * Add an admin. A new email gets a fresh account with a one-time password,
 * returned once in the response for the super admin to pass on. An existing
 * student or parent account is promoted instead, keeping its password.
 */
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const { name, email, role, universityIds } = body.data;
  if (!isAdminRole(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const result = await grantAdminAccess({ name, email, role, universityIds, actorId: guard.actor.id });
  if (!result.ok) {
    return NextResponse.json({ error: result.error, field: result.field ?? null }, { status: result.status });
  }
  return NextResponse.json(
    { id: result.userId, promoted: result.promoted, temporaryPassword: result.temporaryPassword },
    { status: 201 },
  );
}
