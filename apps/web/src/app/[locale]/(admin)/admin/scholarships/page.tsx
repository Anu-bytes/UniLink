import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import {
  PageHeader,
  Pagination,
  TableToolbar,
  type SelectOption,
} from "@/components/admin";
import { ScholarshipFilters } from "@/components/admin/growth/scholarship-filters";
import { ScholarshipTable } from "@/components/admin/growth/scholarship-table";
import { PAGE_WRAPPER, PRIMARY_BUTTON } from "@/components/admin/growth/styles";
import { PLATFORM_WIDE } from "@/components/admin/growth/types";
import type { ScholarshipRow } from "@/components/admin/growth/types";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { DEFAULT_PER_PAGE, decimalToNumber } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The columns /api/admin/scholarships will sort by. The value arrives as a raw
 * query string, so anything else falls back to `createdAt` rather than being
 * handed to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["title", "applicationDeadline", "createdAt"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.scholarships");
  const locale = await getLocale();
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);
  const universityId = single(sp.universityId);
  const publishedParam = single(sp.published);
  const published =
    publishedParam === "true" ? true : publishedParam === "false" ? false : null;

  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : "createdAt";
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches — plus the one clause the
  // endpoint has no query parameter for: the scholarships tied to no
  // university at all.
  const where: Prisma.ScholarshipWhereInput = {
    ...(universityId === PLATFORM_WIDE
      ? { universityId: null }
      : universityId
        ? { universityId }
        : {}),
    ...(published === null ? {} : { isPublished: published }),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { titleAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total, universities] = await prisma.$transaction([
    prisma.scholarship.findMany({
      where,
      // `id` breaks ties. `applicationDeadline` is nullable and titles repeat
      // across universities, so Postgres is free to return the tied rows in a
      // different order per query — which makes rows jump between pages as the
      // admin pages through.
      orderBy: [{ [sort]: order }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        title: true,
        titleAr: true,
        slug: true,
        fundingAmount: true,
        currency: true,
        applicationDeadline: true,
        isPublished: true,
        university: { select: { id: true, name: true, nameAr: true } },
      },
    }),
    prisma.scholarship.count({ where }),
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  // Midnight UTC today, matching how the deadlines are stored and how
  // formatDate prints them: a scholarship closing today is still open, so only
  // yesterday and earlier count as expired.
  const now = new Date();
  const startOfToday = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const rows: ScholarshipRow[] = items.map((scholarship) => ({
    id: scholarship.id,
    title: scholarship.title,
    titleAr: scholarship.titleAr,
    slug: scholarship.slug,
    fundingAmount: decimalToNumber(scholarship.fundingAmount),
    currency: scholarship.currency,
    applicationDeadline: scholarship.applicationDeadline,
    deadlinePassed:
      scholarship.applicationDeadline !== null &&
      scholarship.applicationDeadline.getTime() < startOfToday,
    isPublished: scholarship.isPublished,
    university: scholarship.university,
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
          <Link href="/admin/scholarships/new" className={PRIMARY_BUTTON}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </Link>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total}>
          <ScholarshipFilters universities={universityOptions} />
        </TableToolbar>

        <ScholarshipTable
          rows={rows}
          filtered={q !== "" || universityId !== "" || published !== null}
        />

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
