import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  decimalToNumber,
  emptyToNull,
  notFound,
  parseBooleanParam,
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

const PROGRAM_RELATIONS = {
  university: { select: { id: true, name: true, nameAr: true, slug: true } },
  faculty: { select: { id: true, name: true, nameAr: true } },
} satisfies Prisma.ProgramInclude;

const CHILD_COUNTS = {
  intakes: true,
  englishRequirements: true,
  savedBy: true,
  applications: true,
} as const;

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

/**
 * The create schema made partial: an absent key leaves the column alone,
 * while an explicit null or "" clears it. That distinction is why PATCH
 * assembles `data` key by key instead of spreading the parsed body.
 *
 * `universityId` is deliberately not here. Moving a program between
 * universities would drag its applications and saved rows to a school the
 * students never applied to; deleting and recreating it is the honest way to
 * do that.
 */
const updateSchema = z
  .object({
    facultyId: z.string().trim().max(50).nullish(),
    name: z.string().trim().min(1, "Name is required").max(200),
    nameAr: z.string().trim().max(200).nullish(),
    slug: z.string().trim().max(120).nullish(),
    description: z.string().trim().max(4000).nullish(),
    descriptionAr: z.string().trim().max(4000).nullish(),
    studyLevel: z.enum(STUDY_LEVELS),
    fieldOfStudy: z
      .string()
      .trim()
      .min(1, "Field of study is required")
      .max(100),
    durationMonths: z
      .number()
      .int()
      .positive("Duration must be at least one month")
      .max(180, "Duration is out of range")
      .nullish(),
    durationLabel: z.string().trim().max(200).nullish(),
    durationLabelAr: z.string().trim().max(200).nullish(),
    tuitionFee: moneyField,
    tuitionPeriod: z.enum(TUITION_PERIODS),
    currency: currencyField,
    applicationFee: moneyField,
    applicationFeeWaived: z.boolean(),
    minGradePercent: z
      .number()
      .min(0, "Minimum grade cannot be negative")
      .max(100, "Minimum grade is a percentage")
      .nullish(),
    coopAvailable: z.boolean(),
    tags: z.array(z.enum(PROGRAM_TAGS)).max(PROGRAM_TAGS.length),
    isPublished: z.boolean(),
  })
  .partial();

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
 * Slugs are only unique per university, so a rename that collides with a
 * sibling program gets `-2`, `-3`, … rather than a 409. `excludeId` keeps the
 * row being renamed from colliding with itself.
 */
async function uniqueProgramSlug(
  universityId: string,
  base: string,
  excludeId: string,
): Promise<string> {
  const taken = await prisma.program.findMany({
    where: {
      universityId,
      slug: { startsWith: base },
      id: { not: excludeId },
    },
    select: { slug: true },
  });

  const used = new Set(taken.map((program) => program.slug));
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

  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      ...PROGRAM_RELATIONS,
      intakes: { orderBy: [{ year: "desc" }, { season: "asc" }] },
      englishRequirements: { orderBy: { test: "asc" } },
      _count: { select: CHILD_COUNTS },
    },
  });

  if (!program) return notFound("Program");

  return NextResponse.json(serializeProgram(program));
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

  const existing = await prisma.program.findUnique({
    where: { id },
    select: { universityId: true },
  });
  if (!existing) return notFound("Program");

  const data: Prisma.ProgramUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.nameAr !== undefined) data.nameAr = emptyToNull(input.nameAr);
  if (input.description !== undefined) {
    data.description = emptyToNull(input.description);
  }
  if (input.descriptionAr !== undefined) {
    data.descriptionAr = emptyToNull(input.descriptionAr);
  }
  if (input.studyLevel !== undefined) data.studyLevel = input.studyLevel;
  if (input.fieldOfStudy !== undefined) data.fieldOfStudy = input.fieldOfStudy;
  if (input.durationMonths !== undefined) {
    data.durationMonths = input.durationMonths ?? null;
  }
  if (input.durationLabel !== undefined) {
    data.durationLabel = emptyToNull(input.durationLabel);
  }
  if (input.durationLabelAr !== undefined) {
    data.durationLabelAr = emptyToNull(input.durationLabelAr);
  }
  if (input.tuitionFee !== undefined) {
    data.tuitionFee = input.tuitionFee ?? null;
  }
  if (input.tuitionPeriod !== undefined) {
    data.tuitionPeriod = input.tuitionPeriod;
  }
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.applicationFee !== undefined) {
    data.applicationFee = input.applicationFee ?? null;
  }
  if (input.applicationFeeWaived !== undefined) {
    data.applicationFeeWaived = input.applicationFeeWaived;
  }
  if (input.minGradePercent !== undefined) {
    data.minGradePercent = input.minGradePercent ?? null;
  }
  if (input.coopAvailable !== undefined) {
    data.coopAvailable = input.coopAvailable;
  }
  if (input.tags !== undefined) data.tags = input.tags;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;

  if (input.facultyId !== undefined) {
    const facultyId = emptyToNull(input.facultyId);
    if (facultyId) {
      // The faculty id arrives in the body, so it is checked against the
      // program's own university: without this, a program could be re-filed
      // under another university's faculty and would then show on its pages.
      const faculty = await prisma.faculty.findFirst({
        where: { id: facultyId, universityId: existing.universityId },
        select: { id: true },
      });
      if (!faculty) {
        return badRequest(
          "That faculty does not belong to this university",
          "facultyId",
        );
      }
      data.faculty = { connect: { id: facultyId } };
    } else {
      // Explicit null files the program directly under the university.
      data.faculty = { disconnect: true };
    }
  }

  if (input.slug !== undefined) {
    // Renaming deliberately does not re-derive the slug: the public URL is
    // already out there, so a new one has to be asked for explicitly.
    const base = slugify(emptyToNull(input.slug) ?? "");
    if (!base) return badRequest("Slug cannot be empty", "slug");
    data.slug = await uniqueProgramSlug(existing.universityId, base, id);
  }

  try {
    const updated = await prisma.program.update({
      where: { id },
      data,
      include: { ...PROGRAM_RELATIONS, _count: { select: CHILD_COUNTS } },
    });

    return NextResponse.json(serializeProgram(updated));
  } catch (error) {
    return prismaErrorResponse(error, "Program");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const program = await prisma.program.findUnique({
    where: { id },
    select: { _count: { select: CHILD_COUNTS } },
  });
  if (!program) return notFound("Program");

  // The delete cascades to intakes, English requirements, saved rows and —
  // the one that matters — applications. A student's application to this
  // program cannot be reconstructed, so the caller has to show the counts
  // below to whoever clicked and come back with ?confirm=true.
  if (parseBooleanParam(request, "confirm") !== true) {
    return NextResponse.json(
      {
        error:
          "Deleting this program also deletes its intakes, requirements and every application to it. Retry with ?confirm=true.",
        counts: program._count,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.program.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Program");
  }

  return NextResponse.json({ ok: true });
}
