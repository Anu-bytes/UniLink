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
  url: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .max(500)
    // http(s) only, like every other media column: an `href`/`src` built from
    // a `javascript:` value would run on the public page.
    .regex(/^https?:\/\/\S+$/i, "Enter a valid URL"),
  alt: z.string().trim().max(300).nullish(),
  altAr: z.string().trim().max(300).nullish(),
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

  const [items, total] = await prisma.$transaction([
    prisma.universityImage.findMany({
      where: { universityId },
      // The gallery is a hand-ordered strip, so sortOrder is the only sort
      // that makes sense; id breaks ties left by two rows sharing a position.
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: listParams.skip,
      take: listParams.take,
    }),
    prisma.universityImage.count({ where: { universityId } }),
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
    prisma.universityImage.aggregate({
      where: { universityId },
      _max: { sortOrder: true },
    }),
  ]);
  if (!university) return notFound("University");

  try {
    const created = await prisma.universityImage.create({
      data: {
        universityId,
        url: input.url,
        alt: emptyToNull(input.alt),
        altAr: emptyToNull(input.altAr),
        // A new image lands at the end of the strip unless the caller pins it.
        sortOrder: input.sortOrder ?? (positions._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Image");
  }
}
