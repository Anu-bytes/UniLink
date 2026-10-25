import {
  CalendarDays,
  CalendarRange,
  Eye,
  Heart,
  ImageOff,
  Search,
  SearchCheck,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, StatCard, StatCardGrid } from "@/components/admin";
import { ActivityChart, LineChart, RegistrationsChart, TableToggle } from "@/components/admin/stats/charts";
import { ComparisonBars, PerformanceTable } from "@/components/admin/stats/performance";
import { ExportStatsButton } from "@/components/admin/stats/export-button";
import { RankedList, StatPanel, type RankedRow } from "@/components/admin/stats/ranked-list";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import {
  activitySeries,
  siteKpis,
  studentBreakdowns,
  universityPerformance,
  userFunnel,
  type Health,
  type Kpi,
} from "@/lib/admin-analytics";
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
import { FIELDS_OF_STUDY } from "@/lib/fields";
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
  const rawHealth = Array.isArray(sp.health) ? sp.health[0] : sp.health;
  const health: Health | "all" = rawHealth === "well" || rawHealth === "attention" || rawHealth === "steady" ? rawHealth : "all";
  const ta = await getTranslations("Admin.stats.analytics");
  const tOnboarding = await getTranslations("Onboarding.options");
  const tEnums = await getTranslations("Admin.enums");
  const [kpis, activity, funnel, breakdowns, performance] = await Promise.all([
    siteKpis(days),
    activitySeries(days),
    userFunnel(),
    studentBreakdowns(),
    universityPerformance(days),
  ]);

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
  const kpiHint = (kpi: Kpi) => (kpi.previous === null ? periodLabel : `${delta(kpi.value, kpi.previous)} ${t("vsPrevious")}`);
  const kpiTone = (kpi: Kpi) => (kpi.previous === null ? "default" : deltaTone(kpi.value, kpi.previous));
  const percent = (value: number) => `${formatNumber(locale, Math.round(value * 100))}%`;
  const ofRegistered = (value: number) => (funnel.registered ? ta("funnel.share", { value: percent(value / funnel.registered) }) : undefined);
  const healthHref = (option: Health | "all") => {
    const query = new URLSearchParams();
    if (period !== "30") query.set("period", period);
    if (option !== "all") query.set("health", option);
    const qs = query.toString();
    return `/admin/statistics${qs ? `?${qs}` : ""}#universities`;
  };
  const sectionTitle = (id: string, title: string, subtitle: string) => (
    <div id={id} className="mt-10 scroll-mt-20 border-b border-slate-200 pb-2">
      <h2 className="text-[18px] font-semibold text-[#0F172A]">{title}</h2>
      <p className="text-[13px] text-[#64748B]">{subtitle}</p>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex flex-wrap items-center gap-3">
          <ExportStatsButton />
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
          </div>
        }
      />

      {/* Jump between the four parts of the page. */}
      <nav aria-label={ta("nav.label")} className="sticky top-16 z-30 -mx-4 mt-5 flex gap-1 overflow-x-auto border-b border-slate-200 bg-[#F7F8FA]/95 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
        {(["overview", "users", "universities", "searches"] as const).map((key) => (
          <a key={key} href={`#${key}`} className="inline-flex min-h-8 shrink-0 items-center rounded-full px-3 text-[13px] font-semibold text-[#475569] hover:bg-white hover:text-[#0F172A]">
            {ta(`nav.${key}`)}
          </a>
        ))}
      </nav>

      {sectionTitle("overview", ta("overview.title"), ta("overview.subtitle", { period: periodLabel }))}
      <div className="mt-5">
        <StatCardGrid>
          <StatCard label={ta("kpi.views")} value={formatNumber(locale, kpis.views.value)} icon={Eye} tone={kpiTone(kpis.views)} hint={kpiHint(kpis.views)} />
          <StatCard label={ta("kpi.searches")} value={formatNumber(locale, kpis.searches.value)} icon={Search} tone={kpiTone(kpis.searches)} hint={kpiHint(kpis.searches)} />
          <StatCard
            label={ta("kpi.successRate")}
            value={kpis.searches.value ? percent(kpis.successRate.value) : "-"}
            icon={SearchCheck}
            tone={kpis.successRate.value >= 0.9 || !kpis.searches.value ? "positive" : kpis.successRate.value < 0.7 ? "danger" : "warning"}
            hint={ta("kpi.successRateHint")}
          />
          <StatCard label={ta("kpi.saves")} value={formatNumber(locale, kpis.saves.value)} icon={Heart} tone={kpiTone(kpis.saves)} hint={kpiHint(kpis.saves)} />
        </StatCardGrid>
      </div>
      <StatPanel className="mt-5" title={ta("activity.title")} subtitle={ta(`activity.subtitle.${activity.unit}`, { period: periodLabel })}>
        <ActivityChart points={activity.points} unit={activity.unit} />
      </StatPanel>

      {sectionTitle("users", ta("users.title"), ta("users.subtitle"))}
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
        <StatPanel title={ta("funnel.title")} subtitle={ta("funnel.subtitle")}>
          <RankedList
            empty={t("noData")}
            rows={(["registered", "profile", "active", "searched", "saved", "rated"] as const).map((key) => ({
              key,
              label: ta(`funnel.${key}`),
              value: funnel[key],
              note: key === "registered" ? undefined : ofRegistered(funnel[key]),
              noteTone: "muted" as const,
            }))}
          />
        </StatPanel>
        <StatPanel title={ta("who.systems")} subtitle={ta("who.subtitle")}>
          <RankedList
            empty={t("noData")}
            rows={breakdowns.systems.map((row) => ({ key: row.key, label: tOnboarding(`highSchoolSystem.${row.key}`), value: row.value }))}
          />
        </StatPanel>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <StatPanel title={ta("who.fields")} subtitle={ta("who.subtitle")}>
          <RankedList
            empty={t("noData")}
            rows={breakdowns.fields.map((row) => {
              const field = FIELDS_OF_STUDY.find((option) => option.value === row.key);
              return { key: row.key, label: field ? (locale === "ar" ? field.ar : field.en) : row.key, value: row.value };
            })}
          />
        </StatPanel>
        <StatPanel title={ta("who.budgets")} subtitle={ta("who.subtitle")}>
          <RankedList
            empty={t("noData")}
            rows={breakdowns.budgets.map((row) => ({ key: row.key, label: tEnums(`budgetBands.${row.key}`), value: row.value }))}
          />
        </StatPanel>
        <StatPanel title={ta("who.language")} subtitle={ta("who.languageSubtitle")}>
          <RankedList
            empty={t("noData")}
            rows={breakdowns.searchLanguage.map((row) => ({
              key: row.key,
              label: ta(`languages.${row.key === "ar" || row.key === "en" ? row.key : "unknown"}`),
              value: row.value,
            }))}
          />
        </StatPanel>
      </div>

      {sectionTitle("universities", ta("universities.title"), ta("universities.subtitle", { period: periodLabel }))}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <StatPanel title={ta("universities.topTitle")} subtitle={period === "all" ? ta("universities.topAllTime") : ta("universities.topSubtitle", { period: periodLabel })}>
          <ComparisonBars rows={performance} hasPrevious={period !== "all"} />
        </StatPanel>
        <StatPanel title={ta("table.title")} subtitle={ta("table.subtitle")}>
          <PerformanceTable rows={performance} filter={health} hrefFor={healthHref} />
        </StatPanel>
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

      {sectionTitle("searches", ta("searches.title"), ta("searches.subtitle"))}
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
