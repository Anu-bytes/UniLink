// The Excel export behind /admin/statistics: the same figures as the page,
// laid out as a workbook (summary, activity per period, rankings, searches).

import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import {
  audienceTotals,
  bucketKeys,
  catalogueGaps,
  mostSaved,
  mostSavedPrograms,
  mostSearched,
  registrationTotals,
  topRated,
  topSearchTerms,
  topViewed,
  zeroResultTerms,
  type Granularity,
  type RankedUniversity,
} from "@/lib/admin-stats";
import { prisma } from "@/lib/prisma";
import { buildWorkbook, columnName, type Cell, type Sheet } from "@/lib/xlsx";

const TZ = "Africa/Cairo";

/** How far back each choice reaches: longer than the page's charts, since a sheet has room. */
export const EXPORT_SPAN: Record<Granularity, number> = { day: 90, week: 26, month: 24, year: 5 };
const SPAN_DAYS: Record<Granularity, number> = { day: 90, week: 26 * 7, month: 731, year: 5 * 366 };

export const EXPORT_UNITS = ["day", "week", "month", "year"] as const satisfies readonly Granularity[];

// Every timestamped table the activity sheet counts, by its fixed name: these
// are interpolated as identifiers, so only this list can reach the query.
const COUNTED = {
  students: { table: "User", where: Prisma.sql`role = 'STUDENT'` },
  parents: { table: "User", where: Prisma.sql`role = 'PARENT'` },
  profiles: { table: "StudentProfile", where: Prisma.sql`TRUE` },
  searches: { table: "SearchLog", where: Prisma.sql`TRUE` },
  noResults: { table: "SearchLog", where: Prisma.sql`"resultCount" = 0` },
  savedUniversities: { table: "SavedUniversity", where: Prisma.sql`TRUE` },
  savedPrograms: { table: "SavedProgram", where: Prisma.sql`TRUE` },
  ratings: { table: "UniversityRating", where: Prisma.sql`TRUE` },
} as const;
type Metric = keyof typeof COUNTED | "views";

async function countSeries(metric: keyof typeof COUNTED, unit: Granularity, from: string) {
  const { table, where } = COUNTED[metric];
  const local = Prisma.sql`("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TZ})`;
  const rows = await prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
    SELECT to_char(date_trunc(${unit}, ${local}), 'YYYY-MM-DD') AS bucket, count(*) AS value
    FROM ${Prisma.raw(`"${table}"`)}
    WHERE ${where} AND ${local}::date >= ${from}::date
    GROUP BY 1`;
  return new Map(rows.map((row) => [row.bucket, Number(row.value)]));
}

async function viewSeries(unit: Granularity, from: string) {
  const rows = await prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
    SELECT to_char(date_trunc(${unit}, "day"), 'YYYY-MM-DD') AS bucket, sum(views) AS value
    FROM "UniversityViewDaily" WHERE "day" >= ${from}::date
    GROUP BY 1`;
  return new Map(rows.map((row) => [row.bucket, Number(row.value)]));
}

