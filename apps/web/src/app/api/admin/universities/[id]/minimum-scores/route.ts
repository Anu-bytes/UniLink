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
  parseEnumFilter,
  parseListParams,
  parseParam,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HIGH_SCHOOL_SYSTEMS = [
  "THANAWEYA_AMMA",
  "IGCSE",
  "AMERICAN_DIPLOMA",
  "STEM",
  "AL_AZHAR",
  "ARAB_CERTIFICATE",
  "OTHER",
] as const;

const SCORE_UNITS = ["PERCENT", "GPA", "POINTS"] as const;

const createSchema = z.object({
  system: z.enum(HIGH_SCHOOL_SYSTEMS),
  // Decimal(6, 2) in the schema, so anything at or above 10000 would be
  // rejected by the database rather than by us.
  minScore: z
    .number()
    .min(0, "Minimum score cannot be negative")
    .max(9999.99, "Minimum score is out of range"),
  unit: z.enum(SCORE_UNITS).optional(),
  year: z
    .number()
    .int()
    .min(1900)
    .refine(
      (year) => year <= new Date().getFullYear() + 1,
      "Year cannot be in the future",
    )
    .nullish(),
  // Null means the cut-off applies to the whole university.
  facultyId: z.string().trim().max(50).nullish(),
});

/** Prisma hands minScore back as a Decimal; the dashboard compares numbers. */
function serialize<T extends { minScore: Prisma.Decimal }>(score: T) {
  return { ...score, minScore: decimalToNumber(score.minScore) };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId } = await params;
  const listParams = parseListParams(request);
  const systems = parseEnumFilter(request, "system", HIGH_SCHOOL_SYSTEMS);
  const facultyId = parseParam(request, "facultyId");

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    select: { id: true },
  });
  if (!university) return notFound("University");

  const where: Prisma.MinimumScoreWhereInput = {
    universityId,
    ...(systems.length > 0 ? { system: { in: systems } } : {}),
    // "none" asks for the university-wide rows, which have no faculty at all.
    ...(facultyId
      ? { facultyId: facultyId === "none" ? null : facultyId }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.minimumScore.findMany({
      where,
      // The tab reads as one table per certificate system, university-wide
      // rows first. Postgres sorts NULLs last, so `nulls: "first"` is what
      // actually puts the facultyId-less rows at the top of each system.
      // The id tiebreaker is what makes paging stable: several cut-offs can
      // share a system and a faculty (one per year), and without it Postgres
      // may order those ties differently per query, so a row repeats on one
      // page and vanishes from the next.
      orderBy: [
        { system: "asc" },
        { facultyId: { sort: "asc", nulls: "first" } },
        { id: "asc" },
      ],
      skip: listParams.skip,
      take: listParams.take,
      include: { faculty: { select: { id: true, name: true, nameAr: true } } },
    }),
    prisma.minimumScore.count({ where }),
  ]);

  return NextResponse.json(page(items.map(serialize), total, listParams));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId } = await params;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    select: { id: true },
  });
  if (!university) return notFound("University");

  const facultyId = emptyToNull(input.facultyId);
  if (facultyId) {
    // The faculty id arrives in the body, so it is checked against the
    // university in the path: without this, a cut-off could be hung off
    // another university's faculty and would then show on both pages.
    const faculty = await prisma.faculty.findFirst({
      where: { id: facultyId, universityId },
      select: { id: true },
    });
    if (!faculty) {
      return badRequest(
        "That faculty does not belong to this university",
        "facultyId",
      );
    }
  }

  try {
    const created = await prisma.minimumScore.create({
      data: {
        universityId,
        facultyId,
        system: input.system,
        minScore: input.minScore,
        unit: input.unit ?? "PERCENT",
        year: input.year ?? null,
      },
      include: { faculty: { select: { id: true, name: true, nameAr: true } } },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Minimum score");
  }
}
