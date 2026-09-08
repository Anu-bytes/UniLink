import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { emptyToNull, prismaErrorResponse, readJson } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CONTENT_SECTIONS = [
  "ADMISSION_REQUIREMENTS",
  "ADMISSION_CRITERIA",
  "TUITION_NOTES",
  "ABOUT_EXTRA",
] as const;

const updateSchema = z
  .object({
    section: z.enum(CONTENT_SECTIONS),
    title: z.string().trim().max(200).nullish(),
    titleAr: z.string().trim().max(200).nullish(),
    body: z.string().trim().min(1, "Body is required").max(20000),
    bodyAr: z.string().trim().max(20000).nullish(),
    sortOrder: z.number().int().min(0).max(9999),
  })
  .partial();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, blockId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const data: Prisma.UniversityContentBlockUpdateInput = {};
  if (input.section !== undefined) data.section = input.section;
  if (input.title !== undefined) data.title = emptyToNull(input.title);
  if (input.titleAr !== undefined) data.titleAr = emptyToNull(input.titleAr);
  if (input.body !== undefined) data.body = input.body;
  if (input.bodyAr !== undefined) data.bodyAr = emptyToNull(input.bodyAr);
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  try {
    // Scoped by universityId, so one university's id can never address
    // another's block even with a guessed blockId.
    const updated = await prisma.universityContentBlock.update({
      where: { id: blockId, universityId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "Content block");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, blockId } = await params;

  try {
    await prisma.universityContentBlock.delete({
      where: { id: blockId, universityId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "Content block");
  }
}
