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

const UNIVERSITY_SELECT = {
  id: true,
  name: true,
  nameAr: true,
  slug: true,
} as const;

const CHILD_COUNTS = { programs: true, minimumScores: true } as const;

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

/**
 * Same shape as the create schema, made partial: an absent key leaves the
 * column alone, while an explicit null or "" clears it. That distinction is
 * the whole reason the handler below assembles `data` key by key instead of
 * spreading the parsed body.
 */
const updateSchema = z
  .object({
    universityId: z.string().trim().min(1, "University is required").max(50),
    name: z.string().trim().min(1, "Name is required").max(200),
    nameAr: z.string().trim().max(200).nullish(),
    slug: z.string().trim().max(120).nullish(),
    description: z.string().trim().max(2000).nullish(),
    descriptionAr: z.string().trim().max(2000).nullish(),
    imageUrl: urlField,
    sortOrder: z.number().int().min(0).max(9999),
  })
  .partial();

/**
 * Resolve a slug that is free inside `universityId`. The unique constraint is
 * `@@unique([universityId, slug])`, so two universities may each have a
 * "faculty-of-engineering" — only a clash within one of them matters.
 *
 * A clash suffixes -2, -3, … instead of returning 409. The slug is a URL
 * detail the admin usually never types, and the row it collides with may
 * belong to a university they are not even looking at, so a conflict here is
 * not something they could act on.
 */
async function uniqueSlug(
  universityId: string,
  base: string,
  exceptId: string,
): Promise<string> {
  const siblings = await prisma.faculty.findMany({
    where: {
      universityId,
      slug: { startsWith: base },
      id: { not: exceptId },
    },
    select: { slug: true },
  });

  const taken = new Set(siblings.map((faculty) => faculty.slug));
  let candidate = base;
  let suffix = 1;

  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: {
      university: { select: UNIVERSITY_SELECT },
      _count: { select: CHILD_COUNTS },
    },
  });

  if (!faculty) return notFound("Faculty");

  return NextResponse.json(faculty);
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

  const existing = await prisma.faculty.findUnique({
    where: { id },
    select: { universityId: true, slug: true, imageUrl: true },
  });
  if (!existing) return notFound("Faculty");

  const data: Prisma.FacultyUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.nameAr !== undefined) data.nameAr = emptyToNull(input.nameAr);
  if (input.description !== undefined) {
    data.description = emptyToNull(input.description);
  }
  if (input.descriptionAr !== undefined) {
    data.descriptionAr = emptyToNull(input.descriptionAr);
  }
  if (input.imageUrl !== undefined) data.imageUrl = emptyToNull(input.imageUrl);
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  const universityId = input.universityId ?? existing.universityId;
  const movedTo = universityId === existing.universityId ? null : universityId;

  if (movedTo) {
    const university = await prisma.university.findUnique({
      where: { id: movedTo },
      select: { id: true },
    });
    // The id came from the body, so a stale or hand-typed one is a bad request
    // rather than the foreign-key 500 Prisma would otherwise raise.
    if (!university) {
      return badRequest("That university does not exist", "universityId");
    }
    data.university = { connect: { id: movedTo } };
  }

  // Renaming deliberately does not re-derive the slug: the public URL is
  // already out there, so a new one has to be asked for explicitly.
  const base =
    input.slug === undefined
      ? existing.slug
      : slugify(emptyToNull(input.slug) ?? "");
  if (!base) return badRequest("Slug cannot be empty", "slug");

  // Uniqueness is per university, so a move re-checks the unchanged slug
  // against its new siblings just as a rename re-checks it against the old.
  if (base !== existing.slug || universityId !== existing.universityId) {
    data.slug = await uniqueSlug(universityId, base, id);
  }

  let updated;
  try {
    updated = await prisma.$transaction(async (tx) => {
      const row = await tx.faculty.update({
        where: { id },
        data,
        include: {
          university: { select: UNIVERSITY_SELECT },
          _count: { select: CHILD_COUNTS },
        },
      });

      // Program and MinimumScore each carry their own universityId next to
      // facultyId, and both admin routes that create them refuse to file a row
      // under another university's faculty. Leaving the children behind on a
      // move would manufacture exactly the row those checks exist to prevent,
      // so they travel with the faculty.
      //
      // Program's slug is unique per university, so a name already taken in
      // the destination rolls the whole move back into a 409 rather than
      // half-moving the faculty.
      if (movedTo) {
        await tx.program.updateMany({
          where: { facultyId: id },
          data: { universityId: movedTo },
        });
        await tx.minimumScore.updateMany({
          where: { facultyId: id },
          data: { universityId: movedTo },
        });
      }

      return row;
    });
  } catch (error) {
    return prismaErrorResponse(error, "Faculty");
  }

  // Only after the row is safely updated, and never fatal: an orphaned object
  // in the bucket is cheaper than a failed save. deleteMediaByUrl ignores URLs
  // that are not ours, so an externally hosted image is left alone.
  if (existing.imageUrl && existing.imageUrl !== updated.imageUrl) {
    await deleteMediaByUrl(existing.imageUrl);
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

  const faculty = await prisma.faculty.findUnique({
    where: { id },
    select: { imageUrl: true, _count: { select: CHILD_COUNTS } },
  });
  if (!faculty) return notFound("Faculty");

  // The delete cascades to this faculty's minimum scores and detaches its
  // programs (Program.facultyId is onDelete: SetNull, so they survive without
  // a faculty). Both are too easy to do by accident, so the caller has to come
  // back with ?confirm=true once it has shown the counts below to whoever
  // clicked.
  if (parseBooleanParam(request, "confirm") !== true) {
    return NextResponse.json(
      {
        error:
          "Deleting this faculty also deletes its minimum scores and leaves its programs without a faculty. Retry with ?confirm=true.",
        counts: faculty._count,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.faculty.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Faculty");
  }

  // Best effort, after the row is gone: the storage object has nothing
  // pointing at it any more.
  await deleteMediaByUrl(faculty.imageUrl);

  return NextResponse.json({ ok: true });
}
