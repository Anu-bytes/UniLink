import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  emptyToNull,
  notFound,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { deleteMediaByUrl } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

const updateSchema = z
  .object({
    url: z
      .string()
      .trim()
      .min(1, "Image URL is required")
      .max(500)
      .regex(/^https?:\/\/\S+$/i, "Enter a valid URL"),
    alt: z.string().trim().max(300).nullish(),
    altAr: z.string().trim().max(300).nullish(),
    sortOrder: z.number().int().min(0).max(9999),
  })
  .partial();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, imageId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  // Scoped by universityId, so one university's id can never address another's
  // image even with a guessed imageId.
  const existing = await prisma.universityImage.findFirst({
    where: { id: imageId, universityId },
    select: { url: true },
  });
  if (!existing) return notFound("Image");

  const data: Prisma.UniversityImageUpdateInput = {};
  if (input.url !== undefined) data.url = input.url;
  if (input.alt !== undefined) data.alt = emptyToNull(input.alt);
  if (input.altAr !== undefined) data.altAr = emptyToNull(input.altAr);
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  let updated;
  try {
    updated = await prisma.universityImage.update({
      where: { id: imageId, universityId },
      data,
    });
  } catch (error) {
    return prismaErrorResponse(error, "Image");
  }

  // Best effort once the row is safely updated: a leftover object in the
  // bucket is cheaper than a failed save.
  if (existing.url !== updated.url) {
    await deleteMediaByUrl(existing.url);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, imageId } = await params;

  let deleted;
  try {
    deleted = await prisma.universityImage.delete({
      where: { id: imageId, universityId },
    });
  } catch (error) {
    return prismaErrorResponse(error, "Image");
  }

  await deleteMediaByUrl(deleted.url);

  return NextResponse.json({ ok: true });
}
