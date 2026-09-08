import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import {
  page,
  parseBooleanParam,
  parseEnumFilter,
  parseListParams,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const USER_ROLES = ["STUDENT", "PARENT", "PARTNER", "ADMIN"] as const;

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = ["createdAt", "email", "name"] as const;

/**
 * Every column of User except `passwordHash`. The admin surface has no reason
 * to read a credential hash, so it is left out of the select rather than
 * stripped afterwards — that way a new include or a copied handler cannot
 * leak it back into a response by accident.
 */
const LIST_SELECT = {
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
  _count: { select: { applications: true, savedFaculties: true } },
} satisfies Prisma.UserSelect;

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const roles = parseEnumFilter(request, "role", USER_ROLES);
  const hasProfile = parseBooleanParam(request, "hasProfile");

  const where: Prisma.UserWhereInput = {
    ...(roles.length > 0 ? { role: { in: roles } } : {}),
    // A student who never finished the onboarding wizard has no profile row,
    // which is exactly the segment the admin wants to be able to isolate.
    ...(hasProfile === null
      ? {}
      : { studentProfile: hasProfile ? { isNot: null } : { is: null } }),
    ...(params.q
      ? {
          OR: [
            { email: { contains: params.q, mode: "insensitive" } },
            { name: { contains: params.q, mode: "insensitive" } },
            { firstName: { contains: params.q, mode: "insensitive" } },
            { lastName: { contains: params.q, mode: "insensitive" } },
            { phone: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      // `id` breaks ties. Neither `name` nor `createdAt` is unique, and
      // Postgres is free to return tied rows in a different order per query,
      // which makes rows jump between pages as the admin pages through.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
      select: LIST_SELECT,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json(page(items, total, params));
}
