import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { academicsEditSchema } from "@/lib/onboarding-schema";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Update the academic details on the signed-in user's own study profile.
 *
 * The update is scoped by userId taken from the session, never from the
 * request body, so there is no way to address another student's profile.
 */
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

  const parsed = academicsEditSchema.safeParse(body);
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

  const {
    studyLevel,
    highSchoolSystem,
    highSchoolSystemOther,
    graduationYear,
    gradeValue,
    nationality,
    bio,
  } = parsed.data;

  // updateMany rather than update: it matches on userId and reports a count,
  // so a missing profile is a clean 404 instead of a thrown Prisma error.
  const { count } = await prisma.studentProfile.updateMany({
    where: { userId: session.user.id },
    data: {
      studyLevel,
      highSchoolSystem,
      // Only meaningful when the system is OTHER; clear it otherwise so a
      // stale value can't linger after switching away.
      highSchoolSystemOther:
        highSchoolSystem === "OTHER" ? (highSchoolSystemOther ?? null) : null,
      graduationYear,
      gradeValue,
      nationality,
      bio: bio?.trim() ? bio.trim() : null,
    },
  });

  if (count === 0) {
    return NextResponse.json(
      { error: "No study profile to update" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
