import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { prismaErrorResponse, readJson } from "@/lib/admin-api";
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

const updateSchema = z
  .object({
    season: z.enum(INTAKE_SEASONS),
    year: yearField,
    // Sent as an ISO string by the form; coerced so the column keeps a real
    // DateTime rather than whatever the client formatted. Explicit null
    // clears the deadline.
    applicationDeadline: z.coerce.date().nullish(),
  })
  .partial();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; intakeId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId, intakeId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const data: Prisma.ProgramIntakeUpdateInput = {};
  if (input.season !== undefined) data.season = input.season;
  if (input.year !== undefined) data.year = input.year;
  if (input.applicationDeadline !== undefined) {
    data.applicationDeadline = input.applicationDeadline ?? null;
  }

  try {
    // Scoped by programId, so one program's id can never address another's
    // intake even with a guessed intakeId.
    const updated = await prisma.programIntake.update({
      where: { id: intakeId, programId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "Intake");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; intakeId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId, intakeId } = await params;

  try {
    await prisma.programIntake.delete({
      where: { id: intakeId, programId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "Intake");
  }
}
