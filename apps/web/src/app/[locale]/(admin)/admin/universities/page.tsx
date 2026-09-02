import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import {
  PAGE_WRAPPER,
  PRIMARY_BUTTON,
} from "@/components/admin/universities/styles";
import { UNIVERSITY_TYPES } from "@/components/admin/universities/types";
import { UniversityFilters } from "@/components/admin/universities/university-filters";
import { UniversityTable } from "@/components/admin/universities/university-table";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { Prisma, UniversityType } from "@prisma/client";

// Mirrors DEFAULT_PER_PAGE in lib/admin-api, so ?page=3 addresses the same
// slice here as it does through the API.
const PER_PAGE = 20;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function booleanParam(value: string | undefined) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function typeParam(value: string | undefined): UniversityType | null {
  return (UNIVERSITY_TYPES as readonly string[]).includes(value ?? "")
    ? (value as UniversityType)
    : null;
}

export default async function AdminUniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const sp = await searchParams;
  const t = await getTranslations("Admin");

  const q = firstParam(sp.q)?.trim().slice(0, 120) ?? "";
  const type = typeParam(firstParam(sp.type));
  const published = booleanParam(firstParam(sp.published));
  const featured = booleanParam(firstParam(sp.featured));
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);

  // The same where the list endpoint builds, so the table and the API never
  // disagree about what a filter means.
  const where: Prisma.UniversityWhereInput = {
    ...(type ? { type } : {}),
    // There is no boolean column: a university is published exactly when
    // publishedAt is set.
    ...(published === null
      ? {}
      : { publishedAt: published ? { not: null } : null }),
    ...(featured === null ? {} : { isFeatured: featured }),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { cityAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.university.findMany({
      where,
      // The id tiebreaker is not decoration: two rows created in the same
      // millisecond would otherwise be free to swap places between the query
      // for page one and the query for page two, so one repeats and one is
      // never seen.
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        type: true,
        country: true,
        countryAr: true,
        city: true,
        cityAr: true,
        logoUrl: true,
        publishedAt: true,
        _count: { select: { faculties: true, programs: true } },
      },
    }),
    prisma.university.count({ where }),
  ]);

  const rows = items.map(({ _count, ...university }) => ({
    ...university,
    facultyCount: _count.faculties,
    programCount: _count.programs,
  }));

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("universities.title")}
        description={t("universities.description")}
        actions={
          <Link href="/admin/universities/new" className={PRIMARY_BUTTON}>
            <Plus className="size-4" aria-hidden />
            {t("universities.new")}
          </Link>
        }
      />

      <div className="mt-6 space-y-4">
        <TableToolbar
          placeholder={t("universities.searchPlaceholder")}
          total={total}
        >
          <UniversityFilters />
        </TableToolbar>

        <UniversityTable
          rows={rows}
          filtered={Boolean(q) || type !== null || published !== null || featured !== null}
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
