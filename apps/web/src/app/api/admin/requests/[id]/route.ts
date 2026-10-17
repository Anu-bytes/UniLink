import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { recordAudit } from "@/lib/admin-audit";
import { PARTNER_REQUEST_STATUSES, SETTABLE_STATUSES } from "@/lib/partner-requests";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const updateSchema = z
  .object({
    status: z.enum(PARTNER_REQUEST_STATUSES),
    internalNote: z.string().max(4000).nullable(),
    scheduledAt: z.string().datetime({ offset: true }).nullable(),
  })
  .partial();

function crossSite(request: Request) {
  return request.headers.get("sec-fetch-site") === "cross-site";
}

/** Review a demo request or representative application: status, note, demo time. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (crossSite(request)) return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const current = await prisma.partnerRequest.findUnique({
    where: { id },
    select: { id: true, type: true, status: true, scheduledAt: true, universityName: true },
  });
  if (!current) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  if (input.status && input.status !== current.status && !SETTABLE_STATUSES[current.type].includes(input.status)) {
    return NextResponse.json(
      {
        error:
          current.type === "REPRESENTATIVE" && input.status === "APPROVED"
            ? "Use Grant access to approve a representative"
            : "This status does not apply to this kind of request",
      },
      { status: 400 },
    );
  }
  if (current.status === "APPROVED" && input.status && input.status !== "APPROVED") {
    return NextResponse.json(
      { error: "This representative already has admin access. Remove it from the Admins page first." },
      { status: 409 },
    );
  }

  const scheduledAt = input.scheduledAt === undefined ? undefined : input.scheduledAt ? new Date(input.scheduledAt) : null;
  const nextStatus = input.status ?? current.status;
  const nextScheduledAt = scheduledAt === undefined ? current.scheduledAt : scheduledAt;
  if (nextStatus === "SCHEDULED" && !nextScheduledAt) {
    return NextResponse.json({ error: "Pick the demo date and time first", field: "scheduledAt" }, { status: 400 });
  }

  const data: Prisma.PartnerRequestUpdateInput = {};
  if (input.status !== undefined) data.status = input.status;
  if (input.internalNote !== undefined) data.internalNote = input.internalNote?.trim() || null;
  if (scheduledAt !== undefined) data.scheduledAt = scheduledAt;
  if (input.status !== undefined && input.status !== current.status) {
    data.reviewer = { connect: { id: guard.actor.id } };
    data.reviewedAt = new Date();
  }

  const updated = await prisma.partnerRequest.update({ where: { id }, data });

  if (input.status !== undefined && input.status !== current.status) {
    await recordAudit({
      actorId: guard.actor.id,
      action: "update",
      entity: "partnerRequest",
      entityId: id,
      entityLabel: current.universityName,
      summary: `Marked ${current.type === "DEMO" ? "demo request" : "representative application"} from ${current.universityName} as ${input.status}`,
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (crossSite(request)) return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const current = await prisma.partnerRequest.findUnique({ where: { id }, select: { type: true, universityName: true } });
  if (!current) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  await prisma.partnerRequest.delete({ where: { id } });
  await recordAudit({
    actorId: guard.actor.id,
    action: "delete",
    entity: "partnerRequest",
    entityId: id,
    entityLabel: current.universityName,
    summary: `Deleted ${current.type === "DEMO" ? "demo request" : "representative application"} from ${current.universityName}`,
  });
  return NextResponse.json({ ok: true });
}
