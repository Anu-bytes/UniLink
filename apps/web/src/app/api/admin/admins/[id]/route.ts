import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, isAdminRole, requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { otherActiveSuperAdmins, setAssignments, temporaryPassword } from "@/lib/admin-accounts";
import { recordAudit, type AuditAction } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const updateSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    role: z.enum(ADMIN_ROLES as [string, ...string[]]),
    status: z.enum(["ACTIVE", "DISABLED", "BANNED"]),
    statusReason: z.string().trim().max(500).nullish(),
    universityIds: z.array(z.string().min(1)).max(200),
    resetPassword: z.literal(true),
  })
  .partial();

type Params = { params: Promise<{ id: string }> };

async function loadAdmin(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  return user && isAdminRole(user.role) ? user : null;
}

/**
 * Change an admin: role, status (with a reason), name, university
 * assignments, or issue a new one-time password. Super admins only, never on
 * their own account, and never in a way that leaves no active super admin.
 */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const admin = await loadAdmin(id);
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const selfChange = id === guard.actor.id && (input.role !== undefined || input.status !== undefined);
  if (selfChange) {
    return NextResponse.json({ error: "You cannot change your own role or status" }, { status: 400 });
  }

  const losesSuperAdmin =
    admin.role === "ADMIN" &&
    admin.status === "ACTIVE" &&
    ((input.role !== undefined && input.role !== "ADMIN") || (input.status !== undefined && input.status !== "ACTIVE"));
  if (losesSuperAdmin && (await otherActiveSuperAdmins(id)) === 0) {
    return NextResponse.json({ error: "This is the last active super admin" }, { status: 400 });
  }

  const nextRole = input.role ?? admin.role;
  const events: { action: AuditAction; summary: string }[] = [];
  let password: string | null = null;

  const data: Record<string, unknown> = {};
  if (input.name !== undefined && input.name !== admin.name) data.name = input.name;
  if (input.role !== undefined && input.role !== admin.role) {
    data.role = input.role;
    events.push({ action: "admin.role", summary: `Changed ${admin.email} from ${admin.role} to ${input.role}` });
  }
  if (input.status !== undefined && input.status !== admin.status) {
    data.status = input.status;
    data.statusChangedAt = new Date();
    data.statusReason = input.status === "ACTIVE" ? null : (input.statusReason ?? null);
    const action: AuditAction =
      input.status === "ACTIVE" ? (admin.status === "BANNED" ? "admin.unban" : "admin.enable") : input.status === "BANNED" ? "admin.ban" : "admin.disable";
    const verb = { "admin.unban": "Unbanned", "admin.enable": "Re-enabled", "admin.ban": "Banned", "admin.disable": "Disabled" }[action as string];
    events.push({ action, summary: `${verb} ${admin.email}${input.statusReason ? `: ${input.statusReason}` : ""}` });
  }
  if (input.resetPassword) {
    password = temporaryPassword();
    data.passwordHash = await bcrypt.hash(password, 10);
    // Ends every session the admin has open.
    data.passwordChangedAt = new Date();
    events.push({ action: "admin.password", summary: `Issued a new one-time password for ${admin.email}` });
  }

  if (Object.keys(data).length) await prisma.user.update({ where: { id }, data });

  if (input.universityIds !== undefined || (data.role && nextRole !== "UNIVERSITY_ADMIN")) {
    const ids = nextRole === "UNIVERSITY_ADMIN" ? (input.universityIds ?? []) : [];
    const assigned = await setAssignments(id, ids, guard.actor.id);
    if (input.universityIds !== undefined) {
      events.push({ action: "admin.assign", summary: `Assigned ${admin.email} to ${assigned.length} universit${assigned.length === 1 ? "y" : "ies"}` });
    }
  }

  for (const event of events) {
    await recordAudit({
      actorId: guard.actor.id,
      action: event.action,
      entity: "admin",
      entityId: id,
      entityLabel: admin.name ?? admin.email,
      summary: event.summary,
    });
  }

  return NextResponse.json({ ok: true, temporaryPassword: password });
}

/**
 * Remove an admin. `?mode=revoke` (default) turns the account back into a
 * regular student account and drops its assignments; `?mode=delete` deletes
 * the account entirely. Their audit history stays, without the link.
 */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  const mode = new URL(request.url).searchParams.get("mode") === "delete" ? "delete" : "revoke";

  if (id === guard.actor.id) {
    return NextResponse.json({ error: "You cannot remove your own account" }, { status: 400 });
  }
  const admin = await loadAdmin(id);
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  if (admin.role === "ADMIN" && admin.status === "ACTIVE" && (await otherActiveSuperAdmins(id)) === 0) {
    return NextResponse.json({ error: "This is the last active super admin" }, { status: 400 });
  }

  if (mode === "delete") {
    await prisma.user.delete({ where: { id } });
  } else {
    await prisma.$transaction([
      prisma.universityAdminAssignment.deleteMany({ where: { userId: id } }),
      prisma.user.update({ where: { id }, data: { role: "STUDENT" } }),
    ]);
  }

  await recordAudit({
    actorId: guard.actor.id,
    action: mode === "delete" ? "admin.delete" : "admin.remove",
    entity: "admin",
    entityId: mode === "delete" ? null : id,
    entityLabel: admin.name ?? admin.email,
    summary: mode === "delete" ? `Deleted the account of ${admin.email}` : `Removed admin access from ${admin.email}`,
  });

  return NextResponse.json({ ok: true });
}
