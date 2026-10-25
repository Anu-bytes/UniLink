// The Excel export behind /admin/statistics: the same figures as the page,
// laid out as a workbook: a dashboard summary, activity per period with
// charts, the university scorecard, and searches.

import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { siteKpis, universityPerformance, userFunnel, type Health, type Kpi } from "@/lib/admin-analytics";
import {
  audienceTotals,
  bucketKeys,
  catalogueGaps,
  mostSavedPrograms,
  registrationTotals,
  topSearchTerms,
  zeroResultTerms,
  type Granularity,
} from "@/lib/admin-stats";
import { prisma } from "@/lib/prisma";
import { buildWorkbook, columnName, type Cell, type CellStyle, type Sheet } from "@/lib/xlsx";
import { XLSX_LOGO } from "@/lib/xlsx-logo";

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

const LOGO = Buffer.from(XLSX_LOGO.png, "base64");
const BRAND = { blue: "1E6DEB", green: "16A34A", amber: "F5A524", red: "C81F15" };

/** Rows 1-4 of every sheet: logo, title, subtitle with a blue underline, a spacer. */
function banner(title: string, subtitle: string, width: number): Cell[][] {
  return [
    [],
    [{ value: title, style: "title" }],
    Array.from({ length: width }, (_, i): Cell => ({ value: i === 0 ? subtitle : null, style: "subtitle" })),
    [],
  ];
}
const BANNER_HEIGHTS: Record<number, number> = { 1: 46, 2: 30, 3: 20, 4: 12 };
const bannerMerges = (width: number) => [`A2:${columnName(width - 1)}2`, `A3:${columnName(width - 1)}3`];

const section = (text: string): Cell => ({ value: text, style: "section" });
const header = (text: string, start = false): Cell => ({ value: text, style: start ? "headerStart" : "header" });
const zebra = (r: number, even: CellStyle, odd: CellStyle) => (r % 2 ? odd : even);

/** Taller rows for section titles, table headers and tiles. */
function heightsFor(rows: Cell[][]) {
  const heights: Record<number, number> = { ...BANNER_HEIGHTS };
  rows.forEach((row, i) => {
    if (i < 4) return;
    const style = row[0] && typeof row[0] === "object" ? row[0].style : undefined;
    if (style === "section") heights[i + 1] = 28;
    if (style === "header" || style === "headerStart") heights[i + 1] = 30;
    if (style === "tileLabel" || style === "tileHint") heights[i + 1] = 24;
    if (style === "tileValue" || style === "tileValuePercent") heights[i + 1] = 38;
  });
  return heights;
}

