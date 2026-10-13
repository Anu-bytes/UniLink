import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRatingSummary, MAX_STARS, MIN_STARS } from "@/lib/university-ratings";

// A signed-in student's 1-5 star rating of a university. One per student per
// university: rating again replaces it, DELETE removes it. Both answer with
// the university's fresh summary so the card can show the new average.
const rateSchema = z.object({
  universityId: z.string().min(1),
  stars: z.number().int().min(MIN_STARS).max(MAX_STARS),
});
const removeSchema = z.object({ universityId: z.string().min(1) });

async function readBody<T>(request: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(await request.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await readBody(request, rateSchema);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const university = await prisma.university.findFirst({
    where: { id: body.universityId, publishedAt: { not: null } },
    select: { id: true },
  });
  if (!university) {
    return NextResponse.json({ error: "University not found" }, { status: 404 });
  }

  await prisma.universityRating.upsert({
    where: { userId_universityId: { userId, universityId: university.id } },
    update: { stars: body.stars },
    create: { userId, universityId: university.id, stars: body.stars },
  });

  return NextResponse.json(await getRatingSummary(university.id, userId));
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await readBody(request, removeSchema);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await prisma.universityRating.deleteMany({
    where: { userId, universityId: body.universityId },
  });

  return NextResponse.json(await getRatingSummary(body.universityId, userId));
}
