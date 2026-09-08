import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import {
  conflict,
  emptyToNull,
  notFound,
  parseBooleanParam,
  prismaErrorResponse,
  readJson,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const USER_ROLES = ["STUDENT", "PARENT", "PARTNER", "ADMIN"] as const;

/**
 * Every column of User except `passwordHash`, plus the two relations the
 * detail screen renders. The hash is left out of the select rather than
 * stripped afterwards, so a later `include` cannot put it back on the wire.
 */
const DETAIL_SELECT = {
  id: true,
  name: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  emailVerified: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  studentProfile: true,
  applications: {
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
      program: {
        select: {
          id: true,
          name: true,
          nameAr: true,
          slug: true,
          university: {
            select: { id: true, name: true, nameAr: true, slug: true },
          },
        },
      },
    },
  },
  _count: {
    select: { applications: true, savedFaculties: true, savedPrograms: true },
  },
} satisfies Prisma.UserSelect;

const updateSchema = z
  .object({
    name: z.string().trim().max(200).nullish(),
    phone: z.string().trim().max(40).nullish(),
    role: z.enum(USER_ROLES),
  })
  .partial();

/** How many ADMIN accounts are left, used by the two lockout guards below. */
async function countAdmins() {
  return prisma.user.count({ where: { role: "ADMIN" } });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: DETAIL_SELECT,
  });

  if (!user) return notFound("User");

  return NextResponse.json(user);
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

  const existing = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!existing) return notFound("User");

  const data: Prisma.UserUpdateInput = {};

  if (input.name !== undefined) data.name = emptyToNull(input.name);
  if (input.phone !== undefined) data.phone = emptyToNull(input.phone);

  if (input.role !== undefined && input.role !== existing.role) {
    // Nobody edits their own role. An admin who demotes themselves loses the
    // dashboard mid-click and has to be restored from the database, so the
    // change has to come from a second admin.
    if (existing.id === guard.actor.id) {
      return conflict("You cannot change your own role");
    }

    // Same lockout in slower motion: demote the last ADMIN and the
    // organisation has no way back into the dashboard at all.
    if (existing.role === "ADMIN" && (await countAdmins()) <= 1) {
      return conflict("This is the last admin account and cannot be demoted");
    }

    data.role = input.role;
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: DETAIL_SELECT,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return prismaErrorResponse(error, "User");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      _count: {
        select: {
          applications: true,
          savedFaculties: true,
          savedPrograms: true,
        },
      },
    },
  });
  if (!user) return notFound("User");

  if (user.id === guard.actor.id) {
    return conflict("You cannot delete your own account");
  }

  if (user.role === "ADMIN" && (await countAdmins()) <= 1) {
    return conflict("This is the last admin account and cannot be deleted");
  }

  // The delete cascades to the student profile, every application and every
  // saved row. The caller has to come back with ?confirm=true once it has
  // shown the counts below to whoever clicked.
  if (parseBooleanParam(request, "confirm") !== true) {
    return NextResponse.json(
      {
        error:
          "Deleting this user also deletes their profile, applications and saved items. Retry with ?confirm=true.",
        counts: user._count,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    return prismaErrorResponse(error, "User");
  }

  return NextResponse.json({ ok: true });
}
