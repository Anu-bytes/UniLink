import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { grantAdminAccess } from "@/lib/admin-accounts";
import { readJson } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const grantSchema = z.object({
  // The catalogue university to assign. Usually the one on the application,
  // but the reviewer picks it when the applicant typed a name we do not list.
  universityId: z.string().trim().min(1, "Choose the university to assign").max(50),
});

/**
 * Approve a university representative application: give the applicant a
 * university admin account assigned to that university (or promote their
 * existing account), and mark the application approved. Their edits still go
 * through the approval queue like any university admin's.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
  }
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(request, grantSchema);
  if (!body.ok) return body.response;

  const application = await prisma.partnerRequest.findUnique({
    where: { id },
    select: { id: true, type: true, status: true, fullName: true, email: true },
  });
  if (!application) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (application.type !== "REPRESENTATIVE") {
    return NextResponse.json({ error: "Only representative applications grant access" }, { status: 400 });
  }
  if (application.status === "APPROVED") {
    return NextResponse.json({ error: "This application was already approved" }, { status: 409 });
  }

  const university = await prisma.university.findUnique({
    where: { id: body.data.universityId },
    select: { id: true, name: true },
  });
  if (!university) return NextResponse.json({ error: "University not found", field: "universityId" }, { status: 400 });

  const result = await grantAdminAccess({
    name: application.fullName,
    email: application.email,
    role: "UNIVERSITY_ADMIN",
    universityIds: [university.id],
    actorId: guard.actor.id,
    reason: `representative application for ${university.name}`,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error, field: result.field ?? null }, { status: result.status });
  }

  await prisma.partnerRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      universityId: university.id,
      grantedUserId: result.userId,
      reviewerId: guard.actor.id,
      reviewedAt: new Date(),
    },
  });

  // The one-time password is returned once, to this reviewer, and never stored.
  return NextResponse.json({
    userId: result.userId,
    promoted: result.promoted,
    temporaryPassword: result.temporaryPassword,
    email: application.email,
  });
}
