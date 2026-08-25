import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export type UniversityCardData = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  type: "PUBLIC" | "PRIVATE" | "SPECIALIZED";
  description: string | null;
  coverImageUrl: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  establishedYear: number | null;
  isRecommended: boolean;
  isTrending: boolean;
  programCount: number;
  facultyCount: number;
};

export type ProgramCardData = {
  id: string;
  slug: string;
  name: string;
  universityName: string;
  studyLevel: string;
  fieldOfStudy: string;
  durationMonths: number | null;
  tuitionFee: string | null;
  currency: string;
};

export type TestimonialData = {
  id: string;
  studentName: string;
  quote: string;
  location: string | null;
  avatarUrl: string | null;
};

export type LandingCatalogData = {
  universities: UniversityCardData[];
  testimonials: TestimonialData[];
  stats: number[];
};

/**
 * Real counts undersell how active the platform looks this early on, so the
 * public-facing stat displays (homepage hero, login panel) add a fixed
 * offset on top of the live counts. Both surfaces call this so the numbers
 * stay identical wherever they're shown.
 *
 * catalog.stats is [universityCount, programCount, studentCount, cityCount, scholarshipCount].
 */
export function withDisplayOffsets(stats: number[]): number[] {
  const offsets = [0, 500, 1000, 0, 0];
  return stats.map((value, i) => value + (offsets[i] ?? 0));
}

const publishedUniversityWhere = { publishedAt: { not: null } } as const;

export function localized(
  locale: string,
  english: string,
  arabic: string | null,
) {
  return locale.startsWith("ar") && arabic ? arabic : english;
}

/** Same as `localized` but tolerates a null English value. */
export function localizedOrNull(
  locale: string,
  english: string | null,
  arabic: string | null,
) {
  return locale.startsWith("ar") && arabic ? arabic : english;
}

function mapUniversity(
  locale: string,
  university: {
    id: string;
    slug: string;
    name: string;
    nameAr: string | null;
    city: string;
    cityAr: string | null;
    country: string;
    countryAr: string | null;
    type: "PUBLIC" | "PRIVATE" | "SPECIALIZED";
    description: string | null;
    descriptionAr: string | null;
    coverImageUrl: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    establishedYear: number | null;
    isRecommended: boolean;
    isTrending: boolean;
    _count: { programs: number; faculties: number };
  },
): UniversityCardData {
  return {
    id: university.id,
    slug: university.slug,
    name: localized(locale, university.name, university.nameAr),
    city: localized(locale, university.city, university.cityAr),
    country: localized(locale, university.country, university.countryAr),
    type: university.type,
    description: localizedOrNull(
      locale,
      university.description,
      university.descriptionAr,
    ),
    coverImageUrl: university.coverImageUrl,
    websiteUrl: university.websiteUrl,
    logoUrl: university.logoUrl,
    establishedYear: university.establishedYear,
    isRecommended: university.isRecommended,
    isTrending: university.isTrending,
    programCount: university._count.programs,
    facultyCount: university._count.faculties,
  };
}

const universityCardSelect = {
  id: true,
  slug: true,
  name: true,
  nameAr: true,
  city: true,
  cityAr: true,
  country: true,
  countryAr: true,
  type: true,
  description: true,
  descriptionAr: true,
  coverImageUrl: true,
  websiteUrl: true,
  logoUrl: true,
  establishedYear: true,
  isRecommended: true,
  isTrending: true,
  _count: {
    select: { programs: { where: { isPublished: true } }, faculties: true },
  },
} as const;

// Homepage stats/featured-universities/testimonials only change via the admin
// dashboard, but the page renders dynamically (it reads the session), so
// without this every hit re-runs 7 queries. Cached per locale for a short
// window — cheap to keep fresh, and it takes the load off the pooled
// connection under concurrent traffic.
export const getLandingCatalog = unstable_cache(
  async (locale: string): Promise<LandingCatalogData> => {
    return getLandingCatalogUncached(locale);
  },
  ["landing-catalog"],
  { revalidate: 120 },
);

