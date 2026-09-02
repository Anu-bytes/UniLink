// Read and delete only, for the reason spelled out in ../route.ts: the model
// has no columns an update could touch.

import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { notFound, prismaErrorResponse } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const lead = await prisma.partnershipLead.findUnique({ where: { id } });
  if (!lead) return notFound("Lead");

  return NextResponse.json(lead);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  // No ?confirm=true here, unlike the catalogue routes: a lead is one row with
  // nothing hanging off it, so the delete cannot take anything else with it.
  try {
    await prisma.partnershipLead.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Lead");
  }

  return NextResponse.json({ ok: true });
}
