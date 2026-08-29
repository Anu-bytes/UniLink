import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { ACCOUNT_ROLES, profileSchema } from "@/lib/onboarding-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";

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
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  // Who is filling in the wizard — the applicant, or a parent on their
  // behalf. Only labels the account; the profile fields are the same either
  // way.
  accountRole: z.enum(ACCOUNT_ROLES),
  password: z.string().min(10, "Password must be at least 10 characters"),
  profile: profileSchema,
});

export async function POST(req: Request) {
  // Signup has no session gate by design, which also makes it the cheapest
  // endpoint to hammer for account/db-row spam. A generous per-IP window is
  // enough to stop scripted abuse without affecting a real user retrying a
  // typo'd form.
  if (!rateLimit(`register:ip:${clientIp(req)}`, { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 },
    );
  }

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
  try {
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Two signups for the same email racing the emailTaken check above both
    // reach here; the email's @unique constraint is the real guard, this
    // just turns the loser's failure into the same clean 409 instead of a
    // 500.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return conflict();
    }
    throw error;
  }
}

async function registerWithProfile(body: unknown) {
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email, phone, firstName, lastName, accountRole, password, profile } =
    parsed.data;

  if (await emailTaken(email)) {
    return conflict();
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // User + profile are created atomically: if either write fails, neither is
  // persisted, so we never leave a credential-less or profile-less account.
  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          phone,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          passwordHash,
          role: accountRole,
        },
        select: { id: true, email: true },
      });

      await tx.studentProfile.create({
        data: {
          userId: created.id,
          // Study level is no longer collected in onboarding; the column is still
          // NOT NULL, so default new profiles to bachelor.
          studyLevel: "BACHELOR",
          highSchoolSystem: profile.highSchoolSystem,
          highSchoolSystemOther: profile.highSchoolSystemOther ?? null,
          graduationYear: profile.graduationYear,
          gradeValue: profile.gradeValue,
          fieldsOfStudy: profile.fieldsOfStudy,
          nationality: profile.nationality,
          // Intake is no longer collected in onboarding; the columns are still
          // NOT NULL, so default new profiles to the upcoming fall intake.
          intakeSeason: "FALL",
          intakeYear: new Date().getFullYear(),
          budgetBand: profile.budgetBand,
        },
      });

      return created;
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Same race as registerBasic: the loser of two concurrent signups for
    // the same email gets a clean 409 instead of a 500.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return conflict();
    }
    throw error;
  }
}

async function emailTaken(email: string) {
  // Case-insensitive: the column's unique index is case-sensitive, so without
  // this "Test@x.com" and "test@x.com" could both register, leaving a
  // duplicate account that sign-in (case-insensitive, see auth.ts) and
  // password reset (see findAccount in lib/password-reset.ts) cannot tell
  // apart from the other.
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  return existing != null;
}

function conflict() {
  return NextResponse.json(
    { error: "An account with this email already exists" },
    { status: 409 },
  );
}