async function getLandingCatalogUncached(
  locale: string,
): Promise<LandingCatalogData> {
  try {
    const [
      universities,
      testimonials,
      universityCount,
      programCount,
      studentCount,
      cities,
      scholarshipCount,
    ] = await Promise.all([
      prisma.university.findMany({
        where: { ...publishedUniversityWhere, isFeatured: true },
        orderBy: [{ name: "asc" }],
        take: 9,
        select: universityCardSelect,
      }),
      prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 6,
      }),
      prisma.university.count({ where: publishedUniversityWhere }),
      prisma.program.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.university.findMany({
        where: publishedUniversityWhere,
        distinct: ["city"],
        select: { city: true },
      }),
      prisma.scholarship.count({ where: { isPublished: true } }),
    ]);

    return {
      universities: universities.map((university) =>
        mapUniversity(locale, university),
      ),
      testimonials: testimonials.map((testimonial) => ({
        id: testimonial.id,
        studentName: testimonial.studentName,
        quote: localized(locale, testimonial.quote, testimonial.quoteAr),
        location: localizedOrNull(
          locale,
          testimonial.location,
          testimonial.locationAr,
        ),
        avatarUrl: testimonial.avatarUrl,
      })),
      stats: [
        universityCount,
        programCount,
        studentCount,
        cities.length,
        scholarshipCount,
      ],
    };
  } catch (error) {
    console.error("Unable to load landing catalogue data", error);
    return { universities: [], testimonials: [], stats: [0, 0, 0, 0, 0] };
  }
}

export type UniversityDirectoryFilters = {
  q?: string;
  types?: string[];
  cities?: string[];
};

/**
 * Builds an AND-of-ORs clause: every word in the query has to match somewhere
 * (name, city, country, ...), but each word can match a different field. A
 * plain "the query contains X" check fails the moment someone types more than
 * one word ("Cairo private university" never appears verbatim anywhere), so
 * this is what actually makes multi-word search work.
 */
function universitySearchWhere(q: string): Prisma.UniversityWhereInput {
  const words = q.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return {};

  return {
    AND: words.map((word) => ({
      OR: [
        { name: { contains: word, mode: "insensitive" as const } },
        { nameAr: { contains: word } },
        { city: { contains: word, mode: "insensitive" as const } },
        { cityAr: { contains: word } },
        { country: { contains: word, mode: "insensitive" as const } },
        { countryAr: { contains: word } },
        { description: { contains: word, mode: "insensitive" as const } },
        { descriptionAr: { contains: word } },
      ],
    })),
  };
}

