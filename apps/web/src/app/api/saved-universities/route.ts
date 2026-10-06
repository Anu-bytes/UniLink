import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Mirrors /api/saved (SavedFaculty), one level up the hierarchy: the heart on
// a university profile.
const bodySchema = z.object({ universityId: z.string().min(1) });

async function readUniversityId(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    return parsed.success ? parsed.data.universityId : null;
  } catch {
    return null;
  }
}

/**
 * The signed-in visitor's saved university ids, for the heart toggles on
 * university cards across the site. Guests get `signedIn: false` (not a 401),
 * so a card can show the heart and send them to log in on click.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { signedIn: false, ids: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const rows = await prisma.savedUniversity.findMany({
    where: { userId: session.user.id },
    select: { universityId: true },
  });

  return NextResponse.json(
    { signedIn: true, ids: rows.map((row) => row.universityId) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const universityId = await readUniversityId(request);
  if (!universityId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const university = await prisma.university.findFirst({
    where: { id: universityId },
    select: { id: true },
  });
  if (!university) {
    return NextResponse.json({ error: "University not found" }, { status: 404 });
  }

  // Liking twice is a no-op rather than an error, so a double click is safe.
  await prisma.savedUniversity.upsert({
    where: { userId_universityId: { userId: session.user.id, universityId } },
    update: {},
    create: { userId: session.user.id, universityId },
  });

  return NextResponse.json({ saved: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const universityId = await readUniversityId(request);
  if (!universityId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await prisma.savedUniversity.deleteMany({
    where: { userId: session.user.id, universityId },
  });

  return NextResponse.json({ saved: false });
}
