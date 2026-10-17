import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { catalogueWrite } from "@/lib/admin-changes";
import { contentBlockUpdateSchema as updateSchema } from "@/lib/content-block-schemas";
import { emptyToNull, prismaErrorResponse, readJson } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function patchHandler(
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

async function deleteHandler(
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

// Writes go through the review queue: applied directly for a super admin,
// queued for approval for a university admin. See lib/admin-changes.ts.
export const PATCH = catalogueWrite("contentBlock", "UPDATE", patchHandler, { validate: updateSchema });
export const DELETE = catalogueWrite("contentBlock", "DELETE", deleteHandler);