export async function getPublishedUniversities(
  locale: string,
  filters: UniversityDirectoryFilters = {},
) {
  const universities = await prisma.university.findMany({
    where: {
      ...publishedUniversityWhere,
      ...(filters.types?.length
        ? { type: { in: filters.types as ("PUBLIC" | "PRIVATE" | "SPECIALIZED")[] } }
        : {}),
      ...(filters.cities?.length ? { city: { in: filters.cities } } : {}),
      ...(filters.q ? universitySearchWhere(filters.q) : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    select: universityCardSelect,
  });

  // Exact (or exact-prefix) name matches float to the top within each
  // featured tier, so typing "AUC" finds AUC before some unrelated
  // university whose description happens to mention it.
  const needle = filters.q?.trim().toLowerCase();
  const mapped = universities.map((university) => mapUniversity(locale, university));
  if (!needle) return mapped;

  const rank = (name: string) => {
    const value = name.toLowerCase();
    if (value === needle) return 0;
    if (value.startsWith(needle)) return 1;
    if (value.includes(needle)) return 2;
    return 3;
  };

  return mapped
    .map((university, index) => ({ university, index, rank: rank(university.name) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.university);
}

/**
 * Distinct cities across published universities, for the directory/search
 * filters. Runs on nearly every search-page render, but the published-city
 * set only moves when a university is added or edited, so it's cached.
 */
export const getUniversityCities = unstable_cache(
  async (locale: string) => {
    const rows = await prisma.university.findMany({
      where: publishedUniversityWhere,
      distinct: ["city"],
      orderBy: { city: "asc" },
      select: { city: true, cityAr: true },
    });

    return rows.map((row) => ({
      value: row.city,
      label: localized(locale, row.city, row.cityAr),
    }));
  },
  ["university-cities"],
  { revalidate: 300 },
);

export async function getPublishedPrograms(
  locale: string,
): Promise<ProgramCardData[]> {
  const programs = await prisma.program.findMany({
    where: {
      isPublished: true,
      university: publishedUniversityWhere,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      studyLevel: true,
      fieldOfStudy: true,
      durationMonths: true,
      tuitionFee: true,
      currency: true,
      university: { select: { name: true, nameAr: true } },
    },
  });

  return programs.map((program) => ({
    id: program.id,
    slug: program.slug,
    name: localized(locale, program.name, program.nameAr),
    universityName: localized(
      locale,
      program.university.name,
      program.university.nameAr,
    ),
    studyLevel: program.studyLevel,
    fieldOfStudy: program.fieldOfStudy,
    durationMonths: program.durationMonths,
    tuitionFee: program.tuitionFee?.toString() ?? null,
    currency: program.currency,
  }));
}

// ---------------------------------------------------------------------------
// University detail page
// ---------------------------------------------------------------------------

export type UniversityDetailProgram = {
  id: string;
  slug: string;
  name: string;
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
  tags: string[];
};

export type UniversityDetailFaculty = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  programs: UniversityDetailProgram[];
};

export type UniversityDetailData = {
  id: string;
  slug: string;
  name: string;
  type: "PUBLIC" | "PRIVATE" | "SPECIALIZED";
  city: string;
  country: string;
  addressLine: string | null;
  description: string | null;
  aboutRich: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  phone: string | null;
  email: string | null;
  establishedYear: number | null;
  latitude: number | null;
  longitude: number | null;
  viewCount: number;
  isRecommended: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; url: string; alt: string | null }[];
  features: { id: string; title: string; body: string | null }[];
  admissionRequirements: { id: string; title: string | null; body: string }[];
  admissionCriteria: { id: string; title: string | null; body: string }[];
  tuitionNotes: { id: string; title: string | null; body: string }[];
  minimumScores: {
    id: string;
    system: string;
    minScore: number;
    unit: string;
    year: number | null;
    facultyName: string | null;
  }[];
  faculties: UniversityDetailFaculty[];
  programCount: number;
};

/**
 * Full university payload for the detail page.
 *
 * Wrapped in React `cache` because both routes that use it call it twice per
 * request: once in `generateMetadata`, again in the page component. Without the
 * dedupe that is two runs of this query — every faculty, every published
 * program, plus images, features, content blocks and minimum scores — to render
 * one page. The cache is per-request, so nothing can go stale.
 */
export const getUniversityDetail = cache(async function getUniversityDetail(
  locale: string,
  slug: string,
): Promise<UniversityDetailData | null> {
  const university = await prisma.university.findFirst({
    where: { slug, ...publishedUniversityWhere },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      features: { orderBy: { sortOrder: "asc" } },
      contentBlocks: { orderBy: { sortOrder: "asc" } },
      minimumScores: {
        orderBy: { system: "asc" },
        include: { faculty: { select: { name: true, nameAr: true } } },
      },
      faculties: {
        orderBy: { sortOrder: "asc" },
        include: {
          programs: {
            where: { isPublished: true },
            orderBy: { name: "asc" },
          },
        },
      },
    },
  });

  if (!university) return null;

  const blocksOf = (section: string) =>
    university.contentBlocks
      .filter((block) => block.section === section)
      .map((block) => ({
        id: block.id,
        title: localizedOrNull(locale, block.title, block.titleAr),
        body: localized(locale, block.body, block.bodyAr),
      }));

  return {
    id: university.id,
    slug: university.slug,
    name: localized(locale, university.name, university.nameAr),
    type: university.type,
    city: localized(locale, university.city, university.cityAr),
    country: localized(locale, university.country, university.countryAr),
    addressLine: localizedOrNull(
      locale,
      university.addressLine,
      university.addressLineAr,
    ),
    description: localizedOrNull(
      locale,
      university.description,
      university.descriptionAr,
    ),
    aboutRich: localizedOrNull(locale, university.aboutRich, university.aboutRichAr),
    websiteUrl: university.websiteUrl,
    logoUrl: university.logoUrl,
    coverImageUrl: university.coverImageUrl,
    phone: university.phone,
    email: university.email,
    establishedYear: university.establishedYear,
    latitude: university.latitude,
    longitude: university.longitude,
    viewCount: university.viewCount,
    isRecommended: university.isRecommended,
    isTrending: university.isTrending,
    createdAt: university.createdAt,
    updatedAt: university.updatedAt,
    images: university.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: localizedOrNull(locale, image.alt, image.altAr),
    })),
    features: university.features.map((feature) => ({
      id: feature.id,
      title: localized(locale, feature.title, feature.titleAr),
      body: localizedOrNull(locale, feature.body, feature.bodyAr),
    })),
    admissionRequirements: blocksOf("ADMISSION_REQUIREMENTS"),
    admissionCriteria: blocksOf("ADMISSION_CRITERIA"),
    tuitionNotes: blocksOf("TUITION_NOTES"),
    minimumScores: university.minimumScores.map((score) => ({
      id: score.id,
      system: score.system,
      minScore: Number(score.minScore),
      unit: score.unit,
      year: score.year,
      facultyName: score.faculty
        ? localized(locale, score.faculty.name, score.faculty.nameAr)
        : null,
    })),
    faculties: university.faculties.map((faculty) => ({
      id: faculty.id,
      slug: faculty.slug,
      name: localized(locale, faculty.name, faculty.nameAr),
      description: localizedOrNull(
        locale,
        faculty.description,
        faculty.descriptionAr,
      ),
      imageUrl: faculty.imageUrl,
      programs: faculty.programs.map((program) => ({
        id: program.id,
        slug: program.slug,
        name: localized(locale, program.name, program.nameAr),
        studyLevel: program.studyLevel,
        fieldOfStudy: program.fieldOfStudy,
        durationMonths: program.durationMonths,
        durationLabel: localizedOrNull(
          locale,
          program.durationLabel,
          program.durationLabelAr,
        ),
        tuitionFee: program.tuitionFee ? Number(program.tuitionFee) : null,
        tuitionPeriod: program.tuitionPeriod,
        currency: program.currency,
        applicationFee: program.applicationFee
          ? Number(program.applicationFee)
          : null,
        applicationFeeWaived: program.applicationFeeWaived,
        minGradePercent: program.minGradePercent,
        tags: program.tags,
      })),
    })),
    programCount: university.faculties.reduce(
      (total, faculty) => total + faculty.programs.length,
      0,
    ),
  };
});

/** Slugs of every published university, for `generateStaticParams`/sitemaps. */
export async function getUniversitySlugs() {
  const rows = await prisma.university.findMany({
    where: publishedUniversityWhere,
    select: { slug: true },
  });
  return rows.map((row) => row.slug);
}

/**
 * Bump the hero view counter. Deliberately fire-and-forget: a failed increment
 * must never break the page render.
 */
export async function incrementUniversityViews(id: string) {
  try {
    await prisma.university.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (error) {
    console.error("Unable to increment university view count", error);
  }
}
