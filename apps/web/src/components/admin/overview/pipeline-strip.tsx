import { ChevronRight } from "lucide-react";
import type { ApplicationStatus } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/admin";
import {
  APPLICATION_STATUS_ORDER,
  APPLICATION_STATUS_TONES,
} from "@/components/admin/overview/tones";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

/**
 * `counts` arrives zero-filled from the page: groupBy only returns statuses
 * that have rows, and a pipeline missing its "Offer" tile reads as a bug
 * rather than as an empty bucket.
 */
export async function PipelineStrip({
  counts,
  total,
}: {
  counts: Record<ApplicationStatus, number>;
  total: number;
}) {
  const t = await getTranslations("Admin.overview");
  const tStatus = await getTranslations("Applications.status");
  const locale = await getLocale();

  return (
    <section aria-labelledby="admin-overview-pipeline">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h2
            id="admin-overview-pipeline"
            className="text-[15px] font-semibold text-[#0F172A]"
          >
            {t("pipeline.title")}
          </h2>
          <p className="text-[13px] text-[#64748B]">
            {t("pipeline.total", { count: formatNumber(locale, total) })}
          </p>
        </div>
        <Link
          href="/admin/applications"
          aria-label={t("viewAllSection", { section: t("pipeline.title") })}
          className="inline-flex items-center gap-1 rounded text-[13px] font-semibold text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {t("viewAll")}
          <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {APPLICATION_STATUS_ORDER.map((status) => (
          <div
            key={status}
            className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
          >
            <Badge tone={APPLICATION_STATUS_TONES[status]} dot>
              {tStatus(status)}
            </Badge>
            <p className="mt-3 text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[#0F172A]">
              {formatNumber(locale, counts[status])}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
