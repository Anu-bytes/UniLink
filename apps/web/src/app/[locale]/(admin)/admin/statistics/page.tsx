import {
  CalendarDays,
  CalendarRange,
  Heart,
  ImageOff,
  Search,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, StatCard, StatCardGrid } from "@/components/admin";
import { LineChart, RegistrationsChart, TableToggle } from "@/components/admin/stats/charts";
import { RankedList, StatPanel, type RankedRow } from "@/components/admin/stats/ranked-list";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import {
  audienceTotals,
  catalogueGaps,
  mostSaved,
  mostSavedPrograms,
  mostSearched,
  registrationSeries,
  registrationTotals,
  searchVolume,
  topRated,
  topSearchTerms,
  topViewed,
  trending,
  viewSeries,
  zeroResultTerms,
  type RankedUniversity,
} from "@/lib/admin-stats";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const PERIODS = ["7", "30", "90", "all"] as const;
type Period = (typeof PERIODS)[number];

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Reviewers and super admins.
  await requireAdminPage({ minLevel: 2 });
  const t = await getTranslations("Admin.stats");
  const locale = await getLocale();
  const sp = await searchParams;
  const raw = Array.isArray(sp.period) ? sp.period[0] : sp.period;
  const period: Period = (PERIODS as readonly string[]).includes(raw ?? "") ? (raw as Period) : "30";
  const days = period === "all" ? null : Number(period);

  const [
    totals,
    seriesDay,
    seriesWeek,
    seriesMonth,
    seriesYear,
    views,
    hot,
    viewed,
    searched,
    terms,
    zero,
    searches,
    saved,
    rated,
    savedPrograms,
    audience,
    gaps,
  ] = await Promise.all([
    registrationTotals(),
    registrationSeries("day"),
    registrationSeries("week"),
    registrationSeries("month"),
    registrationSeries("year"),
    viewSeries(),
    trending(),
    topViewed(days),
    mostSearched(days),
    topSearchTerms(days),
    zeroResultTerms(days),
    searchVolume(days),
    mostSaved(),
    topRated(),
    mostSavedPrograms(),
    audienceTotals(),
    catalogueGaps(),
  ]);

  const nameOf = (entry: { name: string; nameAr: string | null }) => (locale === "ar" ? (entry.nameAr ?? entry.name) : entry.name);
  const universityRows = (list: RankedUniversity[], extra?: (entry: RankedUniversity) => Partial<RankedRow>): RankedRow[] =>
    list.map((entry) => ({
      key: entry.id,
      label: nameOf(entry),
      href: `/universities/${entry.slug}`,
      logo: { name: entry.name, url: entry.logoUrl },
      value: entry.value,
      ...extra?.(entry),
    }));

  const delta = (value: number, previous: number) => {
    if (previous === 0) return value > 0 ? t("deltaNew") : t("deltaFlat");
    const change = Math.round(((value - previous) / previous) * 100);
    return change === 0 ? t("deltaFlat") : t("delta", { sign: change > 0 ? "+" : "", value: formatNumber(locale, change) });
  };
  const deltaTone = (value: number, previous: number) => (value > previous ? "positive" : value < previous ? "danger" : "default");

  const totalViews = views.reduce((sum, point) => sum + point.value, 0);
  const periodLabel = t(`periods.${period}`);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div role="radiogroup" aria-label={t("periodLabel")} className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
            {PERIODS.map((option) => (
              <Link
                key={option}
                href={option === "30" ? "/admin/statistics" : `/admin/statistics?period=${option}`}
                role="radio"
                aria-checked={option === period}
                scroll={false}
                className={cn(
                  "inline-flex min-h-8 items-center rounded-md px-3 text-[12.5px] font-semibold",
                  option === period ? "bg-[#0B1220] text-white" : "text-[#64748B] hover:text-[#0F172A]",
                )}
              >
                {t(`periods.${option}`)}
              </Link>
            ))}
          </div>
        }
      />

      {/* Sign-ups: the headline the page leads with. */}
      <div className="mt-6">
        <StatCardGrid>
          <StatCard label={t("signups.today")} value={formatNumber(locale, totals.day.value)} icon={UserPlus} tone={deltaTone(totals.day.value, totals.day.previous)} hint={`${delta(totals.day.value, totals.day.previous)} ${t("vsYesterday")}`} />
          <StatCard label={t("signups.week")} value={formatNumber(locale, totals.week.value)} icon={CalendarDays} tone={deltaTone(totals.week.value, totals.week.previous)} hint={`${delta(totals.week.value, totals.week.previous)} ${t("vsPrevious")}`} />
          <StatCard label={t("signups.month")} value={formatNumber(locale, totals.month.value)} icon={CalendarRange} tone={deltaTone(totals.month.value, totals.month.previous)} hint={`${delta(totals.month.value, totals.month.previous)} ${t("vsPrevious")}`} />
          <StatCard label={t("signups.year")} value={formatNumber(locale, totals.year.value)} icon={Users} tone={deltaTone(totals.year.value, totals.year.previous)} hint={`${delta(totals.year.value, totals.year.previous)} ${t("vsPrevious")}`} />
        </StatCardGrid>
      </div>

      <StatPanel className="mt-5" title={t("registrations.title")} subtitle={t("registrations.subtitle")}>
        <RegistrationsChart series={{ day: seriesDay, week: seriesWeek, month: seriesMonth, year: seriesYear }} />
      </StatPanel>

      <div className="mt-5">
        <StatCardGrid>
          <StatCard label={t("audience.students")} value={formatNumber(locale, audience.students)} icon={Users} hint={t("audience.parents", { count: audience.parents })} />
          <StatCard label={t("audience.active")} value={formatNumber(locale, audience.active7)} icon={UserCheck} hint={t("audience.active30", { count: audience.active30 })} />
          <StatCard label={t("audience.searches")} value={formatNumber(locale, searches)} icon={Search} hint={periodLabel} />
          <StatCard label={t("audience.saves")} value={formatNumber(locale, audience.savedTotal)} icon={Heart} hint={t("audience.ratings", { count: audience.ratings })} />
        </StatCardGrid>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("views.title")} subtitle={t("views.subtitle", { total: formatNumber(locale, totalViews) })}>
          <LineChart points={views} label={t("views.title")} />
          <TableToggle points={views} unit="day" valueLabel={t("views.unit")} />
        </StatPanel>
        <StatPanel title={t("trending.title")} subtitle={t("trending.subtitle")}>
          <RankedList
            unit={t("views.unit")}
            empty={t("trending.empty")}
            rows={universityRows(hot, (entry) => {
              const before = entry.previous ?? 0;
              return {
                note: before ? t("trending.growth", { value: formatNumber(locale, Math.round(((entry.value - before) / before) * 100)) }) : t("trending.new"),
                noteTone: "up" as const,
              };
            })}
          />
        </StatPanel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("viewed.title")} subtitle={periodLabel}>
          <RankedList unit={t("views.unit")} empty={t("noData")} rows={universityRows(viewed)} />
        </StatPanel>
        <StatPanel title={t("searched.title")} subtitle={`${t("searched.subtitle")} · ${periodLabel}`}>
          <RankedList unit={t("searched.unit")} empty={t("noData")} rows={universityRows(searched)} />
        </StatPanel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("terms.title")} subtitle={periodLabel}>
          <RankedList
            unit={t("searched.unit")}
            empty={t("noData")}
            rows={terms.map((term) => ({
              key: term.term,
              label: term.term,
              value: term.value,
              note: term.zero ? t("terms.zero", { count: term.zero }) : undefined,
              noteTone: "down" as const,
            }))}
          />
        </StatPanel>
        <StatPanel title={t("zero.title")} subtitle={t("zero.subtitle")}>
          <RankedList
            unit={t("searched.unit")}
            empty={t("zero.empty")}
            rows={zero.map((term) => ({ key: term.term, label: term.term, value: term.value }))}
          />
        </StatPanel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("saved.title")} subtitle={t("allTime")}>
          <RankedList unit={t("saved.unit")} empty={t("noData")} rows={universityRows(saved)} />
        </StatPanel>
        <StatPanel title={t("rated.title")} subtitle={t("rated.subtitle")}>
          <RankedList
            empty={t("rated.empty")}
            rows={universityRows(rated, (entry) => ({
              display: `${formatNumber(locale, entry.value)} ★`,
              note: t("rated.count", { count: entry.count ?? 0 }),
              noteTone: "muted" as const,
            }))}
          />
        </StatPanel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("programs.title")} subtitle={t("allTime")}>
          <RankedList
            unit={t("saved.unit")}
            empty={t("noData")}
            rows={savedPrograms.map((program) => ({
              key: program.id,
              label: locale === "ar" ? (program.nameAr ?? program.name) : program.name,
              sublabel: locale === "ar" ? (program.universityAr ?? program.university) : program.university,
              value: program.value,
            }))}
          />
        </StatPanel>
        <StatPanel title={t("health.title")} subtitle={t("health.subtitle")}>
          <ul className="divide-y divide-slate-100">
            {[
              { key: "noCover", value: gaps.noCover, href: "/admin/universities" },
              { key: "noGallery", value: gaps.noGallery, href: "/admin/universities" },
              { key: "noLogo", value: gaps.noLogo, href: "/admin/universities" },
              { key: "noDescription", value: gaps.noDescription, href: "/admin/universities" },
              { key: "programsNoFee", value: gaps.programsNoFee, href: "/admin/programs" },
            ].map((gap) => (
              <li key={gap.key} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2.5 text-[13.5px] text-[#334155]">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg",
                      gap.value ? "bg-[#FFF6E5] text-[#B77714]" : "bg-[#E7F6EE] text-[#0F7B45]",
                    )}
                  >
                    {gap.key === "programsNoFee" ? <Star className="size-3.5" aria-hidden /> : <ImageOff className="size-3.5" aria-hidden />}
                  </span>
                  {t(`health.${gap.key}`)}
                </span>
                <Link href={gap.href} className="text-[13.5px] font-semibold text-[#0F172A] tabular-nums hover:text-[#1E6DEB]">
                  {formatNumber(locale, gap.value)}
                  {gap.key === "programsNoFee" ? (
                    <span className="ms-1 text-[11.5px] font-normal text-[#94A3B8]">/ {formatNumber(locale, gaps.programsTotal)}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </StatPanel>
      </div>
    </div>
  );
}
