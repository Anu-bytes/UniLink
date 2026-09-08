import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  badRequest,
  notFound,
  page,
  parseEnumFilter,
  parseListParams,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
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

const createSchema = z.object({
  test: z.enum(ENGLISH_TESTS),
  minScore: minScoreField,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: programId } = await params;
  const listParams = parseListParams(request);
  const tests = parseEnumFilter(request, "test", ENGLISH_TESTS);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { id: true },
  });
  if (!program) return notFound("Program");

  const where: Prisma.ProgramEnglishRequirementWhereInput = {
    programId,
    ...(tests.length > 0 ? { test: { in: tests } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.programEnglishRequirement.findMany({
      where,
      orderBy: { test: "asc" },
      skip: listParams.skip,
      take: listParams.take,
    }),
    prisma.programEnglishRequirement.count({ where }),
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

  // EnglishTest.NONE exists so a student can say they hold no certificate. As
  // a program requirement it would read "this program requires no English",
  // which is what having no row at all already means — and because
  // [programId, test] is unique it would burn the slot a real requirement
  // needs.
  if (input.test === "NONE") {
    return badRequest(
      "NONE is not a requirement; remove the row instead",
      "test",
    );
  }

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { id: true },
  });
  if (!program) return notFound("Program");

  try {
    // [programId, test] is unique, so a second IELTS row comes back as a 409
    // from prismaErrorResponse rather than being checked here and racing
    // another admin between the check and the insert.
    const created = await prisma.programEnglishRequirement.create({
      data: {
        programId,
        test: input.test,
        minScore: input.minScore,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "English requirement");
  }
}
