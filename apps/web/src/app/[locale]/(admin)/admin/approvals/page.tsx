import type { ChangeRequestStatus, Prisma } from "@prisma/client";
import { ClipboardCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { EmptyState, PageHeader, Pagination } from "@/components/admin";
import { ChangeFilters } from "@/components/admin/changes/change-filters";
import { ReviewList } from "@/components/admin/changes/review-list";
import { Link } from "@/i18n/navigation";
import { requireAdminPage, universityIdScope } from "@/lib/admin";
import { adminPage } from "@/lib/admin-validation";
import { buildReviewItems } from "@/lib/admin-review";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const PER_PAGE = 20;
const TABS = ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN", "ALL"] as const;
type Tab = (typeof TABS)[number];

function single(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Every level: reviewers and super admins review the queue; a university
  // admin sees the changes they sent.
  const actor = await requireAdminPage({ minLevel: 1 });
  const t = await getTranslations("Admin.changes");
  const locale = await getLocale();
  const sp = await searchParams;

  const rawTab = single(sp.status).toUpperCase();
  const tab: Tab = (TABS as readonly string[]).includes(rawTab) ? (rawTab as Tab) : "PENDING";
  const universityId = single(sp.university);
  const authorId = actor.level >= 2 ? single(sp.author) : "";
  const page = adminPage(single(sp.page));

  const scope = universityIdScope(actor);
  const base: Prisma.ChangeRequestWhereInput = {
    ...(actor.level === 1 ? { authorId: actor.id } : {}),
    ...(universityId ? { universityId } : {}),
    ...(scope ? { AND: [{ universityId: scope }] } : {}),
    ...(authorId ? { authorId } : {}),
  };
  const where: Prisma.ChangeRequestWhereInput = {
    ...base,
    ...(tab === "ALL" ? {} : { status: tab as ChangeRequestStatus }),
  };

  const [{ items, total }, counts, universities, authors] = await Promise.all([
    buildReviewItems(where, PER_PAGE, (page - 1) * PER_PAGE),
    prisma.changeRequest.groupBy({ by: ["status"], where: base, _count: { _all: true } }),
    prisma.university.findMany({
      where: {
        ...(scope ? { id: scope } : {}),
        changeRequests: { some: actor.level === 1 ? { authorId: actor.id } : {} },
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, nameAr: true },
    }),
    actor.level >= 2
      ? prisma.user.findMany({
          where: { changeRequests: { some: {} } },
          orderBy: { name: "asc" },
          select: { id: true, name: true, email: true },
        })
      : Promise.resolve([]),
  ]);

  const countOf = (status: Tab) =>
    status === "ALL"
      ? counts.reduce((sum, entry) => sum + entry._count._all, 0)
      : (counts.find((entry) => entry.status === status)?._count._all ?? 0);

  const hrefFor = (status: Tab) => {
    const params = new URLSearchParams();
    if (status !== "PENDING") params.set("status", status.toLowerCase());
    if (universityId) params.set("university", universityId);
    if (authorId) params.set("author", authorId);
    const query = params.toString();
    return `/admin/approvals${query ? `?${query}` : ""}`;
  };

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const mine = actor.level === 1;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title={mine ? t("titleMine") : t("title")}
        description={mine ? t("subtitleMine") : t("subtitle")}
      />

      <nav aria-label={t("statusNav")} className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((status) => {
          const active = status === tab;
          const count = countOf(status);
          return (
            <Link
              key={status}
              href={hrefFor(status)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-[13.5px] font-semibold transition-colors",
                active ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {t(`tabs.${status}`)}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] leading-none font-bold tabular-nums",
                  status === "PENDING" && count > 0
                    ? "bg-[#FFF0D1] text-[#B77714]"
                    : active
                      ? "bg-[#EEF3FF]"
                      : "bg-slate-100",
                )}
              >
                {formatNumber(locale, count)}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4">
        <ChangeFilters
          universities={universities.map((university) => ({
            value: university.id,
            label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
          }))}
          authors={authors.map((author) => ({ value: author.id, label: author.name ?? author.email }))}
          university={universityId}
          author={authorId}
        />
      </div>

      <div className="mt-4">
        {items.length ? (
          <ReviewList items={items} canReview={actor.level >= 2} canWithdraw={actor.level === 1} />
        ) : (
          <EmptyState
            icon={ClipboardCheck}
            title={tab === "PENDING" ? (mine ? t("emptyMine") : t("emptyPending")) : t("emptyOther")}
            description={tab === "PENDING" && !mine ? t("emptyPendingBody") : undefined}
          />
        )}
      </div>

      {total > PER_PAGE ? (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} total={total} perPage={PER_PAGE} />
        </div>
      ) : null}
    </div>
  );
}
