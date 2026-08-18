import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { localized, localizedOrNull } from "@/lib/catalog";
import { scoreProgram, type MatchProfile, type MatchResult } from "@/lib/matching";
import { prisma } from "@/lib/prisma";

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
  applied: boolean;
};

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

function mapProgram(
  locale: string,
  row: ProgramRow,
  profile: MatchProfile | null,
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
    applied: appliedIds.has(row.id),
  };
}

/** Applied program ids for a user, in one round trip. */
export async function getUserProgramState(userId: string | null) {
  if (!userId) return { appliedIds: new Set<string>() };

  const applications = await prisma.application.findMany({
    where: { userId },
    select: { programId: true },
  });

  return {
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
    mapProgram(locale, row, profile, state.appliedIds),
  );

  // Preserve the order the user selected them in.
  return ids
    .map((id) => mapped.find((result) => result.id === id))
    .filter((result): result is ProgramResult => result != null);
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
      state.appliedIds,
    ),
  }));
}

/**
 * University, city and faculty names used by the natural-language parser.
 * Fetched on every search-page render (3 queries), but the catalog it draws
 * from only changes through admin edits, so it's cached instead of hitting
 * the pooled connection on every request.
 */
export const getSearchVocabulary = unstable_cache(
  async () => {
    return getSearchVocabularyUncached();
  },
  ["search-vocabulary"],
  { revalidate: 300 },
);

async function getSearchVocabularyUncached() {
  const [universities, cities, faculties] = await Promise.all([
    prisma.university.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, name: true, nameAr: true },
    }),
    prisma.university.findMany({
      where: { publishedAt: { not: null } },
      distinct: ["city"],
      select: { city: true, cityAr: true },
    }),
    prisma.faculty.findMany({
      where: { university: { publishedAt: { not: null } } },
      select: {
        id: true,
        name: true,
        nameAr: true,
        university: { select: { name: true } },
      },
    }),
  ]);

  return {
    universities,
    cities: cities.map((row) => ({
      value: row.city,
      en: row.city,
      ar: row.cityAr,
    })),
    faculties: faculties.map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      nameAr: faculty.nameAr,
      universityName: faculty.university.name,
    })),
  };
}
