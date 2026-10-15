import { ArrowRight, BarChart3, CheckCheck, Eye, Search, UserPlus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, StatCard, StatCardGrid } from "@/components/admin";
import { ApprovalsSnapshot } from "@/components/admin/home/approvals-snapshot";
import { Link } from "@/i18n/navigation";
import type { AdminActor } from "@/lib/admin";
import { registrationTotals, searchVolume, viewSeries } from "@/lib/admin-stats";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/** Level 2: the review queue first, then the week's numbers. */
export async function ReviewerHome({ actor }: { actor: AdminActor }) {
  const t = await getTranslations("Admin.home");
  const locale = await getLocale();

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [totals, views, searches, reviewed] = await Promise.all([
    registrationTotals(),
    viewSeries(),
    searchVolume(7),
    prisma.changeRequest.count({ where: { reviewerId: actor.id, reviewedAt: { gte: monthStart } } }),
  ]);
  const weekViews = views.slice(-7).reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader title={t("welcome", { name: actor.name?.split(" ")[0] ?? "" })} description={t("reviewerSubtitle")} />
      <div className="mt-6 space-y-5">
        <ApprovalsSnapshot />
        <StatCardGrid>
          <StatCard label={t("weekSignups")} value={formatNumber(locale, totals.week.value)} icon={UserPlus} />
          <StatCard label={t("weekViews")} value={formatNumber(locale, weekViews)} icon={Eye} />
          <StatCard label={t("weekSearches")} value={formatNumber(locale, searches)} icon={Search} />
          <StatCard label={t("reviewedByYou")} value={formatNumber(locale, reviewed)} icon={CheckCheck} tone="positive" />
        </StatCardGrid>
        <Link
          href="/admin/statistics"
          className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 text-[14px] font-semibold text-[#0F172A] hover:border-[#1E6DEB]/40 hover:bg-[#F7F9FE]"
        >
          <span className="flex items-center gap-3">
            <BarChart3 className="size-5 text-[#1E6DEB]" aria-hidden />
            {t("openStatistics")}
          </span>
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
