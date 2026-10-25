// The analytics sections of /admin/statistics: how the site is doing in the
// chosen period against the period before it, how far users get, who they
// are, and which university profiles are doing well or need attention.
// Everything is read from what the site already records (daily profile
// views, search logs, saves, ratings, accounts and onboarding answers).

import { Prisma } from "@prisma/client";

import { UNIVERSITY_MISSING_CONTENT, catalogueChecks } from "@/lib/admin-catalogue";
import { prisma } from "@/lib/prisma";

const DAY_MS = 86_400_000;
const TZ = "Africa/Cairo";

/** The chosen window and the equally long one before it. "All time" has no previous window. */
export function windows(days: number | null) {
  const now = new Date();
  if (days === null) return { since: new Date(0), previousSince: null, until: now };
  const since = new Date(now.getTime() - days * DAY_MS);
  since.setUTCHours(0, 0, 0, 0);
  const previousSince = new Date(since.getTime() - days * DAY_MS);
  return { since, previousSince, until: now };
}

export type Kpi = { value: number; previous: number | null };

/**
 * Headline figures for the window, each with the window before it. One SQL
 * round trip: a batched transaction runs its queries one after another, and
 * against a remote database that alone took seconds.
 */
export async function siteKpis(days: number | null) {
  const { since, previousSince } = windows(days);
  const from = previousSince ?? since;
  const [row] = await prisma.$queryRaw<Record<string, bigint | number | null>[]>`
    SELECT
      (SELECT coalesce(sum(views), 0) FROM "UniversityViewDaily" WHERE "day" >= ${since}::date) AS views,
      (SELECT coalesce(sum(views), 0) FROM "UniversityViewDaily" WHERE "day" >= ${from}::date AND "day" < ${since}::date) AS views_prev,
      s.searches, s.searches_prev, s.found, s.found_prev, s.searchers, s.searchers_prev,
      (SELECT count(*) FILTER (WHERE "createdAt" >= ${since}) FROM "User" WHERE role IN ('STUDENT', 'PARENT')) AS signups,
      (SELECT count(*) FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since}) FROM "User" WHERE role IN ('STUDENT', 'PARENT')) AS signups_prev,
      v.saves, v.saves_prev,
      (SELECT count(*) FILTER (WHERE "createdAt" >= ${since}) FROM "UniversityRating") AS ratings,
      (SELECT count(*) FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since}) FROM "UniversityRating") AS ratings_prev
    FROM (
      SELECT count(*) FILTER (WHERE "createdAt" >= ${since}) AS searches,
             count(*) FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since}) AS searches_prev,
             count(*) FILTER (WHERE "createdAt" >= ${since} AND "resultCount" > 0) AS found,
             count(*) FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since} AND "resultCount" > 0) AS found_prev,
             count(DISTINCT "userId") FILTER (WHERE "createdAt" >= ${since}) AS searchers,
             count(DISTINCT "userId") FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since}) AS searchers_prev
      FROM "SearchLog" WHERE "createdAt" >= ${from}
    ) s, (
      SELECT count(*) FILTER (WHERE "createdAt" >= ${since}) AS saves,
             count(*) FILTER (WHERE "createdAt" >= ${from} AND "createdAt" < ${since}) AS saves_prev
      FROM (
        SELECT "createdAt" FROM "SavedUniversity" WHERE "createdAt" >= ${from}
        UNION ALL SELECT "createdAt" FROM "SavedProgram" WHERE "createdAt" >= ${from}
        UNION ALL SELECT "createdAt" FROM "SavedFaculty" WHERE "createdAt" >= ${from}
      ) all_saves
    ) v`;
  const n = (key: string) => Number(row?.[key] ?? 0);
  const kpi = (key: string): Kpi => ({ value: n(key), previous: previousSince ? n(`${key}_prev`) : null });
  const rate = (found: number, searches: number) => (searches ? found / searches : 0);
  return {
    views: kpi("views"),
    searches: kpi("searches"),
    successRate: { value: rate(n("found"), n("searches")), previous: previousSince ? rate(n("found_prev"), n("searches_prev")) : null },
    signups: kpi("signups"),
    saves: kpi("saves"),
    ratings: kpi("ratings"),
    searchers: kpi("searchers"),
  };
}

