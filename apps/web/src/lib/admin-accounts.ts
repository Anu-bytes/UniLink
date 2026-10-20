// Shared rules for managing admin accounts (the /admin/admins pages and
// /api/admin/admins routes).

import { randomBytes } from "node:crypto";

import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { isAdminRole } from "@/lib/admin";
import { recordAudit } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

/** A readable one-time password: 12 characters, no look-alikes (0/O, 1/l). */
export function temporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

/**
 * Active super admins other than `exceptId`. The console must always keep at
 * least one, or nobody could manage admins again.
 */
export async function otherActiveSuperAdmins(exceptId: string) {
  return prisma.user.count({
    where: { role: "ADMIN", status: "ACTIVE", id: { not: exceptId } },
  });
}

/** Replace a university admin's assignments with exactly `universityIds`. */
export async function setAssignments(userId: string, universityIds: string[], assignedById: string) {
  const unique = [...new Set(universityIds)];
  const valid = await prisma.university.findMany({ where: { id: { in: unique } }, select: { id: true } });
  const ids = valid.map((university) => university.id);
  await prisma.$transaction([
    prisma.universityAdminAssignment.deleteMany({ where: { userId, universityId: { notIn: ids } } }),
    ...ids.map((universityId) =>
      prisma.universityAdminAssignment.upsert({
        where: { userId_universityId: { userId, universityId } },
        create: { userId, universityId, assignedById },
        update: {},
      }),
    ),
  ]);
  return ids;
}

export type GrantResult =
  | { ok: true; userId: string; promoted: boolean; temporaryPassword: string | null; universityIds: string[] }
  | { ok: false; status: number; error: string; field?: string };

/**
 * Give someone admin access. A new email gets a fresh account with a one-time
 * password (returned once, for the super admin to pass on); an existing
 * student or parent account is promoted and also gets a new one-time
 * password (see below). Used by "Add admin" and by approving a university
 * representative application.
 */
export async function grantAdminAccess({
  name,
  email,
  role,
  universityIds,
  actorId,
  reason,
}: {
  name: string;
  email: string;
  role: UserRole;
  universityIds: string[];
  actorId: string;
  /** Appended to the audit summary, e.g. which application it came from. */
  reason?: string;
}): Promise<GrantResult> {
  if (!isAdminRole(role)) return { ok: false, status: 400, error: "Invalid role" };
  if (role === "UNIVERSITY_ADMIN" && universityIds.length === 0) {
    return { ok: false, status: 400, error: "Assign at least one university", field: "universityIds" };
  }

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, role: true, passwordHash: true },
  });
  if (existing && isAdminRole(existing.role)) {
    return { ok: false, status: 409, error: "This person is already an admin", field: "email" };
  }

  let userId: string;
  let password: string | null = null;
  if (existing) {
    // Signup never proves the address belongs to whoever typed it, so an
    // existing password may have been set by someone else who registered
    // this email ahead of its owner. Keeping it would hand them the console.
    // The password is replaced with a one-time one (and every open session
    // ends), so only the person the super admin passes it to can sign in.
    // An account with no password (Google only) has no such secret to drop.
    if (existing.passwordHash) password = temporaryPassword();
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role,
        status: "ACTIVE",
        statusReason: null,
        statusChangedAt: new Date(),
        ...(password
          ? { passwordHash: await bcrypt.hash(password, 10), passwordChangedAt: new Date() }
          : {}),
      },
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

  const assigned = role === "UNIVERSITY_ADMIN" ? await setAssignments(userId, universityIds, actorId) : [];

  await recordAudit({
    actorId,
    action: "admin.create",
    entity: "admin",
    entityId: userId,
    entityLabel: name,
    summary:
      (existing ? `Gave ${email} admin access as ${role}` : `Created admin account ${email} as ${role}`) +
      (reason ? ` (${reason})` : ""),
    metadata: { role, universityIds: assigned },
  });

  return { ok: true, userId, promoted: Boolean(existing), temporaryPassword: password, universityIds: assigned };
}
