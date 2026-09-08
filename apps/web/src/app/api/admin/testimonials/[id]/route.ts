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

/**
 * The portrait column. Empty string clears it; anything else must be http(s) —
 * `z.string().url()` also accepts `javascript:`, which would end up in a `src`
 * on the public page.
 */
const avatarUrlField = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Enter a valid URL",
  )
  .nullish();

/**
 * Same shape as the create schema, made partial: an absent key leaves the
 * column alone, while an explicit null or "" clears it. That distinction is
 * the whole reason the handler below assembles `data` key by key instead of
 * spreading the parsed body.
 */
const updateSchema = z
  .object({
    studentName: z.string().trim().min(1, "Student name is required").max(200),
    quote: z.string().trim().min(1, "Quote is required").max(2000),
    quoteAr: z.string().trim().max(2000).nullish(),
    location: z.string().trim().max(200).nullish(),
    locationAr: z.string().trim().max(200).nullish(),
    avatarUrl: avatarUrlField,
    sortOrder: z.number().int().min(0).max(9999),
    isPublished: z.boolean(),
  })
  .partial();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return notFound("Testimonial");

  return NextResponse.json(testimonial);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const existing = await prisma.testimonial.findUnique({
    where: { id },
    select: { avatarUrl: true },
  });
  if (!existing) return notFound("Testimonial");

  const data: Prisma.TestimonialUpdateInput = {};

  if (input.studentName !== undefined) data.studentName = input.studentName;
  if (input.quote !== undefined) data.quote = input.quote;
  if (input.quoteAr !== undefined) data.quoteAr = emptyToNull(input.quoteAr);
  if (input.location !== undefined) data.location = emptyToNull(input.location);
  if (input.locationAr !== undefined) {
    data.locationAr = emptyToNull(input.locationAr);
  }
  if (input.avatarUrl !== undefined) {
    data.avatarUrl = emptyToNull(input.avatarUrl);
  }
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;

  let updated;
  try {
    updated = await prisma.testimonial.update({ where: { id }, data });
  } catch (error) {
    return prismaErrorResponse(error, "Testimonial");
  }

  // Only after the row is safely updated, and never fatal: an orphaned object
  // in the bucket is cheaper than a failed save. deleteMediaByUrl ignores URLs
  // that are not ours, so an externally hosted portrait is left alone.
  if (existing.avatarUrl && existing.avatarUrl !== updated.avatarUrl) {
    await deleteMediaByUrl(existing.avatarUrl);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const existing = await prisma.testimonial.findUnique({
    where: { id },
    select: { avatarUrl: true },
  });
  if (!existing) return notFound("Testimonial");

  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Testimonial");
  }

  // Best effort, after the row is gone: nothing points at the portrait now.
  await deleteMediaByUrl(existing.avatarUrl);

  return NextResponse.json({ ok: true });
}
