import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  decimalToNumber,
  emptyToNull,
  page,
  parseBooleanParam,
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
const SORT_COLUMNS = ["title", "applicationDeadline", "createdAt"] as const;

const SCHOLARSHIP_RELATIONS = {
  university: { select: { id: true, name: true, nameAr: true, slug: true } },
} satisfies Prisma.ScholarshipInclude;

// @db.Decimal(12, 2) holds twelve digits with two after the point, so anything
// past 9_999_999_999.99 would be rejected by Postgres rather than by zod.
const fundingAmountField = z
  .number()
  .min(0, "Funding amount cannot be negative")
  .max(9999999999.99, "Funding amount is too large")
  .nullish();

// @db.Char(3), and the public pages print it next to the amount, so it has to
// be a real currency code rather than whatever was typed.
const currencyField = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Currency must be a three-letter code");

/**
 * A date input clears itself by sending "", which `z.coerce.date()` would turn
 * into an Invalid Date, so "" is folded to null before the coercion runs.
 */
const deadlineField = z
  .preprocess(
    (value) => (value === "" ? null : value),
    z.coerce.date().nullable(),
  )
  .optional();

// universityId is genuinely optional: the relation is `onDelete: SetNull`, so
// a scholarship outlives the university it was attached to, and a government
// or sponsor scholarship never had one in the first place.
const createSchema = z.object({
  universityId: z.string().trim().max(60).nullish(),
  title: z.string().trim().min(1, "Title is required").max(200),
  titleAr: z.string().trim().max(200).nullish(),
  slug: z.string().trim().max(120).nullish(),
  description: z.string().trim().max(5000).nullish(),
  descriptionAr: z.string().trim().max(5000).nullish(),
  fundingAmount: fundingAmountField,
  currency: currencyField.optional(),
  applicationDeadline: deadlineField,
  isPublished: z.boolean().optional(),
});

/** Prisma hands fundingAmount back as a Decimal; the dashboard sorts numbers. */
function serializeScholarship<
  T extends { fundingAmount: Prisma.Decimal | null },
>(scholarship: T) {
  return {
    ...scholarship,
    fundingAmount: decimalToNumber(scholarship.fundingAmount),
  };
}

/**
 * Scholarship slugs are unique across the whole table, unlike faculties and
 * programs where the constraint is scoped to a university, so a clash with any
 * row anywhere has to be resolved here.
 *
 * A clash suffixes -2, -3, … instead of returning 409. The admin typed a
 * title, not a URL, and the row it collides with may belong to a university
 * they are not even looking at, so a conflict is not something they could act
 * on.
 */
async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  const taken = await prisma.scholarship.findMany({
    where: {
      slug: { startsWith: base },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { slug: true },
  });

  const used = new Set(taken.map((scholarship) => scholarship.slug));
  if (!used.has(base)) return base;

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const universityId = parseParam(request, "universityId");
  const published = parseBooleanParam(request, "published");

  const where: Prisma.ScholarshipWhereInput = {
    ...(universityId ? { universityId } : {}),
    ...(published === null ? {} : { isPublished: published }),
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" } },
            { titleAr: { contains: params.q, mode: "insensitive" } },
            { slug: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.scholarship.findMany({
      where,
      // `id` breaks ties, as in the catalogue lists. `applicationDeadline` is
      // nullable and titles repeat across universities, so Postgres is free to
      // return the tied rows in a different order per query — which makes rows
      // jump between pages as the admin pages through.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
      include: SCHOLARSHIP_RELATIONS,
    }),
    prisma.scholarship.count({ where }),
  ]);

  return NextResponse.json(
    page(items.map(serializeScholarship), total, params),
  );
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const universityId = emptyToNull(input.universityId);
  if (universityId) {
    const university = await prisma.university.findUnique({
      where: { id: universityId },
      select: { id: true },
    });
    if (!university) return badRequest("University not found", "universityId");
  }

  const base = slugify(emptyToNull(input.slug) ?? input.title);
  if (!base) {
    return badRequest("Slug cannot be derived from this title", "slug");
  }

  const slug = await uniqueSlug(base);

  try {
    const created = await prisma.scholarship.create({
      data: {
        universityId,
        title: input.title,
        titleAr: emptyToNull(input.titleAr),
        slug,
        description: emptyToNull(input.description),
        descriptionAr: emptyToNull(input.descriptionAr),
        fundingAmount: input.fundingAmount ?? null,
        // Left off the payload the column default (EGP) applies.
        ...(input.currency ? { currency: input.currency } : {}),
        applicationDeadline: input.applicationDeadline ?? null,
        isPublished: input.isPublished ?? false,
      },
      include: SCHOLARSHIP_RELATIONS,
    });

    return NextResponse.json(serializeScholarship(created), { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Scholarship");
  }
}
