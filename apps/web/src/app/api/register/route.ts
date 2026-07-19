import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/onboarding-schema";

// Base (email-only) signup, still used by the simple signup form. Password
// stays at min 8 here for backward compatibility; the onboarding path below
// enforces the stricter 10-char policy via `profileSchema`'s sibling.
const baseSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().trim().min(1).optional(),
});

// Onboarding wizard payload: base credentials + the collected profile. The
// wizard enforces a 10-char password client-side; we require min 10 here too.
const onboardingSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Password must be at least 10 characters"),
  profile: profileSchema,
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const hasProfile =
    typeof body === "object" &&
    body !== null &&
    "profile" in body &&
    (body as { profile?: unknown }).profile != null;

  if (hasProfile) {
    return registerWithProfile(body);
  }
  return registerBasic(body);
}

async function registerBasic(body: unknown) {
  const parsed = baseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  if (await emailTaken(email)) {
    return conflict();
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
    select: { id: true, email: true },
  });

  return NextResponse.json(user, { status: 201 });
}

async function registerWithProfile(body: unknown) {
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email, password, profile } = parsed.data;

  if (await emailTaken(email)) {
    return conflict();
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // User + profile are created atomically: if either write fails, neither is
  // persisted, so we never leave a credential-less or profile-less account.
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    await tx.studentProfile.create({
      data: {
        userId: created.id,
        studyLevel: profile.studyLevel,
        gradingScheme: profile.gradingScheme,
        gradeValue: profile.gradeValue,
        fieldsOfStudy: profile.fieldsOfStudy,
        englishTest: profile.englishTest,
        englishScore: profile.englishScore ?? null,
        nationality: profile.nationality,
        intakeSeason: profile.intakeSeason,
        intakeYear: profile.intakeYear,
        budgetBand: profile.budgetBand,
      },
    });

    return created;
  });

  return NextResponse.json(user, { status: 201 });
}

async function emailTaken(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  return existing != null;
}

function conflict() {
  return NextResponse.json(
    { error: "An account with this email already exists" },
    { status: 409 },
  );
}
