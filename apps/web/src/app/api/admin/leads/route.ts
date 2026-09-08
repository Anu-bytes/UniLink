// Partnership leads are an inbox, not a workflow. The model carries no status,
// owner or note column, so this surface is list, read and delete only: there
// is nothing a PATCH could write. Giving leads a pipeline means a migration,
// which is out of scope here — that is why you will not find a PATCH below.

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { page, parseListParams } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Columns a client may sort by. Anything else falls back to `createdAt`: the
 * value arrives as a raw query string, and Prisma would happily build an
 * `ORDER BY` around whatever it is handed.
 */
const SORT_COLUMNS = ["createdAt"] as const;

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = parseListParams(request);

  // Whoever handles partnerships searches by whatever they remember off the
  // enquiry — the institution, the town, or the person who sent it.
  const where: Prisma.PartnershipLeadWhereInput = params.q
    ? {
        OR: [
          { universityName: { contains: params.q, mode: "insensitive" } },
          { city: { contains: params.q, mode: "insensitive" } },
          { contactFirstName: { contains: params.q, mode: "insensitive" } },
          { contactLastName: { contains: params.q, mode: "insensitive" } },
          { contactEmail: { contains: params.q, mode: "insensitive" } },
          { contactTitle: { contains: params.q, mode: "insensitive" } },
        ],
      }
    : {};

  const sort = (SORT_COLUMNS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as (typeof SORT_COLUMNS)[number])
    : "createdAt";

  const [items, total] = await prisma.$transaction([
    prisma.partnershipLead.findMany({
      where,
      // `id` breaks ties, as in the catalogue lists. Rows seeded or imported
      // in one transaction share a `createdAt` to the microsecond, and
      // Postgres may return those in a different order per query — which makes
      // a lead jump between pages as the inbox is paged through.
      orderBy: [{ [sort]: params.order }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
    }),
    prisma.partnershipLead.count({ where }),
  ]);

  return NextResponse.json(page(items, total, params));
}
