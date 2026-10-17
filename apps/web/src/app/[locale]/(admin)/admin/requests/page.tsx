import type { Prisma } from "@prisma/client";
import { CalendarDays, Inbox, Presentation, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, EmptyState, PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { adminPage } from "@/lib/admin-validation";
import { formatDate } from "@/lib/format";
import { OPEN_STATUSES, PARTNER_REQUEST_STATUSES, STATUS_TONE, type PartnerRequestState } from "@/lib/partner-requests";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const TYPES = { demo: "DEMO", representative: "REPRESENTATIVE" } as const;
const VIEWS = ["open", "all", ...PARTNER_REQUEST_STATUSES.map((status) => status.toLowerCase())] as const;

function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

/**
 * The inbox for demo requests and university representative applications
 * from the public "Work with us" page. Everything shown was typed by a
 * stranger and is rendered as text only.
 */
export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const t = await getTranslations("Admin.requests");
  const locale = await getLocale();
  const sp = await searchParams;

  const typeKey = single(sp.type) as keyof typeof TYPES;
  const type = TYPES[typeKey] ?? null;
  const view = (VIEWS as readonly string[]).includes(single(sp.status)) ? single(sp.status) : "open";
  const q = single(sp.q).slice(0, 120);
  const page = adminPage(single(sp.page));

  const statusWhere: Prisma.PartnerRequestWhereInput =
    view === "all"
      ? {}
      : view === "open"
        ? { status: { in: [...OPEN_STATUSES] } }
        : { status: view.toUpperCase() as PartnerRequestState };
  const where: Prisma.PartnerRequestWhereInput = {
    ...(type ? { type } : {}),
    ...statusWhere,
    ...(q
      ? {
          OR: [
            { universityName: { contains: q, mode: "insensitive" } },
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { jobTitle: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total, counts] = await Promise.all([
    prisma.partnerRequest.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        type: true,
        status: true,
        fullName: true,
        jobTitle: true,
        email: true,
        universityName: true,
        city: true,
        preferredDate: true,
        scheduledAt: true,
        createdAt: true,
      },
    }),
    prisma.partnerRequest.count({ where }),
    prisma.partnerRequest.groupBy({
      by: ["type", "status"],
      _count: { _all: true },
      orderBy: { type: "asc" },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));
  const countOf = (filter: (row: (typeof counts)[number]) => boolean) =>
    counts.filter(filter).reduce((sum, row) => sum + row._count._all, 0);
  const newCount = (kind: string | null) => countOf((row) => row.status === "NEW" && (!kind || row.type === kind));

  const href = (next: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const merged = { type: typeKey && type ? typeKey : null, status: view === "open" ? null : view, q: q || null, ...next };
    for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
    const query = params.toString();
    return `/admin/requests${query ? `?${query}` : ""}`;
  };

  const tabs = [
    { key: null, label: t("tabs.all"), icon: Inbox, count: newCount(null) },
    { key: "demo", label: t("tabs.demo"), icon: Presentation, count: newCount("DEMO") },
    { key: "representative", label: t("tabs.representative"), icon: ShieldCheck, count: newCount("REPRESENTATIVE") },
  ];

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader title={t("title")} description={t("subtitle")} />

      <nav aria-label={t("title")} className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => {
          const active = (tab.key ?? "") === (type ? typeKey : "");
          return (
            <Link
              key={tab.label}
              href={href({ type: tab.key, page: null })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-[13.5px] font-semibold",
                active ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              <tab.icon className="size-4" aria-hidden />
              {tab.label}
              {tab.count > 0 ? (
                <span className="rounded-full bg-[#1E6DEB] px-1.5 text-[11px] leading-5 font-bold text-white">{tab.count}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {VIEWS.map((entry) => (
          <Link
            key={entry}
            href={href({ status: entry === "open" ? null : entry, page: null })}
            aria-current={view === entry ? "page" : undefined}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-semibold",
              view === entry ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-200 bg-white text-[#475569] hover:bg-slate-50",
            )}
          >
            {t(`views.${entry}`)}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total} />

        {rows.length === 0 ? (
          <EmptyState icon={Inbox} title={q ? t("empty.filteredTitle") : t("empty.title")} description={q ? t("empty.filteredBody") : t("empty.body")} />
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/80 bg-white">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/requests/${row.id}`}
                  className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] sm:flex-row sm:items-center sm:gap-4"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      row.type === "DEMO" ? "bg-[#EEF3FF] text-[#1E6DEB]" : "bg-[#F1EDFF] text-[#6D4AE0]",
                    )}
                    aria-hidden
                  >
                    {row.type === "DEMO" ? <Presentation className="size-4" /> : <ShieldCheck className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cn("truncate text-[14px] text-[#0F172A]", row.status === "NEW" ? "font-bold" : "font-semibold")}>
                        <bdi>{row.universityName}</bdi>
                      </span>
                      <span className="text-[12px] text-[#64748B]">{t(`types.${row.type}`)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-[#64748B]">
                      <bdi>{row.fullName}</bdi> · <bdi>{row.jobTitle}</bdi> · <bdi dir="ltr">{row.email}</bdi>
                    </span>
                  </span>
                  {row.type === "DEMO" && (row.scheduledAt || row.preferredDate) ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] text-[#475569]">
                      <CalendarDays className="size-3.5" aria-hidden />
                      {row.scheduledAt
                        ? t("list.scheduledFor", { date: formatDate(locale, row.scheduledAt) })
                        : t("list.prefers", { date: formatDate(locale, row.preferredDate!) })}
                    </span>
                  ) : null}
                  <span className="flex shrink-0 items-center gap-3">
                    <Badge tone={STATUS_TONE[row.status]} dot>
                      {t(`status.${row.status}`)}
                    </Badge>
                    <span className="text-[12px] text-[#94A3B8]">
                      <RelativeDate value={row.createdAt} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 ? <Pagination page={page} totalPages={totalPages} total={total} perPage={DEFAULT_PER_PAGE} /> : null}
      </div>
    </div>
  );
}
