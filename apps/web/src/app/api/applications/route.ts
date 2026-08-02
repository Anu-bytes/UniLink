import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({ programId: z.string().min(1) });

const updateSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["DRAFT", "SUBMITTED", "WITHDRAWN"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const program = await prisma.program.findFirst({
    where: { id: parsed.data.programId, isPublished: true },
    select: { id: true },
  });
  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  // One application per program per student; starting it again returns the
  // existing draft instead of failing on the unique constraint.
  const application = await prisma.application.upsert({
    where: {
      userId_programId: {
        userId: session.user.id,
        programId: parsed.data.programId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      programId: parsed.data.programId,
      status: "DRAFT",
    },
    select: { id: true, status: true },
  });

  return NextResponse.json(application, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { count } = await prisma.application.updateMany({
    // Scoped by userId so one student cannot touch another's application.
    where: { id: parsed.data.applicationId, userId: session.user.id },
    data: {
      status: parsed.data.status,
      submittedAt: parsed.data.status === "SUBMITTED" ? new Date() : undefined,
    },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ status: parsed.data.status });
}
