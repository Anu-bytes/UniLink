import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { emptyToNull, prismaErrorResponse, readJson } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const updateSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    titleAr: z.string().trim().max(200).nullish(),
    body: z.string().trim().max(2000).nullish(),
    bodyAr: z.string().trim().max(2000).nullish(),
    sortOrder: z.number().int().min(0).max(9999),
  })
  .partial();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; featureId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, featureId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const data: Prisma.UniversityFeatureUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.titleAr !== undefined) data.titleAr = emptyToNull(input.titleAr);
  if (input.body !== undefined) data.body = emptyToNull(input.body);
  if (input.bodyAr !== undefined) data.bodyAr = emptyToNull(input.bodyAr);
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  try {
    // Scoped by universityId, so one university's id can never address
    // another's feature even with a guessed featureId.
    const updated = await prisma.universityFeature.update({
      where: { id: featureId, universityId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "Feature");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; featureId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, featureId } = await params;

  try {
    await prisma.universityFeature.delete({
      where: { id: featureId, universityId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "Feature");
  }
}