export type ActivityUnit = "day" | "week" | "month";
export type ActivityMetric = "views" | "searches" | "signups" | "saves";
export type ActivityPoint = { bucket: string } & Record<ActivityMetric, number>;

/** One bar per day (up to 30 days), week (90 days) or month (all time). */
export function activityUnit(days: number | null): ActivityUnit {
  return days === null ? "month" : days > 31 ? "week" : "day";
}

function bucketsFor(unit: ActivityUnit, since: Date, until: Date) {
  const keys: string[] = [];
  const cairo = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
  const start = new Date(`${cairo(since)}T00:00:00Z`);
  const end = new Date(`${cairo(until)}T00:00:00Z`);
  if (unit === "day") {
    for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) keys.push(new Date(t).toISOString().slice(0, 10));
  } else if (unit === "week") {
    const monday = new Date(start.getTime() - ((start.getUTCDay() + 6) % 7) * DAY_MS);
    for (let t = monday.getTime(); t <= end.getTime(); t += 7 * DAY_MS) keys.push(new Date(t).toISOString().slice(0, 10));
  } else {
    for (let y = start.getUTCFullYear(), m = start.getUTCMonth(); y < end.getUTCFullYear() || (y === end.getUTCFullYear() && m <= end.getUTCMonth()); m === 11 ? (y++, (m = 0)) : m++) {
      keys.push(new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10));
    }
  }
  return keys;
}

export async function activitySeries(days: number | null): Promise<{ unit: ActivityUnit; points: ActivityPoint[] }> {
  const unit = activityUnit(days);
  let { since } = windows(days);
  const { until } = windows(days);
  if (days === null) {
    // All time starts at the first recorded activity, not 1970.
    const [first] = await prisma.$queryRaw<{ first: Date | null }[]>`
      SELECT least((SELECT min("day") FROM "UniversityViewDaily"), (SELECT min("createdAt") FROM "SearchLog"),
                   (SELECT min("createdAt") FROM "User" WHERE role IN ('STUDENT', 'PARENT'))) AS first`;
    since = first?.first ?? new Date(until.getTime() - 30 * DAY_MS);
  }
  const local = (column: string) => Prisma.raw(`("${column}" AT TIME ZONE 'UTC' AT TIME ZONE '${TZ}')`);
  const [views, searches, signups, saves] = await Promise.all([
    prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
      SELECT to_char(date_trunc(${unit}, "day"), 'YYYY-MM-DD') AS bucket, sum(views) AS value
      FROM "UniversityViewDaily" WHERE "day" >= ${since}::date GROUP BY 1`,
    prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
      SELECT to_char(date_trunc(${unit}, ${local("createdAt")}), 'YYYY-MM-DD') AS bucket, count(*) AS value
      FROM "SearchLog" WHERE "createdAt" >= ${since} GROUP BY 1`,
    prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
      SELECT to_char(date_trunc(${unit}, ${local("createdAt")}), 'YYYY-MM-DD') AS bucket, count(*) AS value
      FROM "User" WHERE role IN ('STUDENT', 'PARENT') AND "createdAt" >= ${since} GROUP BY 1`,
    prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
      SELECT to_char(date_trunc(${unit}, ${local("createdAt")}), 'YYYY-MM-DD') AS bucket, count(*) AS value FROM (
        SELECT "createdAt" FROM "SavedUniversity" WHERE "createdAt" >= ${since}
        UNION ALL SELECT "createdAt" FROM "SavedProgram" WHERE "createdAt" >= ${since}
        UNION ALL SELECT "createdAt" FROM "SavedFaculty" WHERE "createdAt" >= ${since}
      ) saves GROUP BY 1`,
  ]);
  const map = (rows: { bucket: string; value: bigint }[]) => new Map(rows.map((row) => [row.bucket, Number(row.value)]));
  const byMetric = { views: map(views), searches: map(searches), signups: map(signups), saves: map(saves) };
  const points = bucketsFor(unit, since, until).map((bucket) => ({
    bucket,
    views: byMetric.views.get(bucket) ?? 0,
    searches: byMetric.searches.get(bucket) ?? 0,
    signups: byMetric.signups.get(bucket) ?? 0,
    saves: byMetric.saves.get(bucket) ?? 0,
  }));
  return { unit, points };
}

