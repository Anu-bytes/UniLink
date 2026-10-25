import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { UniversityLogo } from "@/components/university-logo";
import { Link } from "@/i18n/navigation";
import type { Health, UniversityPerformance } from "@/lib/admin-analytics";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const HEALTH_STYLE: Record<Health, string> = {
  well: "bg-[#E7F6EE] text-[#0F7B45]",
  attention: "bg-[#FFF0EE] text-[#C81F15]",
  steady: "bg-slate-100 text-[#475569]",
};

/** Percent change, or null when there is nothing to compare with. */
function change(value: number, previous: number | null) {
  if (previous === null) return null;
  if (previous === 0) return value > 0 ? Infinity : 0;
  return Math.round(((value - previous) / previous) * 100);
}

export async function ChangeBadge({ value, previous }: { value: number; previous: number | null }) {
  const t = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const pct = change(value, previous);
  if (pct === null) return null;
  const up = pct > 0;
  const flat = pct === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        flat ? "bg-slate-100 text-[#64748B]" : up ? "bg-[#E7F6EE] text-[#0F7B45]" : "bg-[#FFF0EE] text-[#C81F15]",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {pct === Infinity ? t("new") : `${up ? "+" : ""}${formatNumber(locale, pct)}%`}
    </span>
  );
}

/** The ten most viewed profiles: this window's bar over the window before. */
export async function ComparisonBars({ rows, hasPrevious }: { rows: UniversityPerformance[]; hasPrevious: boolean }) {
  const t = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const top = rows.filter((row) => row.views > 0).slice(0, 10);
  if (!top.length) return <p className="py-8 text-center text-[13px] text-[#94A3B8]">{t("noViews")}</p>;
  const max = Math.max(...top.map((row) => Math.max(row.views, row.previousViews ?? 0)), 1);
  return (
    <div>
      {hasPrevious ? (
        <p className="mb-3 flex items-center gap-4 text-[12px] text-[#64748B]">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#1E6DEB]" />{t("thisPeriod")}</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#CBD5E1]" />{t("previousPeriod")}</span>
        </p>
      ) : null}
      <ul className="space-y-3">
        {top.map((row) => (
          <li key={row.id}>
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <Link href={`/universities/${row.slug}`} className="flex min-w-0 items-center gap-2 font-medium text-[#0F172A] hover:text-[#1E6DEB]">
                <UniversityLogo name={row.name} logoUrl={row.logoUrl} className="size-6" />
                <span className="truncate">{locale === "ar" ? (row.nameAr ?? row.name) : row.name}</span>
              </Link>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-semibold tabular-nums text-[#0F172A]">{formatNumber(locale, row.views)}</span>
                <ChangeBadge value={row.views} previous={row.previousViews} />
              </span>
            </div>
            <div className="mt-1.5 space-y-1">
              <div className="h-2 rounded-full bg-[#1E6DEB]" style={{ width: `${Math.max(2, (row.views / max) * 100)}%` }} />
              {hasPrevious ? (
                <div className="h-1.5 rounded-full bg-[#CBD5E1]" style={{ width: `${Math.max(row.previousViews ? 2 : 0, ((row.previousViews ?? 0) / max) * 100)}%` }} />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Every published university with its figures, status and the reason for it. */
export async function PerformanceTable({
  rows,
  filter,
  hrefFor,
}: {
  rows: UniversityPerformance[];
  filter: Health | "all";
  hrefFor: (filter: Health | "all") => string;
}) {
  const t = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const counts = { all: rows.length, well: 0, attention: 0, steady: 0 } as Record<Health | "all", number>;
  for (const row of rows) counts[row.health] += 1;
  const shown = filter === "all" ? rows : rows.filter((row) => row.health === filter);

  return (
    <div>
      <div role="tablist" aria-label={t("table.filter")} className="mb-3 flex flex-wrap gap-2">
        {(["all", "attention", "well", "steady"] as const).map((option) => (
          <Link
            key={option}
            href={hrefFor(option)}
            scroll={false}
            role="tab"
            aria-selected={filter === option}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold transition-colors",
              filter === option ? "border-[#0B1220] bg-[#0B1220] text-white" : "border-slate-200 bg-white text-[#475569] hover:border-slate-300",
            )}
          >
            {t(`health.${option}`)}
            <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", filter === option ? "bg-white/20" : "bg-slate-100")}>
              {formatNumber(locale, counts[option])}
            </span>
          </Link>
        ))}
      </div>
      <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">{t("table.university")}</th>
              <th className="px-3 py-2 text-end font-semibold">{t("table.views")}</th>
              <th className="px-3 py-2 text-end font-semibold">{t("table.saves")}</th>
              <th className="px-3 py-2 text-end font-semibold" title={t("table.saveRateHint")}>{t("table.saveRate")}</th>
              <th className="px-3 py-2 text-end font-semibold">{t("table.searches")}</th>
              <th className="px-3 py-2 text-end font-semibold">{t("table.rating")}</th>
              <th className="px-3 py-2 text-start font-semibold">{t("table.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((row) => (
              <tr key={row.id} className="align-middle hover:bg-[#FAFBFD]">
                <td className="px-3 py-2">
                  <Link href={`/admin/universities/${row.id}`} className="flex min-w-0 items-center gap-2 font-medium text-[#0F172A] hover:text-[#1E6DEB]">
                    <UniversityLogo name={row.name} logoUrl={row.logoUrl} className="size-7" />
                    <span className="max-w-[260px] truncate">{locale === "ar" ? (row.nameAr ?? row.name) : row.name}</span>
                  </Link>
                </td>
                <td className="px-3 py-2 text-end">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold tabular-nums">{formatNumber(locale, row.views)}</span>
                    <ChangeBadge value={row.views} previous={row.previousViews} />
                  </span>
                </td>
                <td className="px-3 py-2 text-end tabular-nums">{formatNumber(locale, row.saves)}</td>
                <td className="px-3 py-2 text-end tabular-nums text-[#64748B]">{row.saveRate === null ? "-" : `${formatNumber(locale, row.saveRate)}%`}</td>
                <td className="px-3 py-2 text-end tabular-nums">{formatNumber(locale, row.searches)}</td>
                <td className="px-3 py-2 text-end tabular-nums">
                  {row.rating === null ? <span className="text-[#94A3B8]">-</span> : (
                    <span>
                      {formatNumber(locale, row.rating)} <span className="text-[#F5A524]">★</span>
                      <span className="ms-1 text-[11px] text-[#94A3B8]">({formatNumber(locale, row.ratingCount)})</span>
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-semibold", HEALTH_STYLE[row.health])}>
                    {t(`health.${row.health}`)}
                  </span>
                  {row.reasons.length ? (
                    <span className="ms-2 text-[12px] text-[#64748B]">
                      {row.reasons.map((reason) => t(`reasons.${reason}`, { missing: row.missing })).join(" · ")}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="py-8 text-center text-[13px] text-[#94A3B8]">{t("table.empty")}</p> : null}
      </div>
    </div>
  );
}
