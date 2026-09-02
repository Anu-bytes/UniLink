import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  emptyToNull,
  page,
  parseListParams,
  parseParam,
  prismaErrorResponse,
  readJson,
  slugify,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = ["name", "sortOrder", "createdAt", "updatedAt"] as const;

/** The university every row is shown against in the faculties table. */
const UNIVERSITY_SELECT = {
  id: true,
  name: true,
  nameAr: true,
  slug: true,
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

// `universityId` is the only extra required column: a faculty cannot exist
// without a parent, and the relation is not nullable.
const createSchema = z.object({
  universityId: z.string().trim().min(1, "University is required").max(50),
  name: z.string().trim().min(1, "Name is required").max(200),
  nameAr: z.string().trim().max(200).nullish(),
  slug: z.string().trim().max(120).nullish(),
  description: z.string().trim().max(2000).nullish(),
  descriptionAr: z.string().trim().max(2000).nullish(),
  imageUrl: urlField,
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

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
  exceptId?: string,
): Promise<string> {
  const siblings = await prisma.faculty.findMany({
    where: {
      universityId,
      slug: { startsWith: base },
      ...(exceptId ? { id: { not: exceptId } } : {}),
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

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const universityId = parseParam(request, "universityId");

  const where: Prisma.FacultyWhereInput = {
    ...(universityId ? { universityId } : {}),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { nameAr: { contains: params.q, mode: "insensitive" } },
            { slug: { contains: params.q, mode: "insensitive" } },
            // Searching the parent's name lets "Cairo" find every faculty of
            // Cairo University, which is how the table is actually used.
            {
              university: {
                is: { name: { contains: params.q, mode: "insensitive" } },
              },
            },
            {
              university: {
                is: { nameAr: { contains: params.q, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.faculty.findMany({
      where,
      // `id` breaks ties. Every university numbers its own faculties from 0,
      // so a cross-university list sorted by sortOrder is almost entirely
      // ties, and Postgres is free to return those in a different order per
      // query — which makes rows jump between pages as the admin pages
      // through.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
      include: {
        university: { select: UNIVERSITY_SELECT },
        _count: { select: { programs: true } },
      },
    }),
    prisma.faculty.count({ where }),
  ]);

  return NextResponse.json(page(items, total, params));
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const [university, positions] = await prisma.$transaction([
    prisma.university.findUnique({
      where: { id: input.universityId },
      select: { id: true },
    }),
    prisma.faculty.aggregate({
      where: { universityId: input.universityId },
      _max: { sortOrder: true },
    }),
  ]);
  // The id came from the body, so a stale or hand-typed one is a bad request
  // rather than the foreign-key 500 Prisma would otherwise raise.
  if (!university) {
    return badRequest("That university does not exist", "universityId");
  }

  const base = slugify(emptyToNull(input.slug) ?? input.name);
  if (!base) {
    return badRequest("Slug cannot be derived from this name", "slug");
  }
  const slug = await uniqueSlug(input.universityId, base);

  try {
    const created = await prisma.faculty.create({
      data: {
        universityId: input.universityId,
        name: input.name,
        nameAr: emptyToNull(input.nameAr),
        slug,
        description: emptyToNull(input.description),
        descriptionAr: emptyToNull(input.descriptionAr),
        imageUrl: emptyToNull(input.imageUrl),
        // A new faculty lands at the end of its university's list unless the
        // caller pins it.
        sortOrder: input.sortOrder ?? (positions._max.sortOrder ?? -1) + 1,
      },
      include: {
        university: { select: UNIVERSITY_SELECT },
        _count: { select: { programs: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Faculty");
  }
}
