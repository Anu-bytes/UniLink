import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { getFacultyDetail } from "@/lib/faculty-search";
import { getMatchProfile, getProgramsForCompare } from "@/lib/program-search";
import { prisma } from "@/lib/prisma";

/**
 * Backs the "Explore programs" pop-up on a faculty card (FacultyDialog):
 * the same data /app/faculties/[facultyId]/page.tsx renders, as JSON, so the
 * card can show it in place instead of navigating there. That page stays for
 * direct links (compare table, recommended-faculty card).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { facultyId } = await params;
  const rawLocale = request.nextUrl.searchParams.get("locale");
  const locale = rawLocale === "en" ? "en" : "ar";

  const faculty = await getFacultyDetail(locale, facultyId, session.user.id);
  if (!faculty) {
    return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
  }

  const programRows = await prisma.program.findMany({
    where: { facultyId, isPublished: true },
    orderBy: { name: "asc" },
    select: { id: true },
  });

  const [programs, profile] = await Promise.all([
    getProgramsForCompare(locale, programRows.map((row) => row.id), session.user.id),
    getMatchProfile(session.user.id),
  ]);

  return NextResponse.json({ faculty, programs, hasProfile: profile != null });
}
