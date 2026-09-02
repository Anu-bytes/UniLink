import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { badRequest, prismaErrorResponse, readJson } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ENGLISH_TESTS = ["IELTS", "TOEFL", "PTE", "DUOLINGO", "NONE"] as const;

/**
 * Duolingo tops out at 160 and TOEFL at 120, so nothing legitimate comes
 * anywhere near the cap; it is here to keep a typo out of the column.
 */
const minScoreField = z
  .number()
  .positive("Minimum score must be greater than zero")
  .max(200, "Minimum score is out of range");

const updateSchema = z
  .object({
    test: z.enum(ENGLISH_TESTS),
    minScore: minScoreField,
  })
  .partial();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; requirementId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId, requirementId } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  // EnglishTest.NONE exists so a student can say they hold no certificate. As
  // a program requirement it would read "this program requires no English",
  // which is what having no row at all already means, so switching an
  // existing row to it is a delete in disguise.
  if (input.test === "NONE") {
    return badRequest(
      "NONE is not a requirement; delete the row instead",
      "test",
    );
  }

  const data: Prisma.ProgramEnglishRequirementUpdateInput = {};
  if (input.test !== undefined) data.test = input.test;
  if (input.minScore !== undefined) data.minScore = input.minScore;

  try {
    // Scoped by programId, so one program's id can never address another's
    // requirement even with a guessed requirementId.
    const updated = await prisma.programEnglishRequirement.update({
      where: { id: requirementId, programId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "English requirement");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; requirementId: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId, requirementId } = await params;

  try {
    await prisma.programEnglishRequirement.delete({
      where: { id: requirementId, programId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "English requirement");
  }
}
