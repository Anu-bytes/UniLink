import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  decimalToNumber,
  emptyToNull,
  notFound,
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

const STUDY_LEVELS = [
  "CERTIFICATE",
  "DIPLOMA",
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
] as const;

const TUITION_PERIODS = ["YEAR", "TERM", "TOTAL"] as const;

const PROGRAM_TAGS = [
  "HIGH_JOB_DEMAND",
  "SCHOLARSHIPS_AVAILABLE",
  "FAST_ACCEPTANCE",
  "WAIVED_APPLICATION_FEE",
  "FINANCIAL_AID_AVAILABLE",
  "CREDIT_HOURS",
] as const;

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = ["name", "tuitionFee", "createdAt", "updatedAt"] as const;

/** What the table needs beside each program to render a row. */
const PROGRAM_RELATIONS = {
  university: { select: { id: true, name: true, nameAr: true, slug: true } },
  faculty: { select: { id: true, name: true, nameAr: true } },
} satisfies Prisma.ProgramInclude;

/** Decimal(12, 2), so the database rejects anything from 10^10 upwards. */
const moneyField = z
  .number()
  .min(0, "Fee cannot be negative")
  .max(9999999999.99, "Fee is out of range")
  .nullish();

/**
 * ISO 4217 code. Uppercased first so a form that sends "egp" is accepted
 * rather than bounced — the column is Char(3) and the public pages print it
 * verbatim next to the fee.
 */
const currencyField = z
  .string()
  .trim()
  .toUpperCase()
  .refine(
    (value) => /^[A-Z]{3}$/.test(value),
    "Currency must be a 3-letter code",
  );

const createSchema = z.object({
  universityId: z.string().trim().min(1, "University is required").max(50),
  facultyId: z.string().trim().max(50).nullish(),
  name: z.string().trim().min(1, "Name is required").max(200),
  nameAr: z.string().trim().max(200).nullish(),
  slug: z.string().trim().max(120).nullish(),
  description: z.string().trim().max(4000).nullish(),
  descriptionAr: z.string().trim().max(4000).nullish(),
  studyLevel: z.enum(STUDY_LEVELS),
  fieldOfStudy: z.string().trim().min(1, "Field of study is required").max(100),
  durationMonths: z
    .number()
    .int()
    .positive("Duration must be at least one month")
    .max(180, "Duration is out of range")
    .nullish(),
  durationLabel: z.string().trim().max(200).nullish(),
  durationLabelAr: z.string().trim().max(200).nullish(),
  tuitionFee: moneyField,
  tuitionPeriod: z.enum(TUITION_PERIODS).optional(),
  currency: currencyField.optional(),
  applicationFee: moneyField,
  applicationFeeWaived: z.boolean().optional(),
  minGradePercent: z
    .number()
    .min(0, "Minimum grade cannot be negative")
    .max(100, "Minimum grade is a percentage")
    .nullish(),
  coopAvailable: z.boolean().optional(),
  tags: z.array(z.enum(PROGRAM_TAGS)).max(PROGRAM_TAGS.length).optional(),
  isPublished: z.boolean().optional(),
});

/** Prisma hands the fee columns back as Decimals; the dashboard sorts numbers. */
function serializeProgram<
  T extends {
    tuitionFee: Prisma.Decimal | null;
    applicationFee: Prisma.Decimal | null;
  },
>(program: T) {
  return {
    ...program,
    tuitionFee: decimalToNumber(program.tuitionFee),
    applicationFee: decimalToNumber(program.applicationFee),
  };
}

/**
 * Slugs are only unique per university, so two universities may both offer
 * `computer-science` while a second one under the *same* university gets
 * `-2`, `-3`, … A 409 here would be useless to whoever is typing: they asked
 * for a name, not for a URL.
 */
