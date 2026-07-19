import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

const budgetBands = {
  budget: "UNDER_100K",
  mid: "UNDER_100K",
  "upper-mid": "B100_200K",
  premium: "B200_300K",
  elite: "B300_500K",
} as const;

const studyLevels = {
  bsc: "BACHELOR",
  diploma: "DIPLOMA",
  msc: "MASTER",
  phd: "DOCTORATE",
} as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.code;
    }
    return NextResponse.json(
      { error: "validation", fields },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const passwordHash = await bcrypt.hash(input.password, 10);
  const intakeYear = Math.max(input.graduationYear, new Date().getFullYear());

  try {
    const user = await prisma.user.create({
      data: {
        name: input.fullName,
        email: input.email,
        passwordHash,
        studentProfile: {
          create: {
            destinations: ["EG"],
            studyLevel: studyLevels[input.certification],
            gradingScheme: "percentage",
            gradeValue: 0.01,
            fieldsOfStudy: input.fieldsOfInterest,
            englishTest: "NONE",
            nationality: "EG",
            intakeSeason: "FALL",
            intakeYear,
            budgetBand: budgetBands[input.budgetBucket],
            phone: input.phone,
            highSchoolType: input.highSchoolType,
            graduationYear: input.graduationYear,
            certification: input.certification,
            age: input.age,
            schoolName: input.schoolName,
            nationalityLabel: input.nationality,
            address: input.address,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.name ?? input.fullName,
          role: "student",
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "email_taken", fields: { email: "taken" } },
        { status: 409 },
      );
    }
    throw error;
  }
}
