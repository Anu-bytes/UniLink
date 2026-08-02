import type { Prisma } from "@prisma/client";

import { localized, localizedOrNull } from "@/lib/catalog";
import { scoreProgram, type MatchProfile, type MatchResult } from "@/lib/matching";
import { prisma } from "@/lib/prisma";
import {
  BUDGET_BAND_CEILING,
  PAGE_SIZE,
  type SearchFilters,
} from "@/lib/program-filters";

export type ProgramIntakeData = {
  season: string;
  year: number;
  applicationDeadline: string | null;
};

export type ProgramResult = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  studyLevel: string;
  fieldOfStudy: string;
  durationMonths: number | null;
  durationLabel: string | null;
  tuitionFee: number | null;
  tuitionPeriod: string;
  currency: string;
  applicationFee: number | null;
  applicationFeeWaived: boolean;
  minGradePercent: number | null;
  coopAvailable: boolean;
  tags: string[];
  university: {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string;
    type: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
  };
  facultyName: string | null;
  intakes: ProgramIntakeData[];
  englishRequirements: { test: string; minScore: number }[];
  match: MatchResult | null;
  saved: boolean;
  applied: boolean;
};

export type SearchResultPage = {
  results: ProgramResult[];
  /** True number of matching programs, shown as the result count. */
  total: number;
  /** Pages actually reachable, which is capped by MAX_SCORED_ROWS. */
  pageCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Scoring happens in the application layer, so a query has to load its matching
// rows before it can sort by match. The catalogue is small enough that this is
// cheap; the cap stops a pathological filter set from loading everything.
const MAX_SCORED_ROWS = 600;

const programInclude = {
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
      coverImageUrl: true,
    },
  },
  faculty: { select: { name: true, nameAr: true } },
  intakes: { orderBy: { year: "asc" } },
  englishRequirements: true,
} satisfies Prisma.ProgramInclude;

type ProgramRow = Prisma.ProgramGetPayload<{ include: typeof programInclude }>;

export function buildProgramWhere(filters: SearchFilters): Prisma.ProgramWhereInput {
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
    ...(filters.fields?.length ? { fieldOfStudy: { in: filters.fields } } : {}),
    ...(filters.levels?.length ? { studyLevel: { in: filters.levels } } : {}),
    // Every selected tag must be present, matching the chip toggles.
    ...(filters.tags?.length ? { tags: { hasEvery: filters.tags } } : {}),
    // Unpriced programs stay in the results rather than being filtered out by
    // a range they cannot be compared against.
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

function mapProgram(
  locale: string,
  row: ProgramRow,
  profile: MatchProfile | null,
  savedIds: Set<string>,
  appliedIds: Set<string>,
): ProgramResult {
  const tuitionFee = row.tuitionFee ? Number(row.tuitionFee) : null;
  const englishRequirements = row.englishRequirements.map((requirement) => ({
    test: requirement.test as string,
    minScore: requirement.minScore,
  }));
  const intakes = row.intakes.map((intake) => ({
    season: intake.season as string,
    year: intake.year,
    applicationDeadline: intake.applicationDeadline?.toISOString() ?? null,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: localized(locale, row.name, row.nameAr),
    description: localizedOrNull(locale, row.description, row.descriptionAr),
    studyLevel: row.studyLevel,
    fieldOfStudy: row.fieldOfStudy,
    durationMonths: row.durationMonths,
    durationLabel: localizedOrNull(
      locale,
      row.durationLabel,
      row.durationLabelAr,
    ),
    tuitionFee,
    tuitionPeriod: row.tuitionPeriod,
    currency: row.currency,
    applicationFee: row.applicationFee ? Number(row.applicationFee) : null,
    applicationFeeWaived: row.applicationFeeWaived,
    minGradePercent: row.minGradePercent,
    coopAvailable: row.coopAvailable,
    tags: row.tags,
    university: {
      id: row.university.id,
      slug: row.university.slug,
      name: localized(locale, row.university.name, row.university.nameAr),
      city: localized(locale, row.university.city, row.university.cityAr),
      country: localized(locale, row.university.country, row.university.countryAr),
      type: row.university.type,
      logoUrl: row.university.logoUrl,
      coverImageUrl: row.university.coverImageUrl,
    },
    facultyName: row.faculty
      ? localized(locale, row.faculty.name, row.faculty.nameAr)
      : null,
    intakes,
    englishRequirements,
    match: profile
      ? scoreProgram(profile, {
          fieldOfStudy: row.fieldOfStudy,
          studyLevel: row.studyLevel,
          tuitionFee,
          minGradePercent: row.minGradePercent,
          englishRequirements,
          intakes,
        })
      : null,
    saved: savedIds.has(row.id),
    applied: appliedIds.has(row.id),
  };
}

/** Saved + applied program ids for a user, in one round trip each. */
export async function getUserProgramState(userId: string | null) {
  if (!userId) return { savedIds: new Set<string>(), appliedIds: new Set<string>() };

  const [saved, applications] = await Promise.all([
    prisma.savedProgram.findMany({
      where: { userId },
      select: { programId: true },
    }),
    prisma.application.findMany({
      where: { userId },
      select: { programId: true },
    }),
  ]);

  return {
    savedIds: new Set(saved.map((row) => row.programId)),
    appliedIds: new Set(applications.map((row) => row.programId)),
  };
}

export async function getMatchProfile(
  userId: string | null,
): Promise<MatchProfile | null> {
  if (!userId) return null;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: {
      fieldsOfStudy: true,
      studyLevel: true,
      budgetBand: true,
      gradeValue: true,
      englishTest: true,
      englishScore: true,
      intakeSeason: true,
      intakeYear: true,
    },
  });

  if (!profile) return null;

  return {
    fieldsOfStudy: profile.fieldsOfStudy,
    studyLevel: profile.studyLevel,
    budgetBand: profile.budgetBand,
    gradeValue: profile.gradeValue,
    englishTest: profile.englishTest,
    englishScore: profile.englishScore,
    intakeSeason: profile.intakeSeason,
    intakeYear: profile.intakeYear,
  };
}

export async function searchPrograms(
  locale: string,
  filters: SearchFilters,
  userId: string | null,
): Promise<SearchResultPage> {
  const where = buildProgramWhere(filters);

  const [rows, total, profile, state] = await Promise.all([
    prisma.program.findMany({
      where,
      include: programInclude,
      orderBy: [{ name: "asc" }],
      take: MAX_SCORED_ROWS,
    }),
    prisma.program.count({ where }),
    getMatchProfile(userId),
    getUserProgramState(userId),
  ]);

  const mapped = rows.map((row) =>
    mapProgram(locale, row, profile, state.savedIds, state.appliedIds),
  );

  sortResults(mapped, filters.sort);

  const start = (filters.page - 1) * PAGE_SIZE;
  const results = mapped.slice(start, start + PAGE_SIZE);

  return {
    results,
    total,
    pageCount: Math.max(1, Math.ceil(mapped.length / PAGE_SIZE)),
    page: filters.page,
    pageSize: PAGE_SIZE,
    hasMore: start + results.length < mapped.length,
  };
}

function sortResults(results: ProgramResult[], sort: SearchFilters["sort"]) {
  switch (sort) {
    case "tuitionAsc":
      results.sort(
        (a, b) =>
          (a.tuitionFee ?? Number.POSITIVE_INFINITY) -
          (b.tuitionFee ?? Number.POSITIVE_INFINITY),
      );
      break;
    case "tuitionDesc":
      results.sort((a, b) => (b.tuitionFee ?? 0) - (a.tuitionFee ?? 0));
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      results.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
  }
}

/**
 * Top programs for the "Recommended for you" panel: highest match first,
 * capped to one program per university so the row is not four degrees from the
 * same place.
 */
export async function getRecommendedPrograms(
  locale: string,
  userId: string | null,
  take = 4,
): Promise<ProgramResult[]> {
  const profile = await getMatchProfile(userId);
  const state = await getUserProgramState(userId);

  const rows = await prisma.program.findMany({
    where: {
      isPublished: true,
      university: { publishedAt: { not: null } },
      ...(profile?.fieldsOfStudy.length
        ? { fieldOfStudy: { in: profile.fieldsOfStudy } }
        : {}),
    },
    include: programInclude,
    take: MAX_SCORED_ROWS,
  });

  const scored = rows
    .map((row) => mapProgram(locale, row, profile, state.savedIds, state.appliedIds))
    .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));

  const picked: ProgramResult[] = [];
  const usedUniversities = new Set<string>();

  for (const result of scored) {
    if (picked.length >= take) break;
    if (usedUniversities.has(result.university.id)) continue;
    usedUniversities.add(result.university.id);
    picked.push(result);
  }

  // If there were not enough distinct universities, top up with the next best.
  for (const result of scored) {
    if (picked.length >= take) break;
    if (picked.some((entry) => entry.id === result.id)) continue;
    picked.push(result);
  }

  return picked;
}

