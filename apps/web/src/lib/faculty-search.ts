import type { Prisma } from "@prisma/client";

import { localized, localizedOrNull } from "@/lib/catalog";
import { scoreProgram, type MatchProfile, type MatchResult } from "@/lib/matching";
import { prisma } from "@/lib/prisma";
import {
  BUDGET_BAND_CEILING,
  PAGE_SIZE,
  type SearchFilters,
} from "@/lib/program-filters";
import { getMatchProfile } from "@/lib/program-search";

export type FacultyResult = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  university: {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string;
    type: string;
    logoUrl: string | null;
  };
  programCount: number;
  /** Distinct fields of study across the faculty's published programs. */
  disciplines: string[];
  studyLevels: string[];
  /** Cheapest and dearest annual tuition among its programs. */
  tuitionFrom: number | null;
  tuitionTo: number | null;
  currency: string;
  /** Lowest published entry requirement, the realistic bar to get in. */
  minGradePercent: number | null;
  tags: string[];
  /** Best match across the faculty's programs, so the card can rank. */
  match: MatchResult | null;
  saved: boolean;
};

export type FacultySearchPage = {
  results: FacultyResult[];
  total: number;
  pageCount: number;
  page: number;
  pageSize: number;
  /**
   * True when no faculty matched the named faculty and results were widened to
   * others teaching the same disciplines.
   */
  broadened: boolean;
};

const MAX_SCORED_ROWS = 400;

const facultyInclude = {
  university: {
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      city: true,
      cityAr: true,
      country: true,
      countryAr: true,
      type: true,
      logoUrl: true,
      publishedAt: true,
    },
  },
  programs: {
    where: { isPublished: true },
    include: {
      intakes: { orderBy: { year: "asc" } },
      englishRequirements: true,
    },
  },
} satisfies Prisma.FacultyInclude;

type FacultyRow = Prisma.FacultyGetPayload<{ include: typeof facultyInclude }>;

/**
 * Program-level constraints, applied with `some` so a faculty qualifies when
 * any of its published programs matches.
 */
function programConstraints(filters: SearchFilters): Prisma.ProgramWhereInput {
  const ceiling =
    filters.budgetBand != null
      ? BUDGET_BAND_CEILING[filters.budgetBand]
      : undefined;

  const maxTuition = [filters.maxTuition, ceiling]
    .filter((value): value is number => value != null && Number.isFinite(value))
    .sort((a, b) => a - b)[0];

  const tuition =
    filters.minTuition != null || maxTuition != null
      ? {
          ...(filters.minTuition != null ? { gte: filters.minTuition } : {}),
          ...(maxTuition != null ? { lte: maxTuition } : {}),
        }
      : null;

  return {
    isPublished: true,
    ...(filters.fields?.length ? { fieldOfStudy: { in: filters.fields } } : {}),
    ...(filters.levels?.length ? { studyLevel: { in: filters.levels } } : {}),
    ...(filters.tags?.length ? { tags: { hasEvery: filters.tags } } : {}),
    ...(tuition ? { OR: [{ tuitionFee: tuition }, { tuitionFee: null }] } : {}),
    ...(filters.intakeYear || filters.intakeSeason
      ? {
          intakes: {
            some: {
              ...(filters.intakeYear ? { year: filters.intakeYear } : {}),
              ...(filters.intakeSeason ? { season: filters.intakeSeason } : {}),
            },
          },
        }
      : {}),
  };
}

function buildFacultyWhere(
  filters: SearchFilters,
  options: { ignoreFacultyIds?: boolean } = {},
): Prisma.FacultyWhereInput {
  return {
    ...(!options.ignoreFacultyIds && filters.faculties?.length
      ? { id: { in: filters.faculties } }
      : {}),
    university: {
      publishedAt: { not: null },
      ...(filters.cities?.length ? { city: { in: filters.cities } } : {}),
      ...(filters.universities?.length
        ? { slug: { in: filters.universities } }
        : {}),
      ...(filters.universityTypes?.length
        ? { type: { in: filters.universityTypes } }
        : {}),
    },
    // A faculty with no published programs is not a useful result.
    programs: { some: programConstraints(filters) },
  };
}