/** How far registered students and parents get, all time. One round trip. */
export async function userFunnel() {
  const since30 = new Date(Date.now() - 30 * DAY_MS);
  const [row] = await prisma.$queryRaw<Record<string, bigint>[]>`
    SELECT count(*) AS registered,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "StudentProfile" p WHERE p."userId" = u.id)) AS profile,
      count(*) FILTER (WHERE u."lastLoginAt" >= ${since30}) AS active,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "SearchLog" l WHERE l."userId" = u.id)) AS searched,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "SavedUniversity" x WHERE x."userId" = u.id)
                          OR EXISTS (SELECT 1 FROM "SavedProgram" x WHERE x."userId" = u.id)
                          OR EXISTS (SELECT 1 FROM "SavedFaculty" x WHERE x."userId" = u.id)) AS saved,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "UniversityRating" r WHERE r."userId" = u.id)) AS rated
    FROM "User" u WHERE u.role IN ('STUDENT', 'PARENT')`;
  const n = (key: string) => Number(row?.[key] ?? 0);
  return { registered: n("registered"), profile: n("profile"), active: n("active"), searched: n("searched"), saved: n("saved"), rated: n("rated") };
}

/** Who the students are, from their onboarding answers. */
export async function studentBreakdowns() {
  const [systems, budgets, fields, searchLanguage] = await Promise.all([
    prisma.studentProfile.groupBy({ by: ["highSchoolSystem"], _count: { _all: true } }),
    prisma.studentProfile.groupBy({ by: ["budgetBand"], _count: { _all: true } }),
    prisma.$queryRaw<{ field: string; value: bigint }[]>`
      SELECT field, count(*) AS value FROM "StudentProfile", unnest("fieldsOfStudy") AS field
      GROUP BY 1 ORDER BY 2 DESC LIMIT 8`,
    prisma.searchLog.groupBy({ by: ["locale"], _count: { _all: true } }),
  ]);
  return {
    systems: systems.map((row) => ({ key: row.highSchoolSystem, value: row._count._all })).sort((a, b) => b.value - a.value),
    budgets: budgets.map((row) => ({ key: row.budgetBand, value: row._count._all })).sort((a, b) => b.value - a.value),
    fields: fields.map((row) => ({ key: row.field, value: Number(row.value) })),
    searchLanguage: searchLanguage.map((row) => ({ key: row.locale ?? "unknown", value: row._count._all })).sort((a, b) => b.value - a.value),
  };
}

export type Health = "well" | "attention" | "steady";
export type AttentionReason = "noViews" | "falling" | "noSaves" | "lowRating" | "incomplete";
export type WellReason = "rising" | "popular" | "loved";

export type UniversityPerformance = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  logoUrl: string | null;
  views: number;
  previousViews: number | null;
  saves: number;
  searches: number;
  rating: number | null;
  ratingCount: number;
  missing: number;
  /** Saves per 100 profile views in the window. */
  saveRate: number | null;
  health: Health;
  reasons: (AttentionReason | WellReason)[];
};

