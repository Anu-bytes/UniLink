import { Prisma } from "@prisma/client";
import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { LeadTable } from "@/components/admin/growth/lead-table";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import type { LeadRow } from "@/components/admin/growth/types";
import { requireAdminPage } from "@/lib/admin";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The only column /api/admin/leads will sort by. The value arrives as a raw
 * query string, so anything else falls back to `createdAt` rather than being
 * handed to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["createdAt"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.leads");
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);
  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : "createdAt";
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches: whoever handles partnerships
  // searches by whatever they remember off the enquiry — the institution, the
  // town, or the person who sent it.
  const where: Prisma.PartnershipLeadWhereInput = q
    ? {
        OR: [
          { universityName: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { contactFirstName: { contains: q, mode: "insensitive" } },
          { contactLastName: { contains: q, mode: "insensitive" } },
          { contactEmail: { contains: q, mode: "insensitive" } },
          { contactTitle: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.partnershipLead.findMany({
      where,
      // `id` breaks ties. Rows imported in one batch share a `createdAt` to the
      // microsecond, and Postgres is free to return those in a different order
      // per query — which makes a lead jump between pages as the inbox is
      // paged through.
      orderBy: [{ [sort]: order }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        universityName: true,
        city: true,
        contactFirstName: true,
        contactLastName: true,
        contactTitle: true,
        contactEmail: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.partnershipLead.count({ where }),
  ]);

  const leads: LeadRow[] = rows;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader title={t("title")} description={t("subtitle")} />

      {/* The model carries no status, owner or note column, so there is no
          "mark as handled" to find. Saying so here costs one strip and saves
          an admin hunting the screen for a control that would need a
          migration to exist. */}
      <div className="mt-5 flex gap-3 rounded-xl border border-slate-200/80 bg-[#EAF2FE] p-4 text-[13px] text-[#1E6DEB]">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="font-semibold">{t("notice.title")}</p>
          <p className="mt-1 text-[#334155]">{t("notice.description")}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total} />

        <LeadTable rows={leads} filtered={q !== ""} />

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
