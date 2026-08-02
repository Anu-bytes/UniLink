import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ programId: z.string().min(1) });

async function readProgramId(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    return parsed.success ? parsed.data.programId : null;
  } catch {
    return null;
  }
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
