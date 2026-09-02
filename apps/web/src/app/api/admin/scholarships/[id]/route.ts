import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  decimalToNumber,
  emptyToNull,
  notFound,
  prismaErrorResponse,
  readJson,
  slugify,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

/**
 * Same shape as the create schema, made partial: an absent key leaves the
 * column alone, while an explicit null or "" clears it. That distinction is
 * the whole reason the handler below assembles `data` key by key instead of
 * spreading the parsed body.
 *
 * universityId is clearable for the same reason it is optional at create time:
 * the relation is `onDelete: SetNull`, so a detached scholarship is a valid
 * row, not an orphan to be repaired.
 */
const updateSchema = z
  .object({
    universityId: z.string().trim().max(60).nullish(),
    title: z.string().trim().min(1, "Title is required").max(200),
    titleAr: z.string().trim().max(200).nullish(),
    slug: z.string().trim().max(120).nullish(),
    description: z.string().trim().max(5000).nullish(),
    descriptionAr: z.string().trim().max(5000).nullish(),
    fundingAmount: fundingAmountField,
    currency: currencyField,
    applicationDeadline: deadlineField,
    isPublished: z.boolean(),
  })
  .partial();

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
 * row anywhere has to be resolved here. `exceptId` keeps a row from colliding
 * with itself when the slug is re-submitted unchanged.
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: SCHOLARSHIP_RELATIONS,
  });
  if (!scholarship) return notFound("Scholarship");

  return NextResponse.json(serializeScholarship(scholarship));
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

  const existing = await prisma.scholarship.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return notFound("Scholarship");

  const data: Prisma.ScholarshipUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.titleAr !== undefined) data.titleAr = emptyToNull(input.titleAr);
  if (input.description !== undefined) {
    data.description = emptyToNull(input.description);
  }
  if (input.descriptionAr !== undefined) {
    data.descriptionAr = emptyToNull(input.descriptionAr);
  }
  if (input.fundingAmount !== undefined) {
    data.fundingAmount = input.fundingAmount ?? null;
  }
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.applicationDeadline !== undefined) {
    data.applicationDeadline = input.applicationDeadline ?? null;
  }
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;

  if (input.universityId !== undefined) {
    const universityId = emptyToNull(input.universityId);
    if (universityId) {
      const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { id: true },
      });
      if (!university) {
        return badRequest("University not found", "universityId");
      }
      data.university = { connect: { id: universityId } };
    } else {
      data.university = { disconnect: true };
    }
  }

  if (input.slug !== undefined) {
    // Renaming deliberately does not re-derive the slug: the public URL is
    // already out there, so a new one has to be asked for explicitly.
    const base = slugify(emptyToNull(input.slug) ?? "");
    if (!base) return badRequest("Slug cannot be empty", "slug");
    data.slug = await uniqueSlug(base, id);
  }

  try {
    const updated = await prisma.scholarship.update({
      where: { id },
      data,
      include: SCHOLARSHIP_RELATIONS,
    });

    return NextResponse.json(serializeScholarship(updated));
  } catch (error) {
    return prismaErrorResponse(error, "Scholarship");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  // A scholarship owns no child rows, so there is nothing a ?confirm=true
  // round trip would warn about.
  try {
    await prisma.scholarship.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Scholarship");
  }

  return NextResponse.json({ ok: true });
}
