import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  emptyToNull,
  notFound,
  page,
  parseEnumFilter,
  parseListParams,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CONTENT_SECTIONS = [
  "ADMISSION_REQUIREMENTS",
  "ADMISSION_CRITERIA",
  "TUITION_NOTES",
  "ABOUT_EXTRA",
] as const;

const createSchema = z.object({
  section: z.enum(CONTENT_SECTIONS),
  title: z.string().trim().max(200).nullish(),
  titleAr: z.string().trim().max(200).nullish(),
  body: z.string().trim().min(1, "Body is required").max(20000),
  bodyAr: z.string().trim().max(20000).nullish(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId } = await params;
  const listParams = parseListParams(request);
  const sections = parseEnumFilter(request, "section", CONTENT_SECTIONS);

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    select: { id: true },
  });
  if (!university) return notFound("University");

  const where: Prisma.UniversityContentBlockWhereInput = {
    universityId,
    ...(sections.length > 0 ? { section: { in: sections } } : {}),
    ...(listParams.q
      ? {
          OR: [
            { title: { contains: listParams.q, mode: "insensitive" } },
            { titleAr: { contains: listParams.q, mode: "insensitive" } },
            { body: { contains: listParams.q, mode: "insensitive" } },
            { bodyAr: { contains: listParams.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.universityContentBlock.findMany({
      where,
      // Blocks are rendered one tab at a time, so they group by section first
      // and then follow the hand-set order inside it.
      orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      skip: listParams.skip,
      take: listParams.take,
    }),
    prisma.universityContentBlock.count({ where }),
  ]);

  return NextResponse.json(page(items, total, listParams));
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

  const [university, positions] = await prisma.$transaction([
    prisma.university.findUnique({
      where: { id: universityId },
      select: { id: true },
    }),
    // Ordering only means anything within a section, so the next position is
    // taken from the section this block is joining, not from the whole page.
    prisma.universityContentBlock.aggregate({
      where: { universityId, section: input.section },
      _max: { sortOrder: true },
    }),
  ]);
  if (!university) return notFound("University");

  try {
    const created = await prisma.universityContentBlock.create({
      data: {
        universityId,
        section: input.section,
        title: emptyToNull(input.title),
        titleAr: emptyToNull(input.titleAr),
        body: input.body,
        bodyAr: emptyToNull(input.bodyAr),
        sortOrder: input.sortOrder ?? (positions._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Content block");
  }
}
