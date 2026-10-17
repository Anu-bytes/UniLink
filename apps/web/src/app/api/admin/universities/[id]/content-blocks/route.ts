import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { catalogueWrite } from "@/lib/admin-changes";
import { contentBlockCreateSchema as createSchema } from "@/lib/content-block-schemas";
import { CONTENT_SECTIONS, MAX_SECTIONS_PER_UNIVERSITY } from "@/lib/content-blocks";
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

async function postHandler(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id: universityId } = await params;

  const body = await readJson(request, createSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const [university, positions, existing] = await prisma.$transaction([
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
    prisma.universityContentBlock.count({ where: { universityId } }),
  ]);
  if (!university) return notFound("University");
  if (existing >= MAX_SECTIONS_PER_UNIVERSITY) {
    return NextResponse.json(
      { error: `A profile can have at most ${MAX_SECTIONS_PER_UNIVERSITY} sections. Remove one first.` },
      { status: 409 },
    );
  }

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

// Writes go through the review queue: applied directly for a super admin,
// queued for approval for a university admin. See lib/admin-changes.ts.
export const POST = catalogueWrite("contentBlock", "CREATE", postHandler, { validate: createSchema });
