import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import {
  page,
  parseBooleanParam,
  parseEnumFilter,
  parseListParams,
  parseParam,
} from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "IN_REVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = [
  "createdAt",
  "updatedAt",
  "submittedAt",
  "status",
] as const;

const LIST_INCLUDE = {
  user: { select: { id: true, name: true, email: true, image: true } },
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
} satisfies Prisma.ApplicationInclude;

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);
  const statuses = parseEnumFilter(request, "status", APPLICATION_STATUSES);
  const universityId = parseParam(request, "universityId");
  const programId = parseParam(request, "programId");
  const userId = parseParam(request, "userId");

  // Everything except the status filter. The board's column headers have to
  // keep counting the statuses the caller filtered out, otherwise selecting
  // "OFFER" would report zero applications in every other column.
  const scope: Prisma.ApplicationWhereInput = {
    ...(userId ? { userId } : {}),
    ...(programId ? { programId } : {}),
    ...(universityId ? { program: { universityId } } : {}),
    ...(params.q
      ? {
          OR: [
            { user: { name: { contains: params.q, mode: "insensitive" } } },
            { user: { email: { contains: params.q, mode: "insensitive" } } },
            { program: { name: { contains: params.q, mode: "insensitive" } } },
            {
              program: { nameAr: { contains: params.q, mode: "insensitive" } },
            },
            {
              program: {
                university: {
                  name: { contains: params.q, mode: "insensitive" },
                },
              },
            },
            {
              program: {
                university: {
                  nameAr: { contains: params.q, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  const where: Prisma.ApplicationWhereInput = {
    ...scope,
    ...(statuses.length > 0 ? { status: { in: statuses } } : {}),
  };

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      // `id` breaks ties. `?sort=status` orders the whole table by six
      // values, so nearly every row is a tie, and Postgres is free to return
      // tied rows in a different order per query — which silently duplicates
      // and drops applications as the admin pages through the board.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
      include: LIST_INCLUDE,
    }),
    prisma.application.count({ where }),
  ]);

  const envelope = page(items, total, params);

  if (parseBooleanParam(request, "counts") !== true) {
    return NextResponse.json(envelope);
  }

  const grouped = await prisma.application.groupBy({
    by: ["status"],
    where: scope,
    _count: { _all: true },
  });

  // Seeded with every status so an empty column still renders as a zero
  // instead of disappearing from the board.
  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [status, 0]),
  ) as Record<(typeof APPLICATION_STATUSES)[number], number>;

  for (const row of grouped) {
    counts[row.status] = row._count._all;
  }

  return NextResponse.json({ ...envelope, counts });
}