function periodLabel(locale: string, unit: Granularity, key: string, weekOf: string) {
  const date = new Date(`${key}T00:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, numberingSystem: "latn", timeZone: "UTC" }).format(date);
  if (unit === "day") return format({ weekday: "short", day: "numeric", month: "short", year: "numeric" });
  if (unit === "week") return `${weekOf} ${format({ day: "numeric", month: "short", year: "numeric" })}`;
  if (unit === "month") return format({ month: "long", year: "numeric" });
  return key.slice(0, 4);
}

const title = (text: string): Cell => ({ value: text, style: "title" });
const subtitle = (text: string): Cell => ({ value: text, style: "subtitle" });
const section = (text: string): Cell => ({ value: text, style: "section" });
const header = (text: string, start = false): Cell => ({ value: text, style: start ? "headerStart" : "header" });

export async function buildStatisticsWorkbook(unit: Granularity, locale: "en" | "ar") {
  const t = await getTranslations({ locale, namespace: "Admin.stats.export" });
  const rtl = locale === "ar";
  const keys = bucketKeys(unit, EXPORT_SPAN[unit]);
  const from = keys[0];
  const days = SPAN_DAYS[unit];

  const metrics: Metric[] = ["students", "parents", "profiles", "views", "searches", "noResults", "savedUniversities", "savedPrograms", "ratings"];
  const [seriesMaps, totals, audience, gaps, viewed, searched, saved, rated, savedPrograms, terms, zero] = await Promise.all([
    Promise.all(metrics.map((metric) => (metric === "views" ? viewSeries(unit, from) : countSeries(metric, unit, from)))),
    registrationTotals(),
    audienceTotals(),
    catalogueGaps(),
    topViewed(days, 25),
    mostSearched(days, 25),
    mostSaved(25),
    topRated(25),
    mostSavedPrograms(25),
    topSearchTerms(days, 40),
    zeroResultTerms(days, 25),
  ]);
  const series = Object.fromEntries(metrics.map((metric, i) => [metric, seriesMaps[i]])) as Record<Metric, Map<string, number>>;
  const emptyRow = (): Cell[] => [null, { value: t("empty"), style: "muted" }];
  const nameOf = (entry: { name: string; nameAr: string | null }) => (rtl ? (entry.nameAr ?? entry.name) : entry.name);

  const generated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    numberingSystem: "latn",
    timeZone: TZ,
  }).format(new Date());
  const unitName = t(`units.${unit}`);
  const range = t(`range.${unit}`, { count: EXPORT_SPAN[unit] });
  const intro = t("generated", { date: generated, range });

  // ---- Activity: one row per period, with a total row. ----
  const columns: { metric: "period" | "signups" | Metric; label: string }[] = [
    { metric: "period", label: t("columns.period") },
    { metric: "students", label: t("columns.students") },
    { metric: "parents", label: t("columns.parents") },
    { metric: "signups", label: t("columns.signups") },
    { metric: "profiles", label: t("columns.profiles") },
    { metric: "views", label: t("columns.views") },
    { metric: "searches", label: t("columns.searches") },
    { metric: "noResults", label: t("columns.noResults") },
    { metric: "savedUniversities", label: t("columns.savedUniversities") },
    { metric: "savedPrograms", label: t("columns.savedPrograms") },
    { metric: "ratings", label: t("columns.ratings") },
  ];
  const last = columnName(columns.length - 1);
  const firstData = 5;
  const lastData = firstData + keys.length - 1;
  // Newest first: the period people open the sheet for is at the top.
  const ordered = [...keys].reverse();
  const activityRows: Cell[][] = [
    [title(t("activityTitle", { unit: unitName }))],
    [subtitle(intro)],
    [],
    columns.map((column, i) => header(column.label, i === 0)),
    ...ordered.map((key, r) => {
      const alt = r % 2 === 1;
      return columns.map((column): Cell => {
        if (column.metric === "period") return { value: periodLabel(locale, unit, key, t("weekOf")), style: alt ? "textAlt" : "text" };
        const value =
          column.metric === "signups"
            ? (series.students.get(key) ?? 0) + (series.parents.get(key) ?? 0)
            : (series[column.metric].get(key) ?? 0);
        return { value, style: alt ? "numberAlt" : "number" };
      });
    }),
    columns.map((column, i): Cell => {
      if (i === 0) return { value: t("total"), style: "totalLabel" };
      const col = columnName(i);
      const sum = ordered.reduce((acc, key) => {
        if (column.metric === "signups") return acc + (series.students.get(key) ?? 0) + (series.parents.get(key) ?? 0);
        return acc + (series[column.metric as Metric].get(key) ?? 0);
      }, 0);
      return { value: sum, formula: `SUM(${col}${firstData}:${col}${lastData})`, style: "total" };
    }),
  ];
  const activity: Sheet = {
    name: t("sheets.activity", { unit: unitName }),
    columns: [unit === "week" ? 26 : 22, 13, 13, 14, 15, 14, 12, 16, 16, 15, 11],
    rows: activityRows,
    merges: [`A1:${last}1`, `A2:${last}2`],
    heights: { 1: 34, 2: 20, 4: 36 },
    freeze: { rows: 4, columns: 1 },
    autoFilter: `A4:${last}${lastData}`,
    dataBars: [
      { range: `D${firstData}:D${lastData}`, color: "1E6DEB" },
      { range: `F${firstData}:F${lastData}`, color: "16A34A" },
      { range: `G${firstData}:G${lastData}`, color: "F5A524" },
    ],
    rightToLeft: rtl,
  };

  // ---- Summary ----
  const change = (value: number, previous: number): Cell =>
    previous === 0 ? { value: value > 0 ? t("new") : "", style: "muted" } : { value: (value - previous) / previous, style: "percent" };
  const periodTotal = (metric: Metric) => [...series[metric].values()].reduce((a, b) => a + b, 0);
  const summaryRows: Cell[][] = [
    [title(t("summaryTitle"))],
    [subtitle(intro)],
    [],
    [section(t("audience.title"))],
    [header(t("measure"), true), header(t("value"))],
    ...([
      ["students", audience.students],
      ["parents", audience.parents],
      ["withProfile", audience.withProfile],
      ["active7", audience.active7],
      ["active30", audience.active30],
      ["savedTotal", audience.savedTotal],
      ["ratings", audience.ratings],
    ] as const).map(([key, value], r): Cell[] => [
      { value: t(`audience.${key}`), style: r % 2 ? "textAlt" : "text" },
      { value, style: r % 2 ? "numberAlt" : "number" },
    ]),
    [],
    [section(t("signups.title"))],
    [header(t("signups.window"), true), header(t("signups.now")), header(t("signups.before")), header(t("signups.change"))],
    ...([
      ["day", totals.day],
      ["week", totals.week],
      ["month", totals.month],
      ["year", totals.year],
    ] as const).map(([key, entry]): Cell[] => [
      { value: t(`signups.${key}`), style: "text" },
      { value: entry.value, style: "number" },
      { value: entry.previous, style: "number" },
      change(entry.value, entry.previous),
    ]),
    [],
    [section(t("inRange.title", { range }))],
    [header(t("measure"), true), header(t("value"))],
    ...(["views", "searches", "noResults", "savedUniversities", "savedPrograms", "ratings"] as const).map((metric, r): Cell[] => [
      { value: t(`columns.${metric}`), style: r % 2 ? "textAlt" : "text" },
      { value: periodTotal(metric), style: r % 2 ? "numberAlt" : "number" },
    ]),
    [{ value: t("columns.signups"), style: "totalLabel" }, { value: periodTotal("students") + periodTotal("parents"), style: "total" }],
    [],
    [section(t("gaps.title"))],
    [header(t("gaps.item"), true), header(t("value"))],
    ...([
      ["noLogo", gaps.noLogo],
      ["noCover", gaps.noCover],
      ["noGallery", gaps.noGallery],
      ["noDescription", gaps.noDescription],
      ["programsNoFee", gaps.programsNoFee],
    ] as const).map(([key, value], r): Cell[] => [
      { value: t(`gaps.${key}`), style: r % 2 ? "textAlt" : "text" },
      { value, style: r % 2 ? "numberAlt" : "number" },
    ]),
    [],
    [{ value: t("note"), style: "muted" }],
  ];
  const summary: Sheet = {
    name: t("sheets.summary"),
    columns: [44, 16, 16, 14],
    rows: summaryRows,
    merges: ["A1:D1", "A2:D2", `A${summaryRows.length}:D${summaryRows.length}`],
    heights: { 1: 34, 2: 20 },
    rightToLeft: rtl,
  };

  // ---- Universities: four ranked blocks. ----
  const rankBlock = (heading: string, valueLabel: string, list: RankedUniversity[], withCount = false): Cell[][] => [
    [section(heading)],
    [header("#"), header(t("columns.university"), true), header(valueLabel), ...(withCount ? [header(t("columns.ratingCount"))] : [])],
    ...(list.length
      ? list.map((entry, r): Cell[] => [
          { value: r + 1, style: r % 2 ? "numberAlt" : "number" },
          { value: nameOf(entry), style: r % 2 ? "textAlt" : "text" },
          { value: entry.value, style: withCount ? (r % 2 ? "decimalAlt" : "decimal") : r % 2 ? "numberAlt" : "number" },
          ...(withCount ? [{ value: entry.count ?? 0, style: r % 2 ? ("numberAlt" as const) : ("number" as const) }] : []),
        ])
      : [emptyRow()]),
    [],
  ];
  const universityRows: Cell[][] = [
    [title(t("universitiesTitle"))],
    [subtitle(intro)],
    [],
    ...rankBlock(t("rank.viewed", { range }), t("columns.views"), viewed),
    ...rankBlock(t("rank.searched", { range }), t("columns.searches"), searched),
    ...rankBlock(t("rank.saved"), t("columns.saves"), saved),
    ...rankBlock(t("rank.rated"), t("columns.rating"), rated, true),
  ];
  const universities: Sheet = {
    name: t("sheets.universities"),
    columns: [6, 48, 14, 14],
    rows: universityRows,
    merges: ["A1:D1", "A2:D2"],
    heights: { 1: 34, 2: 20 },
    rightToLeft: rtl,
  };

  // ---- Searches and saved programs ----
  const searchRows: Cell[][] = [
    [title(t("searchesTitle"))],
    [subtitle(intro)],
    [],
    [section(t("rank.terms", { range }))],
    [header("#"), header(t("columns.term"), true), header(t("columns.searches")), header(t("columns.noResults"))],
    ...(terms.length
      ? terms.map((term, r): Cell[] => [
          { value: r + 1, style: r % 2 ? "numberAlt" : "number" },
          { value: term.term, style: r % 2 ? "textAlt" : "text" },
          { value: term.value, style: r % 2 ? "numberAlt" : "number" },
          { value: term.zero, style: r % 2 ? "numberAlt" : "number" },
        ])
      : [emptyRow()]),
    [],
    [section(t("rank.zero", { range }))],
    [header("#"), header(t("columns.term"), true), header(t("columns.searches"))],
    ...(zero.length
      ? zero.map((term, r): Cell[] => [
          { value: r + 1, style: r % 2 ? "numberAlt" : "number" },
          { value: term.term, style: r % 2 ? "textAlt" : "text" },
          { value: term.value, style: r % 2 ? "numberAlt" : "number" },
        ])
      : [emptyRow()]),
    [],
    [section(t("rank.programs"))],
    [header("#"), header(t("columns.program"), true), header(t("columns.saves")), header(t("columns.university"), true)],
    ...(savedPrograms.length
      ? savedPrograms.map((program, r): Cell[] => [
          { value: r + 1, style: r % 2 ? "numberAlt" : "number" },
          { value: rtl ? (program.nameAr ?? program.name) : program.name, style: r % 2 ? "textAlt" : "text" },
          { value: program.value, style: r % 2 ? "numberAlt" : "number" },
          { value: rtl ? (program.universityAr ?? program.university) : program.university, style: r % 2 ? "textAlt" : "text" },
        ])
      : [emptyRow()]),
  ];
  const searches: Sheet = {
    name: t("sheets.searches"),
    columns: [6, 40, 14, 40],
    rows: searchRows,
    merges: ["A1:D1", "A2:D2"],
    heights: { 1: 34, 2: 20 },
    rightToLeft: rtl,
  };

  const file = buildWorkbook([summary, activity, universities, searches], { title: t("summaryTitle") });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  const fileUnit = { day: "daily", week: "weekly", month: "monthly", year: "yearly" }[unit];
  return { file, filename: `unilink-statistics-${fileUnit}-${today}.xlsx` };
}
