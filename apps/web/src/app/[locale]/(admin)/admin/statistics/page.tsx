import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Heart,
  ImageOff,
  Minus,
  Search,
  SearchCheck,
  SearchX,
  Star,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, StatCard, StatCardGrid } from "@/components/admin";
import { ActivityChart, RegistrationsChart } from "@/components/admin/stats/charts";
import { ExportStatsButton } from "@/components/admin/stats/export-button";
import { ComparisonBars, PerformanceTable } from "@/components/admin/stats/performance";
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
  topRated,
  topSearchTerms,
  trending,
  zeroResultTerms,
  type RankedUniversity,
} from "@/lib/admin-stats";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const PERIODS = ["7", "30", "90", "all"] as const;
type Period = (typeof PERIODS)[number];
const TABS = ["overview", "users", "universities", "searches"] as const;
type Tab = (typeof TABS)[number];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Four tabs, one job each, and every figure in exactly one place. Each tab
 * loads only what it shows.
 */
export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Reviewers and super admins.
  await requireAdminPage({ minLevel: 2 });
  const t = await getTranslations("Admin.stats");
  const ta = await getTranslations("Admin.stats.analytics");
  const sp = await searchParams;
  const rawPeriod = first(sp.period);
  const period: Period = (PERIODS as readonly string[]).includes(rawPeriod ?? "") ? (rawPeriod as Period) : "30";
  const days = period === "all" ? null : Number(period);
  const rawTab = first(sp.tab);
  const tab: Tab = (TABS as readonly string[]).includes(rawTab ?? "") ? (rawTab as Tab) : "overview";
  const periodLabel = t(`periods.${period}`);

  const href = (next: { tab?: Tab; period?: Period; health?: Health | "all" }) => {
    const query = new URLSearchParams();
    const nextTab = next.tab ?? tab;
    const nextPeriod = next.period ?? period;
    if (nextTab !== "overview") query.set("tab", nextTab);
    if (nextPeriod !== "30") query.set("period", nextPeriod);
    if (next.health && next.health !== "all") query.set("health", next.health);
    const qs = query.toString();
    return `/admin/statistics${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader title={t("title")} description={t("subtitle")} actions={<ExportStatsButton />} />

      {/* Tabs on the start side, the period they all share on the end side. */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
        <nav aria-label={ta("nav.label")} className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((key) => (
            <Link
              key={key}
              href={href({ tab: key, health: "all" })}
              scroll={false}
              aria-current={tab === key ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center border-b-2 px-3.5 text-[14px] font-semibold transition-colors",
                tab === key ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {ta(`nav.${key}`)}
            </Link>
          ))}
        </nav>
        <div role="radiogroup" aria-label={t("periodLabel")} className="mb-2 inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {PERIODS.map((option) => (
            <Link
              key={option}
              href={href({ period: option })}
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

      <div className="mt-6">
        {tab === "overview" ? <OverviewTab days={days} periodLabel={periodLabel} href={href} /> : null}
        {tab === "users" ? <UsersTab days={days} periodLabel={periodLabel} /> : null}
        {tab === "universities" ? (
          <UniversitiesTab days={days} periodLabel={periodLabel} hasPrevious={period !== "all"} health={healthOf(first(sp.health))} href={href} />
        ) : null}
        {tab === "searches" ? <SearchesTab days={days} periodLabel={periodLabel} /> : null}
      </div>
    </div>
  );
}

function healthOf(value: string | undefined): Health | "all" {
  return value === "well" || value === "attention" || value === "steady" ? value : "all";
}

type Href = (next: { tab?: "overview" | "users" | "universities" | "searches"; health?: Health | "all" }) => string;

/** "+12% vs the period before", or the period name when there is nothing to compare with. */
async function kpiHelpers(periodLabel: string) {
  const t = await getTranslations("Admin.stats");
  const locale = await getLocale();
  const delta = (value: number, previous: number) => {
    if (previous === 0) return value > 0 ? t("deltaNew") : t("deltaFlat");
    const change = Math.round(((value - previous) / previous) * 100);
    return change === 0 ? t("deltaFlat") : t("delta", { sign: change > 0 ? "+" : "", value: formatNumber(locale, change) });
  };
  return {
    hint: (kpi: Kpi) => (kpi.previous === null ? periodLabel : `${delta(kpi.value, kpi.previous)} ${t("vsPrevious")}`),
    tone: (kpi: Kpi) =>
      kpi.previous === null ? ("default" as const) : kpi.value > kpi.previous ? ("positive" as const) : kpi.value < kpi.previous ? ("danger" as const) : ("default" as const),
    percent: (value: number) => `${formatNumber(locale, Math.round(value * 100))}%`,
    number: (value: number) => formatNumber(locale, value),
  };
}

function universityRows(locale: string, list: RankedUniversity[], extra?: (entry: RankedUniversity) => Partial<RankedRow>): RankedRow[] {
  return list.map((entry) => ({
    key: entry.id,
    label: locale === "ar" ? (entry.nameAr ?? entry.name) : entry.name,
    href: `/universities/${entry.slug}`,
    logo: { name: entry.name, url: entry.logoUrl },
    value: entry.value,
    ...extra?.(entry),
  }));
}

// ---- Overview: the headline numbers, the activity chart and what stands out. ----

async function OverviewTab({ days, periodLabel, href }: { days: number | null; periodLabel: string; href: Href }) {
  const ta = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const [kpis, activity, performance, terms, zero] = await Promise.all([
    siteKpis(days),
    activitySeries(days),
    universityPerformance(days),
    topSearchTerms(days, 1),
    zeroResultTerms(days, 1),
  ]);
  const k = await kpiHelpers(periodLabel);
  const nameOf = (row: { name: string; nameAr: string | null }) => (locale === "ar" ? (row.nameAr ?? row.name) : row.name);

  const topViewed = performance.find((row) => row.views > 0);
  const riser = performance
    .filter((row) => row.previousViews !== null && row.views > (row.previousViews ?? 0))
    .sort((a, b) => b.views - (b.previousViews ?? 0) - (a.views - (a.previousViews ?? 0)))[0];
  const attention = performance.filter((row) => row.health === "attention").length;

  const highlights: { key: string; icon: LucideIcon; tone: string; label: string; value: string; note?: string; href?: string }[] = [
    {
      key: "topViewed",
      icon: Eye,
      tone: "bg-[#EEF3FF] text-[#1E6DEB]",
      label: ta("highlights.topViewed"),
      value: topViewed ? nameOf(topViewed) : ta("highlights.none"),
      note: topViewed ? ta("highlights.views", { count: k.number(topViewed.views) }) : undefined,
      href: topViewed ? `/universities/${topViewed.slug}` : undefined,
    },
    {
      key: "riser",
      icon: TrendingUp,
      tone: "bg-[#E7F6EE] text-[#0F7B45]",
      label: ta("highlights.riser"),
      value: riser ? nameOf(riser) : ta("highlights.none"),
      note: riser ? ta("highlights.rise", { count: k.number(riser.views - (riser.previousViews ?? 0)) }) : undefined,
      href: riser ? `/universities/${riser.slug}` : undefined,
    },
    {
      key: "topTerm",
      icon: Search,
      tone: "bg-[#FFF6E5] text-[#B77714]",
      label: ta("highlights.topTerm"),
      value: terms[0] ? `“${terms[0].term}”` : ta("highlights.none"),
      note: terms[0] ? ta("highlights.searches", { count: k.number(terms[0].value) }) : undefined,
    },
    {
      key: "missing",
      icon: SearchX,
      tone: "bg-[#FFF0EE] text-[#C81F15]",
      label: ta("highlights.missing"),
      value: zero[0] ? `“${zero[0].term}”` : ta("highlights.allFound"),
      note: zero[0] ? ta("highlights.searches", { count: k.number(zero[0].value) }) : undefined,
    },
  ];

  return (
    <div className="space-y-5">
      <StatCardGrid>
        <StatCard label={ta("kpi.views")} value={k.number(kpis.views.value)} icon={Eye} tone={k.tone(kpis.views)} hint={k.hint(kpis.views)} />
        <StatCard
          label={ta("kpi.searches")}
          value={k.number(kpis.searches.value)}
          icon={Search}
          tone={k.tone(kpis.searches)}
          hint={kpis.searches.value ? ta("kpi.searchesHint", { value: k.percent(kpis.successRate.value) }) : k.hint(kpis.searches)}
        />
        <StatCard label={ta("kpi.signups")} value={k.number(kpis.signups.value)} icon={UserPlus} tone={k.tone(kpis.signups)} hint={k.hint(kpis.signups)} />
        <StatCard label={ta("kpi.saves")} value={k.number(kpis.saves.value)} icon={Heart} tone={k.tone(kpis.saves)} hint={k.hint(kpis.saves)} />
      </StatCardGrid>

      <StatPanel title={ta("activity.title")} subtitle={ta(`activity.subtitle.${activity.unit}`, { period: periodLabel })}>
        <ActivityChart points={activity.points} unit={activity.unit} />
      </StatPanel>

      <StatPanel
        title={ta("highlights.title")}
        subtitle={ta("highlights.subtitle", { period: periodLabel })}
        action={
          <Link
            href={href({ tab: "universities", health: "attention" })}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold",
              attention ? "bg-[#FFF0EE] text-[#C81F15] hover:bg-[#FFE4E1]" : "bg-[#E7F6EE] text-[#0F7B45]",
            )}
          >
            {attention ? <AlertTriangle className="size-3.5" aria-hidden /> : <CheckCircle2 className="size-3.5" aria-hidden />}
            {ta("highlights.attention", { count: attention })}
          </Link>
        }
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const body = (
              <>
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", item.tone)}>
                  <item.icon className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-[#64748B]">{item.label}</span>
                  <span className="block truncate text-[14.5px] font-semibold text-[#0F172A]">{item.value}</span>
                  {item.note ? <span className="block text-[12px] text-[#64748B]">{item.note}</span> : null}
                </span>
              </>
            );
            return (
              <li key={item.key}>
                {item.href ? (
                  <Link href={item.href} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:border-[#1E6DEB]/30 hover:bg-[#F7F9FE]">
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </StatPanel>
    </div>
  );
}

// ---- Users: who signs up, how far they get, and who they are. ----

async function UsersTab({ days, periodLabel }: { days: number | null; periodLabel: string }) {
  const t = await getTranslations("Admin.stats");
  const ta = await getTranslations("Admin.stats.analytics");
  const tOnboarding = await getTranslations("Onboarding.options");
  const tEnums = await getTranslations("Admin.enums");
  const locale = await getLocale();
  const [kpis, funnel, breakdowns, audience, day, week, month, year] = await Promise.all([
    siteKpis(days),
    userFunnel(),
    studentBreakdowns(),
    audienceTotals(),
    registrationSeries("day"),
    registrationSeries("week"),
    registrationSeries("month"),
    registrationSeries("year"),
  ]);
  const k = await kpiHelpers(periodLabel);
  const share = (value: number) => (funnel.registered ? ta("funnel.share", { value: k.percent(value / funnel.registered) }) : undefined);

  return (
    <div className="space-y-5">
      <StatCardGrid>
        <StatCard label={t("audience.students")} value={k.number(audience.students)} icon={Users} hint={t("audience.parents", { count: audience.parents })} />
        <StatCard label={ta("kpi.signups")} value={k.number(kpis.signups.value)} icon={UserPlus} tone={k.tone(kpis.signups)} hint={k.hint(kpis.signups)} />
        <StatCard label={t("audience.active")} value={k.number(audience.active7)} icon={UserCheck} hint={t("audience.active30", { count: audience.active30 })} />
        <StatCard
          label={ta("kpi.completed")}
          value={k.number(funnel.profile)}
          icon={CheckCircle2}
          hint={funnel.registered ? ta("funnel.share", { value: k.percent(funnel.profile / funnel.registered) }) : undefined}
        />
      </StatCardGrid>

      <StatPanel title={t("registrations.title")} subtitle={t("registrations.subtitle")}>
        <RegistrationsChart series={{ day, week, month, year }} />
      </StatPanel>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatPanel title={ta("funnel.title")} subtitle={ta("funnel.subtitle")}>
          <RankedList
            empty={t("noData")}
            rows={(["registered", "profile", "active", "searched", "saved", "rated"] as const).map((key) => ({
              key,
              label: ta(`funnel.${key}`),
              value: funnel[key],
              note: key === "registered" ? undefined : share(funnel[key]),
              noteTone: "muted" as const,
            }))}
          />
        </StatPanel>
        <StatPanel title={ta("who.systems")} subtitle={ta("who.subtitle")}>
          <RankedList empty={t("noData")} rows={breakdowns.systems.map((row) => ({ key: row.key, label: tOnboarding(`highSchoolSystem.${row.key}`), value: row.value }))} />
        </StatPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
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
          <RankedList empty={t("noData")} rows={breakdowns.budgets.map((row) => ({ key: row.key, label: tEnums(`budgetBands.${row.key}`), value: row.value }))} />
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
    </div>
  );
}

// ---- Universities: who is doing well, who needs attention, and why. ----

async function UniversitiesTab({
  days,
  periodLabel,
  hasPrevious,
  health,
  href,
}: {
  days: number | null;
  periodLabel: string;
  hasPrevious: boolean;
  health: Health | "all";
  href: Href;
}) {
  const t = await getTranslations("Admin.stats");
  const ta = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const [performance, hot, saved, rated, gaps] = await Promise.all([universityPerformance(days), trending(), mostSaved(), topRated(), catalogueGaps()]);
  const k = await kpiHelpers(periodLabel);
  const count = (value: Health) => performance.filter((row) => row.health === value).length;

  const healthCards: { key: Health; icon: LucideIcon; tone: string }[] = [
    { key: "well", icon: TrendingUp, tone: "bg-[#E7F6EE] text-[#0F7B45]" },
    { key: "attention", icon: AlertTriangle, tone: "bg-[#FFF0EE] text-[#C81F15]" },
    { key: "steady", icon: Minus, tone: "bg-slate-100 text-[#475569]" },
  ];

  return (
    <div className="space-y-5">
      {/* The three groups double as the scorecard's filter. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {healthCards.map((card) => (
          <Link
            key={card.key}
            href={`${href({ tab: "universities", health: health === card.key ? "all" : card.key })}#scorecard`}
            scroll={false}
            aria-current={health === card.key ? "true" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-white p-4 transition-colors",
              health === card.key ? "border-[#0B1220] ring-1 ring-[#0B1220]" : "border-slate-200/80 hover:border-slate-300",
            )}
          >
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", card.tone)}>
              <card.icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[24px] leading-none font-semibold tabular-nums text-[#0F172A]">{k.number(count(card.key))}</span>
              <span className="mt-1 block text-[13px] font-semibold text-[#334155]">{ta(`health.${card.key}`)}</span>
              <span className="block text-[12px] text-[#64748B]">{ta(`healthHint.${card.key}`)}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatPanel title={ta("universities.topTitle")} subtitle={hasPrevious ? ta("universities.topSubtitle", { period: periodLabel }) : ta("universities.topAllTime")}>
          <ComparisonBars rows={performance} hasPrevious={hasPrevious} />
        </StatPanel>
        <StatPanel title={t("trending.title")} subtitle={t("trending.subtitle")}>
          <RankedList
            unit={t("views.unit")}
            empty={t("trending.empty")}
            rows={universityRows(locale, hot, (entry) => {
              const before = entry.previous ?? 0;
              return {
                note: before ? t("trending.growth", { value: formatNumber(locale, Math.round(((entry.value - before) / before) * 100)) }) : t("trending.new"),
                noteTone: "up" as const,
              };
            })}
          />
        </StatPanel>
      </div>

      <div id="scorecard" className="scroll-mt-20">
        <StatPanel title={ta("table.title")} subtitle={`${periodLabel} · ${ta("table.subtitle")}`}>
          <PerformanceTable rows={performance} filter={health} hrefFor={(option) => `${href({ tab: "universities", health: option })}#scorecard`} />
        </StatPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <StatPanel title={t("saved.title")} subtitle={t("allTime")}>
          <RankedList unit={t("saved.unit")} empty={t("noData")} rows={universityRows(locale, saved)} />
        </StatPanel>
        <StatPanel title={t("rated.title")} subtitle={t("rated.subtitle")}>
          <RankedList
            empty={t("rated.empty")}
            rows={universityRows(locale, rated, (entry) => ({
              display: `${formatNumber(locale, entry.value)} ★`,
              note: t("rated.count", { count: entry.count ?? 0 }),
              noteTone: "muted" as const,
            }))}
          />
        </StatPanel>
        <StatPanel title={t("health.title")} subtitle={t("health.subtitle")}>
          <ul className="divide-y divide-slate-100">
            {[
              { key: "noLogo", value: gaps.noLogo, href: "/admin/universities?content=missing" },
              { key: "noCover", value: gaps.noCover, href: "/admin/universities?content=missing" },
              { key: "noGallery", value: gaps.noGallery, href: "/admin/universities" },
              { key: "noDescription", value: gaps.noDescription, href: "/admin/universities?content=missing" },
              { key: "programsNoFee", value: gaps.programsNoFee, href: "/admin/programs" },
            ].map((gap) => (
              <li key={gap.key} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2.5 text-[13.5px] text-[#334155]">
                  <span className={cn("flex size-7 items-center justify-center rounded-lg", gap.value ? "bg-[#FFF6E5] text-[#B77714]" : "bg-[#E7F6EE] text-[#0F7B45]")}>
                    {gap.key === "programsNoFee" ? <Star className="size-3.5" aria-hidden /> : <ImageOff className="size-3.5" aria-hidden />}
                  </span>
                  {t(`health.${gap.key}`)}
                </span>
                <Link href={gap.href} className="text-[13.5px] font-semibold text-[#0F172A] tabular-nums hover:text-[#1E6DEB]">
                  {formatNumber(locale, gap.value)}
                  {gap.key === "programsNoFee" ? <span className="ms-1 text-[11.5px] font-normal text-[#94A3B8]">/ {formatNumber(locale, gaps.programsTotal)}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </StatPanel>
      </div>
    </div>
  );
}

// ---- Searches: what students look for, what they cannot find, what they keep. ----

async function SearchesTab({ days, periodLabel }: { days: number | null; periodLabel: string }) {
  const t = await getTranslations("Admin.stats");
  const ta = await getTranslations("Admin.stats.analytics");
  const locale = await getLocale();
  const [kpis, terms, zero, searched, programs] = await Promise.all([
    siteKpis(days),
    topSearchTerms(days, 12),
    zeroResultTerms(days, 12),
    mostSearched(days),
    mostSavedPrograms(),
  ]);
  const k = await kpiHelpers(periodLabel);
  const noResults = Math.round(kpis.searches.value * (1 - kpis.successRate.value));
  const rate = kpis.successRate.value;

  return (
    <div className="space-y-5">
      <StatCardGrid>
        <StatCard label={ta("kpi.searches")} value={k.number(kpis.searches.value)} icon={Search} tone={k.tone(kpis.searches)} hint={k.hint(kpis.searches)} />
        <StatCard
          label={ta("kpi.successRate")}
          value={kpis.searches.value ? k.percent(rate) : "-"}
          icon={SearchCheck}
          tone={!kpis.searches.value || rate >= 0.9 ? "positive" : rate < 0.7 ? "danger" : "warning"}
          hint={ta("kpi.successRateHint")}
        />
        <StatCard label={ta("kpi.noResults")} value={k.number(noResults)} icon={SearchX} tone={noResults ? "warning" : "positive"} hint={ta("kpi.noResultsHint")} />
        <StatCard label={ta("kpi.searchers")} value={k.number(kpis.searchers.value)} icon={UserCheck} tone={k.tone(kpis.searchers)} hint={ta("kpi.searchersHint")} />
      </StatCardGrid>

      <div className="grid gap-5 lg:grid-cols-2">
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
        <StatPanel title={t("zero.title")} subtitle={`${t("zero.subtitle")} · ${periodLabel}`}>
          <RankedList unit={t("searched.unit")} empty={t("zero.empty")} rows={zero.map((term) => ({ key: term.term, label: term.term, value: term.value }))} />
        </StatPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatPanel title={t("searched.title")} subtitle={`${t("searched.subtitle")} · ${periodLabel}`}>
          <RankedList unit={t("searched.unit")} empty={t("noData")} rows={universityRows(locale, searched)} />
        </StatPanel>
        <StatPanel title={t("programs.title")} subtitle={t("allTime")}>
          <RankedList
            unit={t("saved.unit")}
            empty={t("noData")}
            rows={programs.map((program) => ({
              key: program.id,
              label: locale === "ar" ? (program.nameAr ?? program.name) : program.name,
              sublabel: locale === "ar" ? (program.universityAr ?? program.university) : program.university,
              value: program.value,
            }))}
          />
        </StatPanel>
      </div>
    </div>
  );
}