/** Ids of the faculties a user has saved, for the heart on each card. */
async function getSavedFacultyIds(userId: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const saved = await prisma.savedFaculty.findMany({
    where: { userId },
    select: { facultyId: true },
  });
  return new Set(saved.map((row) => row.facultyId));
}

function mapFaculty(
  locale: string,
  row: FacultyRow,
  profile: MatchProfile | null,
  savedIds: Set<string> = new Set(),
): FacultyResult {
  const priced = row.programs
    .map((program) => (program.tuitionFee ? Number(program.tuitionFee) : null))
    .filter((value): value is number => value != null);

  const grades = row.programs
    .map((program) => program.minGradePercent)
    .filter((value): value is number => value != null);

  // The faculty's score is its strongest program: a student searching a
  // faculty cares whether anything inside it fits them.
  const scores = profile
    ? row.programs.map((program) =>
        scoreProgram(profile, {
          fieldOfStudy: program.fieldOfStudy,
          studyLevel: program.studyLevel,
          tuitionFee: program.tuitionFee ? Number(program.tuitionFee) : null,
          minGradePercent: program.minGradePercent,
          englishRequirements: program.englishRequirements.map((entry) => ({
            test: entry.test as string,
            minScore: entry.minScore,
          })),
          intakes: program.intakes.map((intake) => ({
            season: intake.season as string,
            year: intake.year,
          })),
        }),
      )
    : [];

  const best = scores.reduce<MatchResult | null>(
    (top, current) => (top == null || current.score > top.score ? current : top),
    null,
  );

  return {
    id: row.id,
    slug: row.slug,
    name: localized(locale, row.name, row.nameAr),
    description: localizedOrNull(locale, row.description, row.descriptionAr),
    imageUrl: row.imageUrl,
    university: {
      id: row.university.id,
      slug: row.university.slug,
      name: localized(locale, row.university.name, row.university.nameAr),
      city: localized(locale, row.university.city, row.university.cityAr),
      country: localized(locale, row.university.country, row.university.countryAr),
      type: row.university.type,
      logoUrl: row.university.logoUrl,
    },
    programCount: row.programs.length,
    disciplines: [...new Set(row.programs.map((p) => p.fieldOfStudy))],
    studyLevels: [...new Set(row.programs.map((p) => p.studyLevel as string))],
    tuitionFrom: priced.length ? Math.min(...priced) : null,
    tuitionTo: priced.length ? Math.max(...priced) : null,
    currency: row.programs[0]?.currency ?? "EGP",
    minGradePercent: grades.length ? Math.min(...grades) : null,
    tags: [...new Set(row.programs.flatMap((p) => p.tags as string[]))],
    match: best,
    saved: savedIds.has(row.id),
  };
}

function sortFaculties(results: FacultyResult[], sort: SearchFilters["sort"]) {
  switch (sort) {
    case "tuitionAsc":
      results.sort(
        (a, b) =>
          (a.tuitionFrom ?? Number.POSITIVE_INFINITY) -
          (b.tuitionFrom ?? Number.POSITIVE_INFINITY),
      );
      break;
    case "tuitionDesc":
      results.sort((a, b) => (b.tuitionTo ?? 0) - (a.tuitionTo ?? 0));
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      results.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
  }
}

/**
 * Faculty search.
 *
 * When the query named a specific faculty ("BUE ics") the exact faculty is
 * returned on its own. If that yields nothing, the search widens to faculties
 * teaching the same disciplines, so a student always lands on something
 * relevant rather than an empty page.
 */
