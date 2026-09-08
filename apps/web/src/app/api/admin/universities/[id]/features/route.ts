import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  emptyToNull,
  notFound,
  page,
  parseListParams,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  titleAr: z.string().trim().max(200).nullish(),
  body: z.string().trim().max(2000).nullish(),
  bodyAr: z.string().trim().max(2000).nullish(),
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

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    select: { id: true },
  });
  if (!university) return notFound("University");

  const where: Prisma.UniversityFeatureWhereInput = {
    universityId,
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
    prisma.universityFeature.findMany({
      where,
      // Hand-ordered list; id breaks ties left by two rows sharing a position.
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: listParams.skip,
      take: listParams.take,
    }),
    prisma.universityFeature.count({ where }),
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
    prisma.universityFeature.aggregate({
      where: { universityId },
      _max: { sortOrder: true },
    }),
  ]);
  if (!university) return notFound("University");

  try {
    const created = await prisma.universityFeature.create({
      data: {
        universityId,
        title: input.title,
        titleAr: emptyToNull(input.titleAr),
        body: emptyToNull(input.body),
        bodyAr: emptyToNull(input.bodyAr),
        // A new feature lands at the end of the list unless the caller pins it.
        sortOrder: input.sortOrder ?? (positions._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Feature");
  }
}
