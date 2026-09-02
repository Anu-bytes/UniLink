import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  emptyToNull,
  page,
  parseBooleanParam,
  parseEnumFilter,
  parseListParams,
  parseParam,
  prismaErrorResponse,
  readJson,
  slugify,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const UNIVERSITY_TYPES = ["PUBLIC", "PRIVATE", "SPECIALIZED"] as const;

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = [
  "name",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "viewCount",
] as const;

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

// `type`, `country` and `city` are NOT NULL without a default, so unlike every
// other column they cannot be left out at create time.
const createSchema = z.object({
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
  isFeatured: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  published: z.boolean().optional(),
});

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const types = parseEnumFilter(request, "type", UNIVERSITY_TYPES);
  const country = parseParam(request, "country");
  const published = parseBooleanParam(request, "published");
  const featured = parseBooleanParam(request, "featured");
  const recommended = parseBooleanParam(request, "recommended");
  const trending = parseBooleanParam(request, "trending");

  const where: Prisma.UniversityWhereInput = {
    ...(types.length > 0 ? { type: { in: types } } : {}),
    ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
    // There is no boolean column: a university is published exactly when
    // publishedAt is set, so the filter is a null check.
    ...(published === null
      ? {}
      : { publishedAt: published ? { not: null } : null }),
    ...(featured === null ? {} : { isFeatured: featured }),
    ...(recommended === null ? {} : { isRecommended: recommended }),
    ...(trending === null ? {} : { isTrending: trending }),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { nameAr: { contains: params.q, mode: "insensitive" } },
            { city: { contains: params.q, mode: "insensitive" } },
            { cityAr: { contains: params.q, mode: "insensitive" } },
            { slug: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.university.findMany({
      where,
      orderBy: { [sort]: params.order },
      skip: params.skip,
      take: params.take,
      // The table shows both counts in the row next to the name.
      include: { _count: { select: { faculties: true, programs: true } } },
    }),
    prisma.university.count({ where }),
  ]);

  return NextResponse.json(page(items, total, params));
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const slug = slugify(emptyToNull(input.slug) ?? input.name);
  if (!slug) {
    return badRequest("Slug cannot be derived from this name", "slug");
  }

  try {
    const created = await prisma.university.create({
      data: {
        name: input.name,
        nameAr: emptyToNull(input.nameAr),
        slug,
        type: input.type,
        country: input.country,
        countryAr: emptyToNull(input.countryAr),
        city: input.city,
        cityAr: emptyToNull(input.cityAr),
        description: emptyToNull(input.description),
        descriptionAr: emptyToNull(input.descriptionAr),
        aboutRich: emptyToNull(input.aboutRich),
        aboutRichAr: emptyToNull(input.aboutRichAr),
        websiteUrl: emptyToNull(input.websiteUrl),
        logoUrl: emptyToNull(input.logoUrl),
        coverImageUrl: emptyToNull(input.coverImageUrl),
        establishedYear: input.establishedYear ?? null,
        addressLine: emptyToNull(input.addressLine),
        addressLineAr: emptyToNull(input.addressLineAr),
        phone: emptyToNull(input.phone),
        email: emptyToNull(input.email),
        isFeatured: input.isFeatured ?? false,
        isRecommended: input.isRecommended ?? false,
        isTrending: input.isTrending ?? false,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        publishedAt: input.published ? new Date() : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "University");
  }
}
