// Queries behind /admin/statistics. Buckets are in Cairo time, since that is
// where the students are: a sign-up at 01:00 on Saturday belongs to Saturday.

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const TZ = "Africa/Cairo";
const DAY_MS = 86_400_000;

export type Granularity = "day" | "week" | "month" | "year";
export type Point = { bucket: string; value: number };

const SPAN: Record<Granularity, number> = { day: 30, week: 12, month: 12, year: 5 };

/** "2026-10-16" for today in Cairo. */
function cairoDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** The bucket keys a series should have, oldest first, ending with the current one. */
function bucketKeys(unit: Granularity): string[] {
  const [y, m, d] = cairoDate().split("-").map(Number);
  const today = Date.UTC(y, m - 1, d);
  const keys: string[] = [];
  for (let i = SPAN[unit] - 1; i >= 0; i--) {
    if (unit === "day") keys.push(new Date(today - i * DAY_MS).toISOString().slice(0, 10));
    else if (unit === "week") {
      const weekday = (new Date(today).getUTCDay() + 6) % 7; // Monday = 0, matching date_trunc
      keys.push(new Date(today - (weekday + i * 7) * DAY_MS).toISOString().slice(0, 10));
    } else if (unit === "month") keys.push(new Date(Date.UTC(y, m - 1 - i, 1)).toISOString().slice(0, 10));
    else keys.push(`${y - i}-01-01`);
  }
  return keys;
}

/** Registrations (students and parents) per bucket, gaps filled with 0. */
export async function registrationSeries(unit: Granularity): Promise<Point[]> {
  const keys = bucketKeys(unit);
  const rows = await prisma.$queryRaw<{ bucket: string; value: bigint }[]>`
    SELECT to_char(date_trunc(${unit}, "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TZ}), 'YYYY-MM-DD') AS bucket,
           count(*) AS value
    FROM "User"
    WHERE role IN ('STUDENT', 'PARENT')
      AND ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TZ})::date >= ${keys[0]}::date
    GROUP BY 1`;
  const byKey = new Map(rows.map((row) => [row.bucket, Number(row.value)]));
  return keys.map((bucket) => ({ bucket, value: byKey.get(bucket) ?? 0 }));
}

/** Count of sign-ups in [from, to) Cairo days back from today, e.g. (0,1) = today. */
async function registrationsBetween(daysBackStart: number, daysBackEnd: number) {
  const [y, m, d] = cairoDate().split("-").map(Number);
  const today = Date.UTC(y, m - 1, d);
  const from = new Date(today - daysBackStart * DAY_MS).toISOString().slice(0, 10);
  const to = new Date(today - daysBackEnd * DAY_MS + DAY_MS).toISOString().slice(0, 10);
  const [row] = await prisma.$queryRaw<{ value: bigint }[]>`
    SELECT count(*) AS value FROM "User"
    WHERE role IN ('STUDENT', 'PARENT')
      AND ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TZ})::date >= ${from}::date
      AND ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TZ})::date < ${to}::date`;
  return Number(row?.value ?? 0);
}

/** Today / 7 / 30 / 365 days, each with the period before it for a delta. */
export async function registrationTotals() {
  const [today, yesterday, week, prevWeek, month, prevMonth, year, prevYear] = await Promise.all([
    registrationsBetween(0, 0),
    registrationsBetween(1, 1),
    registrationsBetween(6, 0),
    registrationsBetween(13, 7),
    registrationsBetween(29, 0),
    registrationsBetween(59, 30),
    registrationsBetween(364, 0),
    registrationsBetween(729, 365),
  ]);
  return {
    day: { value: today, previous: yesterday },
    week: { value: week, previous: prevWeek },
    month: { value: month, previous: prevMonth },
    year: { value: year, previous: prevYear },
  };
}

/** Total profile views per day for the last 30 days. */
export async function viewSeries(): Promise<Point[]> {
  const keys = bucketKeys("day");
  const rows = await prisma.universityViewDaily.groupBy({
    by: ["day"],
    where: { day: { gte: new Date(`${keys[0]}T00:00:00Z`) } },
    _sum: { views: true },
  });
  const byKey = new Map(rows.map((row) => [row.day.toISOString().slice(0, 10), row._sum.views ?? 0]));
  return keys.map((bucket) => ({ bucket, value: byKey.get(bucket) ?? 0 }));
}

