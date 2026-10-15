// The admin audit log: one row per thing an admin did. Read back as each
// admin's "recent changes" and as the activity feed on the admins page.
//
// Never let logging break the action it describes: a failed insert is
// reported to the server log and swallowed.

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "submit"
  | "approve"
  | "reject"
  | "withdraw"
  | "admin.create"
  | "admin.role"
  | "admin.assign"
  | "admin.disable"
  | "admin.enable"
  | "admin.ban"
  | "admin.unban"
  | "admin.remove"
  | "admin.delete"
  | "admin.password";

export async function recordAudit(entry: {
  actorId: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  entityLabel?: string | null;
  universityId?: string | null;
  summary: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        entityLabel: entry.entityLabel ?? null,
        universityId: entry.universityId ?? null,
        summary: entry.summary.slice(0, 500),
        metadata: entry.metadata,
      },
    });
  } catch (error) {
    console.error("Unable to write the admin audit log", error);
  }
}
