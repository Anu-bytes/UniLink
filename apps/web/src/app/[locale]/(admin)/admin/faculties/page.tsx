import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar, type SelectOption } from "@/components/admin";
import { FacultyFilters } from "@/components/admin/faculties/faculty-filters";
import { FacultyTable } from "@/components/admin/faculties/faculty-table";
import { PAGE_WRAPPER, PRIMARY_BUTTON } from "@/components/admin/faculties/styles";
import type { FacultyRow } from "@/components/admin/faculties/types";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The columns /api/admin/faculties will sort by. The value arrives as a raw
 * query string, so anything else falls back to `createdAt` rather than being
 * handed to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["name", "sortOrder", "createdAt", "updatedAt"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminFacultiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.faculties");
  const locale = await getLocale();
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);
  const universityId = single(sp.universityId);
  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : "createdAt";
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches — including the parent's name,
  // which is how "Cairo" finds every faculty of Cairo University.
  const where: Prisma.FacultyWhereInput = {
    ...(universityId ? { universityId } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            {
              university: {
                is: { name: { contains: q, mode: "insensitive" } },
              },
            },
            {
              university: {
                is: { nameAr: { contains: q, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  };

  const [items, total, universities] = await prisma.$transaction([
    prisma.faculty.findMany({
      where,
      // `id` breaks ties. Every university numbers its own faculties from 0,
      // so a cross-university list sorted by sortOrder is almost entirely
      // ties, and Postgres is free to return those in a different order per
      // query — which makes rows jump between pages as the admin pages
      // through.
      orderBy: [{ [sort]: order }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        imageUrl: true,
        sortOrder: true,
        university: { select: { id: true, name: true, nameAr: true } },
        _count: { select: { programs: true } },
      },
    }),
    prisma.faculty.count({ where }),
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  const rows: FacultyRow[] = items.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    nameAr: faculty.nameAr,
    slug: faculty.slug,
    imageUrl: faculty.imageUrl,
    sortOrder: faculty.sortOrder,
    university: faculty.university,
    programCount: faculty._count.programs,
  }));

  const universityOptions: SelectOption[] = universities.map((university) => ({
    value: university.id,
    label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
  }));

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link href="/admin/faculties/new" className={PRIMARY_BUTTON}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </Link>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total}>
          <FacultyFilters universities={universityOptions} />
        </TableToolbar>

        <FacultyTable rows={rows} filtered={q !== "" || universityId !== ""} />

        {totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={DEFAULT_PER_PAGE}
          />
        ) : null}
      </div>
    </div>
  );
}