/** Every published university, scored for the window. */
export async function universityPerformance(days: number | null): Promise<UniversityPerformance[]> {
  const { since, previousSince } = windows(days);
  const [universities, views, previousViews, saves, searches, ratings, incomplete] = await Promise.all([
    prisma.university.findMany({
      where: { publishedAt: { not: null } },
      select: { id: true, slug: true, name: true, nameAr: true, logoUrl: true, coverImageUrl: true, description: true, descriptionAr: true },
    }),
    prisma.universityViewDaily.groupBy({ by: ["universityId"], where: { day: { gte: since } }, _sum: { views: true } }),
    previousSince
      ? prisma.universityViewDaily.groupBy({ by: ["universityId"], where: { day: { gte: previousSince, lt: since } }, _sum: { views: true } })
      : Promise.resolve(null),
    prisma.savedUniversity.groupBy({ by: ["universityId"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    prisma.searchLog.groupBy({ by: ["universityId"], where: { createdAt: { gte: since }, universityId: { not: null } }, _count: { _all: true } }),
    prisma.universityRating.groupBy({ by: ["universityId"], _avg: { stars: true }, _count: { _all: true } }),
    prisma.university.findMany({ where: { publishedAt: { not: null }, ...UNIVERSITY_MISSING_CONTENT }, select: { id: true } }),
  ]);
  const sum = (rows: { universityId: string; _sum: { views: number | null } }[] | null) =>
    rows ? new Map(rows.map((row) => [row.universityId, row._sum.views ?? 0])) : null;
  const viewMap = sum(views)!;
  const previousMap = sum(previousViews);
  const saveMap = new Map(saves.map((row) => [row.universityId, row._count._all]));
  const searchMap = new Map(searches.map((row) => [row.universityId!, row._count._all]));
  const ratingMap = new Map(ratings.map((row) => [row.universityId, { avg: row._avg.stars, count: row._count._all }]));
  const incompleteIds = new Set(incomplete.map((row) => row.id));

  // "Popular" means the top fifth by views among universities that had any.
  const ranked = [...viewMap.values()].filter((value) => value > 0).sort((a, b) => b - a);
  const popularCut = ranked.length ? ranked[Math.max(0, Math.ceil(ranked.length / 5) - 1)] : Infinity;

  return universities
    .map((university): UniversityPerformance => {
      const v = viewMap.get(university.id) ?? 0;
      const before = previousMap ? (previousMap.get(university.id) ?? 0) : null;
      const s = saveMap.get(university.id) ?? 0;
      const rating = ratingMap.get(university.id);
      const missing = incompleteIds.has(university.id)
        ? catalogueChecks({
            nameAr: university.nameAr,
            description: university.description,
            descriptionAr: university.descriptionAr,
            logoUrl: university.logoUrl,
            coverImageUrl: university.coverImageUrl,
          }).filter((check) => !check.present).length
        : 0;
      const attention: AttentionReason[] = [];
      const well: WellReason[] = [];
      if (v === 0) attention.push("noViews");
      if (before !== null && before >= 10 && v <= before * 0.7) attention.push("falling");
      if (v >= 30 && s === 0) attention.push("noSaves");
      if (rating && rating.count >= 2 && (rating.avg ?? 5) < 3) attention.push("lowRating");
      if (missing >= 2) attention.push("incomplete");
      if (before !== null && v >= 10 && v >= before * 1.3) well.push("rising");
      if (v > 0 && v >= popularCut && s > 0) well.push("popular");
      if (rating && rating.count >= 2 && (rating.avg ?? 0) >= 4.5) well.push("loved");
      return {
        id: university.id,
        slug: university.slug,
        name: university.name,
        nameAr: university.nameAr,
        logoUrl: university.logoUrl,
        views: v,
        previousViews: before,
        saves: s,
        searches: searchMap.get(university.id) ?? 0,
        rating: rating?.avg ? Math.round(rating.avg * 10) / 10 : null,
        ratingCount: rating?.count ?? 0,
        missing,
        saveRate: v ? Math.round((s / v) * 1000) / 10 : null,
        health: attention.length ? "attention" : well.length ? "well" : "steady",
        reasons: attention.length ? attention : well,
      };
    })
    .sort((a, b) => b.views - a.views || b.saves - a.saves || a.name.localeCompare(b.name));
}
