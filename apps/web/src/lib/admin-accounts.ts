// Shared rules for managing admin accounts (the /admin/admins pages and
// /api/admin/admins routes).

import { randomBytes } from "node:crypto";

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