export async function getProgramsForCompare(
  locale: string,
  ids: string[],
  userId: string | null,
): Promise<ProgramResult[]> {
  if (ids.length === 0) return [];

  const [rows, profile, state] = await Promise.all([
    prisma.program.findMany({
      where: { id: { in: ids }, isPublished: true },
      include: programInclude,
    }),
    getMatchProfile(userId),
    getUserProgramState(userId),
  ]);

  const mapped = rows.map((row) =>
    mapProgram(locale, row, profile, state.savedIds, state.appliedIds),
  );

  // Preserve the order the user selected them in.
  return ids
    .map((id) => mapped.find((result) => result.id === id))
    .filter((result): result is ProgramResult => result != null);
}

export async function getSavedPrograms(
  locale: string,
  userId: string,
): Promise<ProgramResult[]> {
  const saved = await prisma.savedProgram.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { programId: true },
  });

  return getProgramsForCompare(
    locale,
    saved.map((row) => row.programId),
    userId,
  );
}

export type ApplicationListItem = {
  id: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  program: ProgramResult;
};

export async function getApplications(
  locale: string,
  userId: string,
): Promise<ApplicationListItem[]> {
  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { program: { include: programInclude } },
  });

  const profile = await getMatchProfile(userId);
  const state = await getUserProgramState(userId);

  return applications.map((application) => ({
    id: application.id,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
    submittedAt: application.submittedAt?.toISOString() ?? null,
    program: mapProgram(
      locale,
      application.program,
      profile,
      state.savedIds,
      state.appliedIds,
    ),
  }));
}

/** University and city names used by the natural-language query parser. */
export async function getSearchVocabulary() {
  const [universities, cities] = await Promise.all([
    prisma.university.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, name: true, nameAr: true },
    }),
    prisma.university.findMany({
      where: { publishedAt: { not: null } },
      distinct: ["city"],
      select: { city: true, cityAr: true },
    }),
  ]);

  return {
    universities,
    cities: cities.map((row) => ({
      value: row.city,
      en: row.city,
      ar: row.cityAr,
    })),
  };
}