export async function buildStatisticsWorkbook(unit: Granularity, locale: "en" | "ar") {
  const t = await getTranslations({ locale, namespace: "Admin.stats.export" });
  const ta = await getTranslations({ locale, namespace: "Admin.stats.analytics" });
  const rtl = locale === "ar";
  const keys = bucketKeys(unit, EXPORT_SPAN[unit]);
  const from = keys[0];
  const days = SPAN_DAYS[unit];

  const metrics: Metric[] = ["students", "parents", "profiles", "views", "searches", "noResults", "savedUniversities", "savedPrograms", "ratings"];
  const [seriesMaps, totals, audience, gaps, kpis, funnel, performance, savedPrograms, terms, zero] = await Promise.all([
    Promise.all(metrics.map((metric) => (metric === "views" ? viewSeries(unit, from) : countSeries(metric, unit, from)))),
    registrationTotals(),
    audienceTotals(),
    catalogueGaps(),
    siteKpis(days),
    userFunnel(),
    universityPerformance(days),
    mostSavedPrograms(25),
    topSearchTerms(days, 40),
    zeroResultTerms(days, 25),
  ]);
  const series = Object.fromEntries(metrics.map((metric, i) => [metric, seriesMaps[i]])) as Record<Metric, Map<string, number>>;
  const nameOf = (entry: { name: string; nameAr: string | null }) => (rtl ? (entry.nameAr ?? entry.name) : entry.name);
  const emptyRow = (): Cell[] => [null, { value: t("empty"), style: "muted" }];

  const generated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short", numberingSystem: "latn", timeZone: TZ }).format(new Date());
  const unitName = t(`units.${unit}`);
  const range = t(`range.${unit}`, { count: EXPORT_SPAN[unit] });
  const intro = t("generated", { date: generated, range });
  const logo = { png: LOGO, width: XLSX_LOGO.width, height: XLSX_LOGO.height, at: { col: 0, row: 0 } };
  const pct = (value: number) => `${Math.round(value * 100)}%`;
  const changeText = (kpi: Kpi) => {
    if (kpi.previous === null) return range;
    if (kpi.previous === 0) return kpi.value > 0 ? t("tiles.newVsBefore") : t("tiles.flat");
    const change = Math.round(((kpi.value - kpi.previous) / kpi.previous) * 100);
    return change === 0 ? t("tiles.flat") : t("tiles.vsBefore", { change: `${change > 0 ? "▲" : "▼"} ${Math.abs(change)}%` });
  };

  // ---- Summary: two rows of tiles, then three short tables. ----
  const tiles = (items: { label: string; value: number; percent?: boolean; hint: string }[]): Cell[][] => [
    items.map((item): Cell => ({ value: item.label, style: "tileLabel" })),
    items.map((item): Cell => ({ value: item.value, style: item.percent ? "tileValuePercent" : "tileValue" })),
    items.map((item): Cell => ({ value: item.hint, style: "tileHint" })),
  ];
  const signupWindows = [
    ["day", totals.day],
    ["week", totals.week],
    ["month", totals.month],
    ["year", totals.year],
  ] as const;
  const journey = ["registered", "profile", "active", "searched", "saved", "rated"] as const;
  const gapRows = [
    ["noLogo", gaps.noLogo],
    ["noCover", gaps.noCover],
    ["noGallery", gaps.noGallery],
    ["noDescription", gaps.noDescription],
    ["programsNoFee", gaps.programsNoFee],
  ] as const;
  const blank = (r: number): Cell => ({ value: null, style: zebra(r, "text", "textAlt") });
  const summaryRows: Cell[][] = [
    ...banner(t("summaryTitle"), intro, 4),
    [section(t("tiles.periodTitle", { range }))],
    ...tiles([
      { label: ta("kpi.views"), value: kpis.views.value, hint: changeText(kpis.views) },
      { label: ta("kpi.searches"), value: kpis.searches.value, hint: changeText(kpis.searches) },
      { label: ta("kpi.successRate"), value: kpis.successRate.value, percent: true, hint: ta("kpi.successRateHint") },
      { label: ta("kpi.signups"), value: kpis.signups.value, hint: changeText(kpis.signups) },
    ]),
    [],
    [section(t("audience.title"))],
    ...tiles([
      { label: t("audience.students"), value: audience.students, hint: t("tiles.parents", { count: audience.parents }) },
      { label: t("tiles.active7"), value: audience.active7, hint: t("tiles.active30", { count: audience.active30 }) },
      {
        label: t("audience.withProfile"),
        value: funnel.profile,
        hint: funnel.registered ? ta("funnel.share", { value: pct(funnel.profile / funnel.registered) }) : "",
      },
      { label: t("audience.savedTotal"), value: audience.savedTotal, hint: t("tiles.ratings", { count: audience.ratings }) },
    ]),
    [],
    [section(t("signups.title"))],
    [header(t("signups.window"), true), header(t("signups.now")), header(t("signups.before")), header(t("signups.change"))],
    ...signupWindows.map(([key, entry], r): Cell[] => [
      { value: t(`signups.${key}`), style: zebra(r, "text", "textAlt") },
      { value: entry.value, style: zebra(r, "number", "numberAlt") },
      { value: entry.previous, style: zebra(r, "number", "numberAlt") },
      entry.previous === 0
        ? { value: entry.value > 0 ? t("new") : "", style: zebra(r, "text", "textAlt") }
        : { value: (entry.value - entry.previous) / entry.previous, style: zebra(r, "change", "changeAlt") },
    ]),
    [],
    [section(ta("funnel.title"))],
    [header(t("journey.step"), true), header(t("journey.users")), header(t("journey.share")), header("")],
    ...journey.map((key, r): Cell[] => [
      { value: ta(`funnel.${key}`), style: zebra(r, "text", "textAlt") },
      { value: funnel[key], style: zebra(r, "number", "numberAlt") },
      { value: funnel.registered ? funnel[key] / funnel.registered : 0, style: zebra(r, "percent", "percentAlt") },
      blank(r),
    ]),
    [],
    [section(t("gaps.title"))],
    [header(t("gaps.item"), true), header(t("value")), header(""), header("")],
    ...gapRows.map(([key, value], r): Cell[] => [{ value: t(`gaps.${key}`), style: zebra(r, "text", "textAlt") }, { value, style: zebra(r, "number", "numberAlt") }, blank(r), blank(r)]),
    [],
    [{ value: t("note"), style: "muted" }],
  ];
  const summary: Sheet = {
    name: t("sheets.summary"),
    columns: [34, 26, 26, 26],
    rows: summaryRows,
    merges: [...bannerMerges(4), `A${summaryRows.length}:D${summaryRows.length}`],
    heights: heightsFor(summaryRows),
    logo,
    rightToLeft: rtl,
  };

  // ---- Activity: one row per period, oldest first so the charts read in time order. ----
  const columns: { metric: "period" | "signups" | Metric; label: string }[] = [
    { metric: "period", label: t("columns.period") },
    { metric: "views", label: t("columns.views") },
    { metric: "searches", label: t("columns.searches") },
    { metric: "noResults", label: t("columns.noResults") },
    { metric: "students", label: t("columns.students") },
    { metric: "parents", label: t("columns.parents") },
    { metric: "signups", label: t("columns.signups") },
    { metric: "profiles", label: t("columns.profiles") },
    { metric: "savedUniversities", label: t("columns.savedUniversities") },
    { metric: "savedPrograms", label: t("columns.savedPrograms") },
    { metric: "ratings", label: t("columns.ratings") },
  ];
  const valueOf = (metric: "signups" | Metric, key: string) =>
    metric === "signups" ? (series.students.get(key) ?? 0) + (series.parents.get(key) ?? 0) : (series[metric].get(key) ?? 0);
  const width = columns.length;
  const headerRow = 5;
  const firstData = headerRow + 1;
  const lastData = firstData + keys.length - 1;
  const activityRows: Cell[][] = [
    ...banner(t("activityTitle", { unit: unitName }), intro, width),
    columns.map((column, i) => header(column.label, i === 0)),
    ...keys.map((key, r) =>
      columns.map((column): Cell =>
        column.metric === "period"
          ? { value: periodLabel(locale, unit, key, t("weekOf")), style: zebra(r, "text", "textAlt") }
          : { value: valueOf(column.metric, key), style: zebra(r, "number", "numberAlt") },
      ),
    ),
    columns.map((column, i): Cell => {
      if (i === 0) return { value: t("total"), style: "totalLabel" };
      const col = columnName(i);
      const sum = keys.reduce((acc, key) => acc + valueOf(column.metric as "signups" | Metric, key), 0);
      return { value: sum, formula: `SUM(${col}${firstData}:${col}${lastData})`, style: "total" };
    }),
  ];
  // Charts sit to the side of the table, after a narrow gap column.
  const chartCol = width + 1;
  const chartRows = 17;
  const categories = `A${firstData}:A${lastData}`;
  const activity: Sheet = {
    name: t("sheets.activity", { unit: unitName }),
    columns: [unit === "week" ? 26 : unit === "day" ? 22 : 18, 13, 12, 14, 12, 12, 13, 14, 15, 14, 11, 3],
    rows: activityRows,
    merges: bannerMerges(width),
    heights: heightsFor(activityRows),
    freeze: { rows: headerRow, columns: 1 },
    autoFilter: `A${headerRow}:${columnName(width - 1)}${lastData}`,
    logo,
    charts: [
      {
        title: t("columns.views"),
        categories,
        series: [{ name: t("columns.views"), values: `B${firstData}:B${lastData}`, color: BRAND.blue }],
        from: { col: chartCol, row: headerRow - 1 },
        to: { col: chartCol + 9, row: headerRow - 1 + chartRows },
      },
      {
        title: t("columns.signups"),
        categories,
        series: [{ name: t("columns.signups"), values: `G${firstData}:G${lastData}`, color: BRAND.green }],
        from: { col: chartCol, row: headerRow + chartRows },
        to: { col: chartCol + 9, row: headerRow + chartRows * 2 },
      },
      {
        title: t("charts.searches"),
        categories,
        series: [
          { name: t("columns.searches"), values: `C${firstData}:C${lastData}`, color: BRAND.amber },
          { name: t("columns.noResults"), values: `D${firstData}:D${lastData}`, color: BRAND.red },
        ],
        from: { col: chartCol, row: headerRow + chartRows * 2 + 1 },
        to: { col: chartCol + 9, row: headerRow + chartRows * 3 + 1 },
      },
    ],
    rightToLeft: rtl,
  };

  // ---- Universities: the scorecard, as on the page. ----
  const statusStyle: Record<Health, CellStyle> = { well: "statusWell", attention: "statusAttention", steady: "statusSteady" };
  const uniColumns = [
    "#",
    t("columns.university"),
    t("columns.views"),
    t("scorecard.before"),
    t("signups.change"),
    t("columns.saves"),
    t("scorecard.saveRate"),
    t("scorecard.foundInSearch"),
    t("columns.rating"),
    t("columns.ratingCount"),
    t("scorecard.status"),
    t("scorecard.why"),
  ];
  const uniWidth = uniColumns.length;
  const uniFirst = headerRow + 1;
  const uniRows: Cell[][] = [
    ...banner(t("universitiesTitle"), intro, uniWidth),
    uniColumns.map((label, i) => header(label, i === 1 || i === uniWidth - 1)),
    ...performance.map((row, r): Cell[] => {
      const before = row.previousViews;
      const change: Cell =
        before === null
          ? blank(r)
          : before === 0
            ? { value: row.views > 0 ? t("new") : "", style: zebra(r, "text", "textAlt") }
            : { value: (row.views - before) / before, style: zebra(r, "change", "changeAlt") };
      return [
        { value: r + 1, style: zebra(r, "number", "numberAlt") },
        { value: nameOf(row), style: "label" },
        { value: row.views, style: zebra(r, "number", "numberAlt") },
        { value: before, style: zebra(r, "number", "numberAlt") },
        change,
        { value: row.saves, style: zebra(r, "number", "numberAlt") },
        { value: row.views ? row.saves / row.views : null, style: zebra(r, "percent", "percentAlt") },
        { value: row.searches, style: zebra(r, "number", "numberAlt") },
        { value: row.rating, style: zebra(r, "decimal", "decimalAlt") },
        { value: row.ratingCount, style: zebra(r, "number", "numberAlt") },
        { value: ta(`health.${row.health}`), style: statusStyle[row.health] },
        { value: row.reasons.map((reason) => ta(`reasons.${reason}`, { missing: row.missing })).join(" · "), style: zebra(r, "text", "textAlt") },
      ];
    }),
  ];
  const uniLast = uniFirst + performance.length - 1;
  const top = Math.min(10, performance.filter((row) => row.views > 0).length);
  const universities: Sheet = {
    name: t("sheets.universities"),
    columns: [6, 40, 11, 13, 12, 10, 11, 13, 10, 10, 16, 40, 3],
    rows: uniRows,
    merges: bannerMerges(uniWidth),
    heights: heightsFor(uniRows),
    freeze: { rows: headerRow, columns: 2 },
    autoFilter: `A${headerRow}:${columnName(uniWidth - 1)}${Math.max(uniLast, uniFirst)}`,
    dataBars: performance.length ? [{ range: `C${uniFirst}:C${uniLast}`, color: BRAND.blue }] : [],
    logo,
    charts: top
      ? [
          {
            title: t("charts.topViewed"),
            direction: "bar",
            categories: `B${uniFirst}:B${uniFirst + top - 1}`,
            series: [{ name: t("columns.views"), values: `C${uniFirst}:C${uniFirst + top - 1}`, color: BRAND.blue }],
            from: { col: uniWidth + 1, row: headerRow - 1 },
            to: { col: uniWidth + 8, row: headerRow + 20 },
          },
        ]
      : [],
    rightToLeft: rtl,
  };

  // ---- Searches and saves ----
  const termFirst = headerRow + 1;
  const searchRows: Cell[][] = [
    ...banner(t("searchesTitle"), intro, 4),
    [header("#"), header(t("columns.term"), true), header(t("columns.searches")), header(t("columns.noResults"))],
    ...(terms.length
      ? terms.map((term, r): Cell[] => [
          { value: r + 1, style: zebra(r, "number", "numberAlt") },
          { value: term.term, style: zebra(r, "text", "textAlt") },
          { value: term.value, style: zebra(r, "number", "numberAlt") },
          { value: term.zero, style: zebra(r, "number", "numberAlt") },
        ])
      : [emptyRow()]),
    [],
    [section(t("rank.zero", { range }))],
    [header("#"), header(t("columns.term"), true), header(t("columns.searches")), header("")],
    ...(zero.length
      ? zero.map((term, r): Cell[] => [
          { value: r + 1, style: zebra(r, "number", "numberAlt") },
          { value: term.term, style: zebra(r, "text", "textAlt") },
          { value: term.value, style: zebra(r, "number", "numberAlt") },
          blank(r),
        ])
      : [emptyRow()]),
    [],
    [section(t("rank.programs"))],
    [header("#"), header(t("columns.program"), true), header(t("columns.saves")), header(t("columns.university"), true)],
    ...(savedPrograms.length
      ? savedPrograms.map((program, r): Cell[] => [
          { value: r + 1, style: zebra(r, "number", "numberAlt") },
          { value: rtl ? (program.nameAr ?? program.name) : program.name, style: zebra(r, "text", "textAlt") },
          { value: program.value, style: zebra(r, "number", "numberAlt") },
          { value: rtl ? (program.universityAr ?? program.university) : program.university, style: zebra(r, "text", "textAlt") },
        ])
      : [emptyRow()]),
  ];
  const topTerms = Math.min(10, terms.length);
  const searches: Sheet = {
    name: t("sheets.searches"),
    columns: [6, 40, 14, 40, 3],
    rows: searchRows,
    merges: bannerMerges(4),
    heights: heightsFor(searchRows),
    logo,
    charts: topTerms
      ? [
          {
            title: t("charts.topTerms"),
            direction: "bar",
            categories: `B${termFirst}:B${termFirst + topTerms - 1}`,
            series: [{ name: t("columns.searches"), values: `C${termFirst}:C${termFirst + topTerms - 1}`, color: BRAND.amber }],
            from: { col: 5, row: headerRow - 1 },
            to: { col: 12, row: headerRow + 18 },
          },
        ]
      : [],
    rightToLeft: rtl,
  };

  const file = buildWorkbook([summary, activity, universities, searches], { title: t("summaryTitle") });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  const fileUnit = { day: "daily", week: "weekly", month: "monthly", year: "yearly" }[unit];
  return { file, filename: `unilink-statistics-${fileUnit}-${today}.xlsx` };
}