export type RankedUniversity = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  logoUrl: string | null;
  value: number;
  /** Trending only: views in the week before. */
  previous?: number;
  /** Ratings only. */
  count?: number;
};

async function withUniversities(rows: { id: string; value: number; previous?: number; count?: number }[]) {
  const universities = await prisma.university.findMany({
    where: { id: { in: rows.map((row) => row.id) } },
    select: { id: true, slug: true, name: true, nameAr: true, logoUrl: true },
  });
  const byId = new Map(universities.map((university) => [university.id, university]));
  return rows.flatMap((row) => {
    const university = byId.get(row.id);
    return university ? [{ ...university, ...row }] : [];
  });
}

export function sinceDays(days: number | null) {
  if (days === null) return null;
  const date = new Date(Date.now() - days * DAY_MS);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/** Most viewed university profiles in the period (null = all time). */
export async function topViewed(days: number | null, take = 8): Promise<RankedUniversity[]> {
  if (days === null) {
    const rows = await prisma.university.findMany({
      where: { publishedAt: { not: null }, viewCount: { gt: 0 } },
      orderBy: { viewCount: "desc" },
      take,
      select: { id: true, viewCount: true },
    });
    return withUniversities(rows.map((row) => ({ id: row.id, value: row.viewCount })));
  }
  const rows = await prisma.universityViewDaily.groupBy({
    by: ["universityId"],
    where: { day: { gte: sinceDays(days)! } },
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
    take,
  });
  return withUniversities(rows.map((row) => ({ id: row.universityId, value: row._sum.views ?? 0 })));
}

/**
 * Trending: views in the last 7 days against the 7 before, ranked by the
 * increase. A profile needs a few views to qualify, so one visit to an
 * unvisited page doesn't read as "+100%".
 */
export async function trending(take = 8): Promise<RankedUniversity[]> {
  const [current, previous] = await Promise.all([
    prisma.universityViewDaily.groupBy({ by: ["universityId"], where: { day: { gte: sinceDays(7)! } }, _sum: { views: true } }),
    prisma.universityViewDaily.groupBy({
      by: ["universityId"],
      where: { day: { gte: sinceDays(14)!, lt: sinceDays(7)! } },
      _sum: { views: true },
    }),
  ]);
  const before = new Map(previous.map((row) => [row.universityId, row._sum.views ?? 0]));
  const rows = current
    .map((row) => ({ id: row.universityId, value: row._sum.views ?? 0, previous: before.get(row.universityId) ?? 0 }))
    .filter((row) => row.value >= 3 && row.value > row.previous)
    .sort((a, b) => b.value - b.previous - (a.value - a.previous))
    .slice(0, take);
  return withUniversities(rows);
}

/** Universities searched for (or reached from a search) most often. */
export async function mostSearched(days: number | null, take = 8): Promise<RankedUniversity[]> {
  const since = sinceDays(days);
  const rows = await prisma.searchLog.groupBy({
    by: ["universityId"],
    where: { universityId: { not: null }, ...(since ? { createdAt: { gte: since } } : {}) },
    _count: { _all: true },
    orderBy: { _count: { universityId: "desc" } },
    take,
  });
  return withUniversities(rows.map((row) => ({ id: row.universityId!, value: row._count._all })));
}

export type SearchTerm = { term: string; value: number; zero: number };

/** Most frequent search terms (case-insensitive) and how many found nothing. */
export async function topSearchTerms(days: number | null, take = 10): Promise<SearchTerm[]> {
  const since = sinceDays(days) ?? new Date(0);
  const rows = await prisma.$queryRaw<{ term: string; value: bigint; zero: bigint }[]>`
    SELECT lower(query) AS term, count(*) AS value, count(*) FILTER (WHERE "resultCount" = 0) AS zero
    FROM "SearchLog" WHERE "createdAt" >= ${since}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${take}`;
  return rows.map((row) => ({ term: row.term, value: Number(row.value), zero: Number(row.zero) }));
}

/** Searches that returned nothing: content the catalogue is missing. */
export async function zeroResultTerms(days: number | null, take = 8): Promise<SearchTerm[]> {
  const since = sinceDays(days) ?? new Date(0);
  const rows = await prisma.$queryRaw<{ term: string; value: bigint }[]>`
    SELECT lower(query) AS term, count(*) AS value
    FROM "SearchLog" WHERE "createdAt" >= ${since} AND "resultCount" = 0
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${take}`;
  return rows.map((row) => ({ term: row.term, value: Number(row.value), zero: Number(row.value) }));
}

export async function searchVolume(days: number | null) {
  const since = sinceDays(days);
  return prisma.searchLog.count({ where: since ? { createdAt: { gte: since } } : {} });
}

/** Most saved universities (all time). */
export async function mostSaved(take = 8): Promise<RankedUniversity[]> {
  const rows = await prisma.savedUniversity.groupBy({
    by: ["universityId"],
    _count: { _all: true },
    orderBy: { _count: { universityId: "desc" } },
    take,
  });
  return withUniversities(rows.map((row) => ({ id: row.universityId, value: row._count._all })));
}

/** Best-rated universities with at least two ratings. */
export async function topRated(take = 8): Promise<RankedUniversity[]> {
  const rows = await prisma.universityRating.groupBy({
    by: ["universityId"],
    _avg: { stars: true },
    _count: { _all: true },
    having: { universityId: { _count: { gte: 2 } } },
    orderBy: { _avg: { stars: "desc" } },
    take,
  });
  return withUniversities(
    rows.map((row) => ({ id: row.universityId, value: Math.round((row._avg.stars ?? 0) * 10) / 10, count: row._count._all })),
  );
}

export type RankedProgram = { id: string; name: string; nameAr: string | null; university: string; universityAr: string | null; value: number };

export async function mostSavedPrograms(take = 8): Promise<RankedProgram[]> {
  const rows = await prisma.savedProgram.groupBy({
    by: ["programId"],
    _count: { _all: true },
    orderBy: { _count: { programId: "desc" } },
    take,
  });
  const programs = await prisma.program.findMany({
    where: { id: { in: rows.map((row) => row.programId) } },
    select: { id: true, name: true, nameAr: true, university: { select: { name: true, nameAr: true } } },
  });
  const byId = new Map(programs.map((program) => [program.id, program]));
  return rows.flatMap((row) => {
    const program = byId.get(row.programId);
    return program
      ? [{ id: program.id, name: program.name, nameAr: program.nameAr, university: program.university.name, universityAr: program.university.nameAr, value: row._count._all }]
      : [];
  });
}

/** Headline counts for the top of the page. */
export async function audienceTotals() {
  const since7 = sinceDays(7)!;
  const since30 = sinceDays(30)!;
  const [students, parents, withProfile, active7, active30, applications, savedTotal, ratings] = await prisma.$transaction([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "PARENT" } }),
    prisma.studentProfile.count(),
    prisma.user.count({ where: { role: { in: ["STUDENT", "PARENT"] }, lastLoginAt: { gte: since7 } } }),
    prisma.user.count({ where: { role: { in: ["STUDENT", "PARENT"] }, lastLoginAt: { gte: since30 } } }),
    prisma.application.count(),
    prisma.savedUniversity.count(),
    prisma.universityRating.count(),
  ]);
  return { students, parents, withProfile, active7, active30, applications, savedTotal, ratings };
}

/** Catalogue gaps worth fixing: shown as a checklist with links. */
export async function catalogueGaps() {
  const published = { publishedAt: { not: null } } satisfies Prisma.UniversityWhereInput;
  const [noCover, noGallery, noDescription, noLogo, programsNoFee, programsTotal] = await prisma.$transaction([
    prisma.university.count({ where: { ...published, coverImageUrl: null } }),
    prisma.university.count({ where: { ...published, images: { none: {} } } }),
    prisma.university.count({ where: { ...published, OR: [{ description: null }, { descriptionAr: null }] } }),
    prisma.university.count({ where: { ...published, logoUrl: null } }),
    prisma.program.count({ where: { isPublished: true, tuitionFee: null } }),
    prisma.program.count({ where: { isPublished: true } }),
  ]);
  return { noCover, noGallery, noDescription, noLogo, programsNoFee, programsTotal };
}
