import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Mirrors /api/saved-universities, one level down the hierarchy: the heart on
// a program card or program page.
const bodySchema = z.object({ programId: z.string().min(1) });

async function readProgramId(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    return parsed.success ? parsed.data.programId : null;
  } catch {
    return null;
  }
}

/**
 * The signed-in visitor's saved program ids. Guests get `signedIn: false`
 * (not a 401), so a heart can show and send them to log in on click.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { signedIn: false, ids: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const rows = await prisma.savedProgram.findMany({
    where: { userId: session.user.id },
    select: { programId: true },
  });

  return NextResponse.json(
    { signedIn: true, ids: rows.map((row) => row.programId) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const programId = await readProgramId(request);
  if (!programId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const program = await prisma.program.findFirst({
    where: { id: programId, isPublished: true },
    select: { id: true },
  });
  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  // Saving twice is a no-op rather than an error, so a double click is safe.
  await prisma.savedProgram.upsert({
    where: { userId_programId: { userId: session.user.id, programId } },
    update: {},
    create: { userId: session.user.id, programId },
  });

  return NextResponse.json({ saved: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const programId = await readProgramId(request);
  if (!programId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await prisma.savedProgram.deleteMany({
    where: { userId: session.user.id, programId },
  });

  return NextResponse.json({ saved: false });
}
