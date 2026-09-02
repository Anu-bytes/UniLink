import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  emptyToNull,
  page,
  parseBooleanParam,
  parseListParams,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Columns a client may sort by. Anything else falls back to the hand-ordered
 * default below: the value arrives as a raw query string, and Prisma would
 * happily build an `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = ["sortOrder", "createdAt"] as const;

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

const createSchema = z.object({
  studentName: z.string().trim().min(1, "Student name is required").max(200),
  quote: z.string().trim().min(1, "Quote is required").max(2000),
  quoteAr: z.string().trim().max(2000).nullish(),
  location: z.string().trim().max(200).nullish(),
  locationAr: z.string().trim().max(200).nullish(),
  avatarUrl: avatarUrlField,
  sortOrder: z.number().int().min(0).max(9999).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const published = parseBooleanParam(request, "published");

  const where: Prisma.TestimonialWhereInput = {
    ...(published === null ? {} : { isPublished: published }),
    // The Arabic columns are translations of the same two fields, so a search
    // covers both scripts without needing a separate filter.
    ...(params.q
      ? {
          OR: [
            { studentName: { contains: params.q, mode: "insensitive" } },
            { quote: { contains: params.q, mode: "insensitive" } },
            { quoteAr: { contains: params.q, mode: "insensitive" } },
            { location: { contains: params.q, mode: "insensitive" } },
            { locationAr: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : null;

  // The default matches @@index([isPublished, sortOrder]) and the order the
  // public strip renders in; createdAt only breaks ties between two rows
  // sharing a position. An explicit ?sort replaces the pair wholesale.
  //
  // `id` ends every variant, as in the catalogue lists: sortOrder defaults to
  // 0 for every row and a seeded batch shares one createdAt, so without it
  // Postgres is free to return the tied rows in a different order per query —
  // which makes rows jump between pages as the admin pages through.
  const orderBy: Prisma.TestimonialOrderByWithRelationInput[] = sort
    ? [{ [sort]: params.order }, { id: "asc" }]
    : [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "asc" }];

  const [items, total] = await prisma.$transaction([
    prisma.testimonial.findMany({
      where,
      orderBy,
      skip: params.skip,
      take: params.take,
    }),
    prisma.testimonial.count({ where }),
  ]);

  return NextResponse.json(page(items, total, params));
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const positions = await prisma.testimonial.aggregate({
    _max: { sortOrder: true },
  });

  try {
    const created = await prisma.testimonial.create({
      data: {
        studentName: input.studentName,
        quote: input.quote,
        quoteAr: emptyToNull(input.quoteAr),
        location: emptyToNull(input.location),
        locationAr: emptyToNull(input.locationAr),
        avatarUrl: emptyToNull(input.avatarUrl),
        // A new testimonial lands at the end of the strip unless the caller
        // pins it somewhere.
        sortOrder: input.sortOrder ?? (positions._max.sortOrder ?? -1) + 1,
        isPublished: input.isPublished ?? false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Testimonial");
  }
}
