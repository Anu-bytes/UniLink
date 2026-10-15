import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, isAdminRole, requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { setAssignments, temporaryPassword } from "@/lib/admin-accounts";
import { recordAudit } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

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
  if (role === "UNIVERSITY_ADMIN" && universityIds.length === 0) {
    return NextResponse.json({ error: "Assign at least one university", field: "universityIds" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, role: true },
  });
  if (existing && isAdminRole(existing.role)) {
    return NextResponse.json({ error: "This person is already an admin", field: "email" }, { status: 409 });
  }

  let userId: string;
  let password: string | null = null;
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role, status: "ACTIVE", statusReason: null, statusChangedAt: new Date() },
    });
    userId = existing.id;
  } else {
    password = temporaryPassword();
    const created = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash: await bcrypt.hash(password, 10),
        passwordChangedAt: new Date(),
        emailVerified: new Date(),
      },
      select: { id: true },
    });
    userId = created.id;
  }

  const assigned = role === "UNIVERSITY_ADMIN" ? await setAssignments(userId, universityIds, guard.actor.id) : [];

  await recordAudit({
    actorId: guard.actor.id,
    action: "admin.create",
    entity: "admin",
    entityId: userId,
    entityLabel: name,
    summary: existing
      ? `Gave ${email} admin access as ${role}`
      : `Created admin account ${email} as ${role}`,
    metadata: { role, universityIds: assigned },
  });

  return NextResponse.json({ id: userId, promoted: Boolean(existing), temporaryPassword: password }, { status: 201 });
}
