import type { ApplicationStatus, Prisma } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { ApplicationFilters } from "@/components/admin/applications/application-filters";
import { ApplicationTable } from "@/components/admin/applications/application-table";
import { StatusChips } from "@/components/admin/applications/status-chips";
import { PAGE_WRAPPER } from "@/components/admin/applications/styles";
import {
  APPLICATION_STATUSES,
  parseStatus,
  type ApplicationRow,
} from "@/components/admin/applications/types";
import { localized } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

// Mirrors DEFAULT_PER_PAGE in lib/admin-api, so ?page=3 addresses the same
// slice here as it does through the API.
const PER_PAGE = 20;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const t = await getTranslations("Admin");
  const locale = await getLocale();

  const q = firstParam(sp.q)?.trim().slice(0, 120) ?? "";
  const status = parseStatus(firstParam(sp.status));
  const universityId = firstParam(sp.universityId)?.trim() || null;
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);

  // Everything except the status filter, exactly as the list endpoint splits
  // it: the chips have to keep counting the statuses the admin filtered out,
  // otherwise selecting "Offer" reports zero applications on every other chip.
  const scope: Prisma.ApplicationWhereInput = {
    ...(universityId ? { program: { universityId } } : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { program: { name: { contains: q, mode: "insensitive" } } },
            { program: { nameAr: { contains: q, mode: "insensitive" } } },
            {
              program: {
                university: { name: { contains: q, mode: "insensitive" } },
              },
            },
            {
              program: {
                university: { nameAr: { contains: q, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  };

  const where: Prisma.ApplicationWhereInput = {
    ...scope,
    ...(status ? { status } : {}),
  };

  // Hoisted out of the array below on purpose: inside a $transaction literal
  // Prisma stops narrowing groupBy's return type and `_count._all` disappears.
  // The promise is lazy, so the query still runs as part of the batch.
  const byStatusQuery = prisma.application.groupBy({
    by: ["status"],
    where: scope,
    _count: { _all: true },
  });

  const [items, total, byStatus, universities] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      // The id tiebreaker is not decoration: seeded applications share a
      // createdAt to the millisecond, and tied rows are free to swap places
      // between the query for page one and the query for page two — so one
      // application repeats and another is never seen.
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        user: { select: { id: true, name: true, email: true, image: true } },
        program: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            university: { select: { id: true, name: true, nameAr: true } },
          },
        },
      },
    }),
    prisma.application.count({ where }),
    byStatusQuery,
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  // groupBy only returns statuses that have rows, so a status nobody has
  // reached yet would be missing from the row of chips entirely and read as a
  // bug rather than as an empty bucket.
  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((value) => [value, 0]),
  ) as Record<ApplicationStatus, number>;

  for (const row of byStatus) {
    counts[row.status] = row._count._all;
  }

  const scopeTotal = APPLICATION_STATUSES.reduce(
    (sum, value) => sum + counts[value],
    0,
  );

  const rows: ApplicationRow[] = items;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("applications.title")}
        description={t("applications.description")}
      />

      <div className="mt-6 space-y-4">
        <StatusChips counts={counts} total={scopeTotal} />

        <TableToolbar
          placeholder={t("applications.searchPlaceholder")}
          total={total}
        >
          <ApplicationFilters
            universities={universities.map((university) => ({
              value: university.id,
              label: localized(locale, university.name, university.nameAr),
            }))}
          />
        </TableToolbar>

        <ApplicationTable
          rows={rows}
          filtered={Boolean(q) || status !== null || universityId !== null}
        />

        {total > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={PER_PAGE}
          />
        ) : null}
      </div>
    </div>
  );
}
