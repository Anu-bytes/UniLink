import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { recordAudit } from "@/lib/admin-audit";
import { describeChange, reviewChangeRequest } from "@/lib/admin-changes";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().trim().max(1000).nullish(),
});

/** Approve or reject one pending change. Reviewers and super admins. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin({ minLevel: 2 });
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const body = await readJson(request, reviewSchema);
  if (!body.ok) return body.response;

  const result = await reviewChangeRequest(
    guard.actor,
    id,
    body.data.decision,
    body.data.note || null,
    new URL(request.url).origin,
  );
  return result.ok
    ? NextResponse.json({ status: result.status })
    : NextResponse.json({ error: result.error }, { status: result.status });
}

/** Withdraw your own change while it is still waiting. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin({ minLevel: 1 });
  if (!guard.ok) return guard.response;
  const { id } = await params;

  const change = await prisma.changeRequest.findUnique({ where: { id } });
  if (!change || (change.authorId !== guard.actor.id && guard.actor.level < 3)) {
    return NextResponse.json({ error: "Change request not found" }, { status: 404 });
  }
  if (change.status !== "PENDING") {
    return NextResponse.json({ error: "This change has already been reviewed" }, { status: 409 });
  }

  await prisma.changeRequest.update({ where: { id }, data: { status: "WITHDRAWN", reviewedAt: new Date() } });
  await recordAudit({
    actorId: guard.actor.id,
    action: "withdraw",
    entity: change.entity,
    entityId: change.entityId,
    entityLabel: change.entityLabel,
    universityId: change.universityId,
    summary: `Withdrew: ${describeChange(change.action, change.entity, change.entityLabel, Object.keys((change.payload as object) ?? {}))}`,
    metadata: { changeRequestId: id },
  });
  return NextResponse.json({ status: "WITHDRAWN" });
}
