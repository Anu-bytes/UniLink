import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { googleWizardAccountSchema } from "@/lib/onboarding-schema";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Finishes the onboarding wizard for a visitor who signed in with Google
 * partway through instead of typing a password. Unlike /api/register, this
 * never creates a User — one already exists (created by the Google sign-in
 * itself, via the Prisma adapter) — it only fills in the fields Google never
 * asked for (phone, name, role) and creates the StudentProfile.
 *
 * `upsert` rather than `create`: a returning visitor who re-runs the wizard
 * after already finishing it should update their profile, not 500 on the
 * unique userId constraint.
 */
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

  const parsed = googleWizardAccountSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: issue?.message ?? "Invalid input",
        field: issue?.path?.[0] ?? null,
      },
      { status: 400 },
    );
  }

  const { phone, firstName, lastName, accountRole, profile } = parsed.data;
  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        name: `${firstName} ${lastName}`,
        role: accountRole,
      },
    });

    await tx.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        // Same defaults registerWithProfile uses: neither is collected by
        // the wizard, but both columns are NOT NULL.
        studyLevel: "BACHELOR",
        highSchoolSystem: profile.highSchoolSystem,
        highSchoolSystemOther: profile.highSchoolSystemOther ?? null,
        graduationYear: profile.graduationYear,
        gradeValue: profile.gradeValue,
        fieldsOfStudy: profile.fieldsOfStudy,
        nationality: profile.nationality,
        intakeSeason: "FALL",
        intakeYear: new Date().getFullYear(),
        budgetBand: profile.budgetBand,
      },
      update: {
        highSchoolSystem: profile.highSchoolSystem,
        highSchoolSystemOther: profile.highSchoolSystemOther ?? null,
        graduationYear: profile.graduationYear,
        gradeValue: profile.gradeValue,
        fieldsOfStudy: profile.fieldsOfStudy,
        nationality: profile.nationality,
        budgetBand: profile.budgetBand,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