async function uniqueProgramSlug(
  universityId: string,
  base: string,
): Promise<string> {
  const taken = await prisma.program.findMany({
    where: { universityId, slug: { startsWith: base } },
    select: { slug: true },
  });

  const used = new Set(taken.map((program) => program.slug));
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
  const facultyId = parseParam(request, "facultyId");
  const levels = parseEnumFilter(request, "studyLevel", STUDY_LEVELS);
  const fieldOfStudy = parseParam(request, "fieldOfStudy");
  const tags = parseEnumFilter(request, "tags", PROGRAM_TAGS);
  const published = parseBooleanParam(request, "published");

  const where: Prisma.ProgramWhereInput = {
    ...(universityId ? { universityId } : {}),
    ...(facultyId ? { facultyId } : {}),
    ...(levels.length > 0 ? { studyLevel: { in: levels } } : {}),
    ...(fieldOfStudy ? { fieldOfStudy } : {}),
    // Any of the chosen tags, matching how the public quick filters read.
    ...(tags.length > 0 ? { tags: { hasSome: tags } } : {}),
    ...(published === null ? {} : { isPublished: published }),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { nameAr: { contains: params.q, mode: "insensitive" } },
            { slug: { contains: params.q, mode: "insensitive" } },
            // Admins look for "programs at Cairo University" far more often
            // than they remember a program's own name.
            {
              university: {
                name: { contains: params.q, mode: "insensitive" },
              },
            },
            {
              university: {
                nameAr: { contains: params.q, mode: "insensitive" },
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
    prisma.program.findMany({
      where,
      // `id` breaks ties. `tuitionFee` is null on most rows and two programs
      // routinely share a name, so without a second key Postgres is free to
      // order the tied rows differently per query — which makes rows jump
      // between pages as the admin pages through.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
      include: PROGRAM_RELATIONS,
    }),
    prisma.program.count({ where }),
  ]);

  return NextResponse.json(page(items.map(serializeProgram), total, params));
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const university = await prisma.university.findUnique({
    where: { id: input.universityId },
    select: { id: true },
  });
  if (!university) return notFound("University");

  const facultyId = emptyToNull(input.facultyId);
  if (facultyId) {
    // Both ids come from the body, so the faculty is checked against the
    // chosen university: a program filed under another university's faculty
    // would surface on that university's public pages.
    const faculty = await prisma.faculty.findFirst({
      where: { id: facultyId, universityId: input.universityId },
      select: { id: true },
    });
    if (!faculty) {
      return badRequest(
        "That faculty does not belong to this university",
        "facultyId",
      );
    }
  }

  const base = slugify(emptyToNull(input.slug) ?? input.name);
  if (!base) {
    return badRequest("Slug cannot be derived from this name", "slug");
  }
  const slug = await uniqueProgramSlug(input.universityId, base);

  try {
    const created = await prisma.program.create({
      data: {
        universityId: input.universityId,
        facultyId,
        name: input.name,
        nameAr: emptyToNull(input.nameAr),
        slug,
        description: emptyToNull(input.description),
        descriptionAr: emptyToNull(input.descriptionAr),
        studyLevel: input.studyLevel,
        fieldOfStudy: input.fieldOfStudy,
        durationMonths: input.durationMonths ?? null,
        durationLabel: emptyToNull(input.durationLabel),
        durationLabelAr: emptyToNull(input.durationLabelAr),
        tuitionFee: input.tuitionFee ?? null,
        tuitionPeriod: input.tuitionPeriod ?? "YEAR",
        currency: input.currency ?? "EGP",
        applicationFee: input.applicationFee ?? null,
        applicationFeeWaived: input.applicationFeeWaived ?? false,
        minGradePercent: input.minGradePercent ?? null,
        coopAvailable: input.coopAvailable ?? false,
        tags: input.tags ?? [],
        isPublished: input.isPublished ?? false,
      },
      include: PROGRAM_RELATIONS,
    });

    return NextResponse.json(serializeProgram(created), { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Program");
  }
}
