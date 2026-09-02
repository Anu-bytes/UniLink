import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  notFound,
  page,
  parseEnumFilter,
  parseListParams,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const INTAKE_SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

/**
 * Catalogue entry, not a live date: an intake may be recorded a few years
 * ahead, and old ones stay for the archive.
 */
const yearField = z
  .number()
  .int()
  .min(2000, "Intake year looks wrong")
  .refine(
    (year) => year <= new Date().getFullYear() + 5,
    "Intake year is too far in the future",
  );

const createSchema = z.object({
  season: z.enum(INTAKE_SEASONS),
  year: yearField,
  // Sent as an ISO string by the form; coerced so the column keeps a real
  // DateTime rather than whatever the client formatted.
  applicationDeadline: z.coerce.date().nullish(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId } = await params;
  const listParams = parseListParams(request);
  const seasons = parseEnumFilter(request, "season", INTAKE_SEASONS);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { id: true },
  });
  if (!program) return notFound("Program");

  const where: Prisma.ProgramIntakeWhereInput = {
    programId,
    ...(seasons.length > 0 ? { season: { in: seasons } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.programIntake.findMany({
      where,
      // Upcoming intakes first, which is the order the admission tab reads in.
      orderBy: [{ year: "desc" }, { season: "asc" }],
      skip: listParams.skip,
      take: listParams.take,
    }),
    prisma.programIntake.count({ where }),
  ]);

  return NextResponse.json(page(items, total, listParams));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId } = await params;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { id: true },
  });
  if (!program) return notFound("Program");

  try {
    // [programId, season, year] is unique, so a second "Fall 2026" comes back
    // as a 409 from prismaErrorResponse rather than being checked here and
    // racing another admin between the check and the insert.
    const created = await prisma.programIntake.create({
      data: {
        programId,
        season: input.season,
        year: input.year,
        applicationDeadline: input.applicationDeadline ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Intake");
  }
}
