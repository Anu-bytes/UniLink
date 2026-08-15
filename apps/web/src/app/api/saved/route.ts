import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ facultyId: z.string().min(1) });

async function readFacultyId(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    return parsed.success ? parsed.data.facultyId : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const facultyId = await readFacultyId(request);
  if (!facultyId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const faculty = await prisma.faculty.findFirst({
    where: { id: facultyId },
    select: { id: true },
  });
  if (!faculty) {
    return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
  }

  // Saving twice is a no-op rather than an error, so a double click is safe.
  await prisma.savedFaculty.upsert({
    where: { userId_facultyId: { userId: session.user.id, facultyId } },
    update: {},
    create: { userId: session.user.id, facultyId },
  });

  return NextResponse.json({ saved: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const facultyId = await readFacultyId(request);
  if (!facultyId) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await prisma.savedFaculty.deleteMany({
    where: { userId: session.user.id, facultyId },
  });

  return NextResponse.json({ saved: false });
}
