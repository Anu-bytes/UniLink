import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  decimalToNumber,
  emptyToNull,
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

const updateSchema = z
  .object({
    system: z.enum(HIGH_SCHOOL_SYSTEMS),
    // Decimal(6, 2) in the schema, so anything at or above 10000 would be
    // rejected by the database rather than by us.
    minScore: z
      .number()
      .min(0, "Minimum score cannot be negative")
      .max(9999.99, "Minimum score is out of range"),
    unit: z.enum(SCORE_UNITS),
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
  })
  .partial();

/** Prisma hands minScore back as a Decimal; the dashboard compares numbers. */
function serialize<T extends { minScore: Prisma.Decimal }>(score: T) {
  return { ...score, minScore: decimalToNumber(score.minScore) };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; scoreId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, scoreId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const data: Prisma.MinimumScoreUpdateInput = {};
  if (input.system !== undefined) data.system = input.system;
  if (input.minScore !== undefined) data.minScore = input.minScore;
  if (input.unit !== undefined) data.unit = input.unit;
  if (input.year !== undefined) data.year = input.year ?? null;

  if (input.facultyId !== undefined) {
    const facultyId = emptyToNull(input.facultyId);
    if (facultyId) {
      // The faculty id arrives in the body, so it is checked against the
      // university in the path: without this, a cut-off could be moved onto
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
      data.faculty = { connect: { id: facultyId } };
    } else {
      // Explicit null promotes the row to a university-wide cut-off.
      data.faculty = { disconnect: true };
    }
  }

  try {
    // Scoped by universityId, so one university's id can never address
    // another's score row even with a guessed scoreId.
    const updated = await prisma.minimumScore.update({
      where: { id: scoreId, universityId },
      data,
      include: { faculty: { select: { id: true, name: true, nameAr: true } } },
    });

    return NextResponse.json(serialize(updated));
  } catch (error) {
    return prismaErrorResponse(error, "Minimum score");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; scoreId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId, scoreId } = await params;

  try {
    await prisma.minimumScore.delete({
      where: { id: scoreId, universityId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "Minimum score");
  }
}
