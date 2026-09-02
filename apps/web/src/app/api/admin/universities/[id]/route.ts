import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  emptyToNull,
  notFound,
  parseBooleanParam,
  prismaErrorResponse,
  readJson,
  slugify,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { deleteMediaByUrl } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

const UNIVERSITY_TYPES = ["PUBLIC", "PRIVATE", "SPECIALIZED"] as const;

const CHILD_COUNTS = {
  faculties: true,
  programs: true,
  images: true,
  features: true,
  contentBlocks: true,
  minimumScores: true,
} as const;

/**
 * A URL column. Empty string clears it; anything else must be http(s) —
 * `z.string().url()` also accepts `javascript:`, which would end up in an
 * `href` on the public page.
 */
const urlField = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Enter a valid URL",
  )
  .nullish();

const emailField = z
  .string()
  .trim()
  .max(200)
  .refine(
    (value) => value === "" || z.string().email().safeParse(value).success,
    "Enter a valid email address",
  )
  .nullish();

const establishedYearField = z
  .number()
  .int()
  .min(1000, "Established year looks wrong")
  // Checked per request rather than at import time, so a server that has been
  // up since last year still accepts the current one.
  .refine(
    (year) => year <= new Date().getFullYear() + 1,
    "Established year cannot be in the future",
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
    name: z.string().trim().min(1, "Name is required").max(200),
    nameAr: z.string().trim().max(200).nullish(),
    slug: z.string().trim().max(120).nullish(),
    type: z.enum(UNIVERSITY_TYPES),
    country: z.string().trim().min(1, "Country is required").max(100),
    countryAr: z.string().trim().max(100).nullish(),
    city: z.string().trim().min(1, "City is required").max(100),
    cityAr: z.string().trim().max(100).nullish(),
    description: z.string().trim().max(2000).nullish(),
    descriptionAr: z.string().trim().max(2000).nullish(),
    aboutRich: z.string().trim().max(20000).nullish(),
    aboutRichAr: z.string().trim().max(20000).nullish(),
    websiteUrl: urlField,
    logoUrl: urlField,
    coverImageUrl: urlField,
    establishedYear: establishedYearField,
    addressLine: z.string().trim().max(300).nullish(),
    addressLineAr: z.string().trim().max(300).nullish(),
    phone: z.string().trim().max(40).nullish(),
    email: emailField,
    isFeatured: z.boolean(),
    isRecommended: z.boolean(),
    isTrending: z.boolean(),
    latitude: z.number().min(-90).max(90).nullish(),
    longitude: z.number().min(-180).max(180).nullish(),
    published: z.boolean(),
  })
  .partial();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const university = await prisma.university.findUnique({
    where: { id },
    include: { _count: { select: CHILD_COUNTS } },
  });

  if (!university) return notFound("University");

  return NextResponse.json(university);
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

  const existing = await prisma.university.findUnique({
    where: { id },
    select: { publishedAt: true, logoUrl: true, coverImageUrl: true },
  });
  if (!existing) return notFound("University");

  const data: Prisma.UniversityUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.nameAr !== undefined) data.nameAr = emptyToNull(input.nameAr);
  if (input.type !== undefined) data.type = input.type;
  if (input.country !== undefined) data.country = input.country;
  if (input.countryAr !== undefined) {
    data.countryAr = emptyToNull(input.countryAr);
  }
  if (input.city !== undefined) data.city = input.city;
  if (input.cityAr !== undefined) data.cityAr = emptyToNull(input.cityAr);
  if (input.description !== undefined) {
    data.description = emptyToNull(input.description);
  }
  if (input.descriptionAr !== undefined) {
    data.descriptionAr = emptyToNull(input.descriptionAr);
  }
  if (input.aboutRich !== undefined) {
    data.aboutRich = emptyToNull(input.aboutRich);
  }
  if (input.aboutRichAr !== undefined) {
    data.aboutRichAr = emptyToNull(input.aboutRichAr);
  }
  if (input.websiteUrl !== undefined) {
    data.websiteUrl = emptyToNull(input.websiteUrl);
  }
  if (input.logoUrl !== undefined) data.logoUrl = emptyToNull(input.logoUrl);
  if (input.coverImageUrl !== undefined) {
    data.coverImageUrl = emptyToNull(input.coverImageUrl);
  }
  if (input.establishedYear !== undefined) {
    data.establishedYear = input.establishedYear ?? null;
  }
  if (input.addressLine !== undefined) {
    data.addressLine = emptyToNull(input.addressLine);
  }
  if (input.addressLineAr !== undefined) {
    data.addressLineAr = emptyToNull(input.addressLineAr);
  }
  if (input.phone !== undefined) data.phone = emptyToNull(input.phone);
  if (input.email !== undefined) data.email = emptyToNull(input.email);
  if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
  if (input.isRecommended !== undefined) {
    data.isRecommended = input.isRecommended;
  }
  if (input.isTrending !== undefined) data.isTrending = input.isTrending;
  if (input.latitude !== undefined) data.latitude = input.latitude ?? null;
  if (input.longitude !== undefined) data.longitude = input.longitude ?? null;

  if (input.slug !== undefined) {
    // Renaming deliberately does not re-derive the slug: the public URL is
    // already out there, so a new one has to be asked for explicitly.
    const slug = slugify(emptyToNull(input.slug) ?? "");
    if (!slug) return badRequest("Slug cannot be empty", "slug");
    data.slug = slug;
  }

  if (input.published !== undefined) {
    // publishedAt is both the flag and the "went live at" timestamp, so
    // re-publishing something that is already live must not move the date.
    data.publishedAt = input.published
      ? (existing.publishedAt ?? new Date())
      : null;
  }

  let updated;
  try {
    updated = await prisma.university.update({
      where: { id },
      data,
      include: { _count: { select: CHILD_COUNTS } },
    });
  } catch (error) {
    return prismaErrorResponse(error, "University");
  }

  // Only after the row is safely updated, and never fatal: an orphaned object
  // in the bucket is cheaper than a failed save. deleteMediaByUrl ignores URLs
  // that are not ours, so an externally hosted logo is left alone.
  //
  // Each old URL is checked against BOTH new ones rather than against its own
  // column: swapping the logo and the cover in one PATCH leaves every column
  // changed while nothing has actually stopped being referenced, and a
  // per-column comparison would delete both objects out from under the row.
  const stillReferenced = new Set([updated.logoUrl, updated.coverImageUrl]);
  for (const url of [existing.logoUrl, existing.coverImageUrl]) {
    if (url && !stillReferenced.has(url)) {
      await deleteMediaByUrl(url);
    }
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

  const university = await prisma.university.findUnique({
    where: { id },
    select: {
      logoUrl: true,
      coverImageUrl: true,
      images: { select: { url: true } },
      _count: { select: CHILD_COUNTS },
    },
  });
  if (!university) return notFound("University");

  // The delete cascades to faculties, programs, images, features, content
  // blocks and minimum scores. That is far too much to lose to a misclick, so
  // the caller has to come back with ?confirm=true once it has shown the
  // counts below to whoever clicked.
  if (parseBooleanParam(request, "confirm") !== true) {
    return NextResponse.json(
      {
        error:
          "Deleting this university also deletes everything under it. Retry with ?confirm=true.",
        counts: university._count,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.university.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "University");
  }

  // Best effort, after the row is gone: the storage objects have nothing
  // pointing at them any more.
  for (const url of [
    university.logoUrl,
    university.coverImageUrl,
    ...university.images.map((image) => image.url),
  ]) {
    await deleteMediaByUrl(url);
  }

  return NextResponse.json({ ok: true });
}
