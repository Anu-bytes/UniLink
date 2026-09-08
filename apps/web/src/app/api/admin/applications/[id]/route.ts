import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  emptyToNull,
  notFound,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * The admin may move an application anywhere in the workflow, which is why
 * this list is the full enum. The student route (api/applications) allows only
 * DRAFT, SUBMITTED and WITHDRAWN — a student must not be able to hand
 * themselves an OFFER.
 */
const APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "IN_REVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

/**
 * The student's own columns, minus `passwordHash`: reviewing an application
 * means reading the profile behind it, never the credential.
 */
const DETAIL_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      studentProfile: true,
    },
  },
  program: {
    select: {
      id: true,
      name: true,
      nameAr: true,
      slug: true,
      studyLevel: true,
      university: {
        select: { id: true, name: true, nameAr: true, slug: true },
      },
    },
  },
} satisfies Prisma.ApplicationInclude;

const updateSchema = z
  .object({
    status: z.enum(APPLICATION_STATUSES),
    notes: z.string().trim().max(5000).nullish(),
  })
  .partial();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: DETAIL_INCLUDE,
  });

  if (!application) return notFound("Application");

  return NextResponse.json(application);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const body = await readJson(request, updateSchema);
  if (!body.ok) return body.response;
  const input = body.data;

  const existing = await prisma.application.findUnique({
    where: { id },
    select: { submittedAt: true },
  });
  if (!existing) return notFound("Application");

  const data: Prisma.ApplicationUpdateInput = {};

  if (input.notes !== undefined) data.notes = emptyToNull(input.notes);

  if (input.status !== undefined) {
    data.status = input.status;

    // submittedAt records when the student actually submitted, so it is
    // stamped once and then left alone: moving an application on to IN_REVIEW,
    // or back to DRAFT for a correction, must not rewrite or erase that date.
    if (input.status === "SUBMITTED" && existing.submittedAt === null) {
      data.submittedAt = new Date();
    }
  }

  try {
    const updated = await prisma.application.update({
      where: { id },
      data,
      include: DETAIL_INCLUDE,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "Application");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  try {
    await prisma.application.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "Application");
  }

  return NextResponse.json({ ok: true });
}
