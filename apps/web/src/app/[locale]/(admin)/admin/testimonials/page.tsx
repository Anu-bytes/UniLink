import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { PublishedFilter } from "@/components/admin/growth/published-filter";
import { PAGE_WRAPPER, PRIMARY_BUTTON } from "@/components/admin/growth/styles";
import { TestimonialTable } from "@/components/admin/growth/testimonial-table";
import type { TestimonialRow } from "@/components/admin/growth/types";
import { Link } from "@/i18n/navigation";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The columns /api/admin/testimonials will sort by. The value arrives as a raw
 * query string, so anything else falls back to the hand-ordered default rather
 * than being handed to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["sortOrder", "createdAt"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Admin.testimonials");
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);
  const publishedParam = single(sp.published);
  const published =
    publishedParam === "true" ? true : publishedParam === "false" ? false : null;

  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : null;
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches. The Arabic columns are
  // translations of the same two fields, so one query covers both scripts.
  const where: Prisma.TestimonialWhereInput = {
    ...(published === null ? {} : { isPublished: published }),
    ...(q
      ? {
          OR: [
            { studentName: { contains: q, mode: "insensitive" } },
            { quote: { contains: q, mode: "insensitive" } },
            { quoteAr: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
            { locationAr: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // The default matches @@index([isPublished, sortOrder]) and the order the
  // public strip renders in; createdAt only breaks ties between two rows
  // sharing a position. `id` ends every variant: sortOrder defaults to 0 for
  // every row, so without it Postgres is free to return the tied rows in a
  // different order per query — which makes rows jump between pages.
  const orderBy: Prisma.TestimonialOrderByWithRelationInput[] = sort
    ? [{ [sort]: order }, { id: "asc" }]
    : [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "asc" }];

  const [rows, total] = await prisma.$transaction([
    prisma.testimonial.findMany({
      where,
      orderBy,
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        studentName: true,
        quote: true,
        quoteAr: true,
        location: true,
        locationAr: true,
        avatarUrl: true,
        sortOrder: true,
        isPublished: true,
      },
    }),
    prisma.testimonial.count({ where }),
  ]);

  const testimonials: TestimonialRow[] = rows;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));
  const filtered = q !== "" || published !== null;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link href="/admin/testimonials/new" className={PRIMARY_BUTTON}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </Link>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total}>
          <PublishedFilter
            label={t("filters.status")}
            allLabel={t("filters.allStatuses")}
          />
        </TableToolbar>

        <TestimonialTable
          rows={testimonials}
          filtered={filtered}
          // Up and down move a row past the one drawn next to it, which only
          // means anything while the table is showing the strip's own order:
          // under a search or a filter the neighbour on screen is not the
          // neighbour on the home page.
          reorderable={!filtered && sort === null}
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