export async function searchFaculties(
  locale: string,
  filters: SearchFilters,
  userId: string | null,
): Promise<FacultySearchPage> {
  const [profile, savedIds] = await Promise.all([
    getMatchProfile(userId),
    getSavedFacultyIds(userId),
  ]);

  async function run(where: Prisma.FacultyWhereInput) {
    const [rows, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        include: facultyInclude,
        orderBy: [{ name: "asc" }],
        take: MAX_SCORED_ROWS,
      }),
      prisma.faculty.count({ where }),
    ]);
    return { rows, total };
  }

  let broadened = false;
  let { rows, total } = await run(buildFacultyWhere(filters));

  // Nothing under the named faculty: widen to the disciplines it teaches.
  if (rows.length === 0 && filters.faculties?.length) {
    const named = await prisma.faculty.findMany({
      where: { id: { in: filters.faculties } },
      select: {
        programs: {
          where: { isPublished: true },
          select: { fieldOfStudy: true },
        },
      },
    });

    const disciplines = [
      ...new Set(named.flatMap((f) => f.programs.map((p) => p.fieldOfStudy))),
    ];

    if (disciplines.length > 0) {
      const widened = buildFacultyWhere(
        { ...filters, fields: disciplines },
        { ignoreFacultyIds: true },
      );
      ({ rows, total } = await run(widened));
      broadened = rows.length > 0;
    }
  }

  const mapped = rows.map((row) => mapFaculty(locale, row, profile, savedIds));
  sortFaculties(mapped, filters.sort);

  const start = (filters.page - 1) * PAGE_SIZE;

  return {
    results: mapped.slice(start, start + PAGE_SIZE),
    total,
    pageCount: Math.max(1, Math.ceil(mapped.length / PAGE_SIZE)),
    page: filters.page,
    pageSize: PAGE_SIZE,
    broadened,
  };
}

/**
 * Top faculties for the "Recommended for you" panel: best match first, capped
 * to one per university so the row is not four faculties from the same place.
 */
export async function getRecommendedFaculties(
  locale: string,
  userId: string | null,
  take = 4,
): Promise<FacultyResult[]> {
  const [profile, savedIds] = await Promise.all([
    getMatchProfile(userId),
    getSavedFacultyIds(userId),
  ]);

  const rows = await prisma.faculty.findMany({
    where: {
      university: { publishedAt: { not: null } },
      programs: {
        some: {
          isPublished: true,
          // Narrow to the student's chosen subjects when we know them.
          ...(profile?.fieldsOfStudy.length
            ? { fieldOfStudy: { in: profile.fieldsOfStudy } }
            : {}),
        },
      },
    },
    include: facultyInclude,
    take: MAX_SCORED_ROWS,
  });

  const scored = rows
    .map((row) => mapFaculty(locale, row, profile, savedIds))
    .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));

  const picked: FacultyResult[] = [];
  const usedUniversities = new Set<string>();

  for (const faculty of scored) {
    if (picked.length >= take) break;
    if (usedUniversities.has(faculty.university.id)) continue;
    usedUniversities.add(faculty.university.id);
    picked.push(faculty);
  }

  // Top up with the next best if there were not enough distinct universities.
  for (const faculty of scored) {
    if (picked.length >= take) break;
    if (picked.some((entry) => entry.id === faculty.id)) continue;
    picked.push(faculty);
  }

  return picked;
}

/** Faculties for the compare table, in the order the student picked them. */
export async function getFacultiesForCompare(
  locale: string,
  ids: string[],
  userId: string | null,
): Promise<FacultyResult[]> {
  if (ids.length === 0) return [];

  const [rows, profile, savedIds] = await Promise.all([
    prisma.faculty.findMany({
      where: { id: { in: ids }, university: { publishedAt: { not: null } } },
      include: facultyInclude,
    }),
    getMatchProfile(userId),
    getSavedFacultyIds(userId),
  ]);

  const mapped = rows.map((row) => mapFaculty(locale, row, profile, savedIds));

  return ids
    .map((id) => mapped.find((faculty) => faculty.id === id))
    .filter((faculty): faculty is FacultyResult => faculty != null);
}

/** Faculties a user has saved, most recent first. */
export async function getSavedFaculties(
  locale: string,
  userId: string,
): Promise<FacultyResult[]> {
  const saved = await prisma.savedFaculty.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { facultyId: true },
  });

  return getFacultiesForCompare(
    locale,
    saved.map((row) => row.facultyId),
    userId,
  );
}

/** A single faculty with everything its profile page renders. */
export async function getFacultyDetail(
  locale: string,
  facultyId: string,
  userId: string | null = null,
) {
  const [row, savedIds] = await Promise.all([
    prisma.faculty.findFirst({
      where: { id: facultyId, university: { publishedAt: { not: null } } },
      include: facultyInclude,
    }),
    getSavedFacultyIds(userId),
  ]);

  if (!row) return null;
  return mapFaculty(locale, row, null, savedIds);
}
