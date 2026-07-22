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
  programCount: number;
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

const publishedUniversityWhere = { publishedAt: { not: null } } as const;

function localized(
  locale: string,
  english: string,
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
    _count: { programs: number };
  },
): UniversityCardData {
  return {
    id: university.id,
    slug: university.slug,
    name: localized(locale, university.name, university.nameAr),
    city: localized(locale, university.city, university.cityAr),
    country: localized(locale, university.country, university.countryAr),
    type: university.type,
    description:
      locale.startsWith("ar") && university.descriptionAr
        ? university.descriptionAr
        : university.description,
    coverImageUrl: university.coverImageUrl,
    websiteUrl: university.websiteUrl,
    programCount: university._count.programs,
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
  _count: { select: { programs: { where: { isPublished: true } } } },
} as const;

export async function getLandingCatalog(
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
        location:
          locale.startsWith("ar") && testimonial.locationAr
            ? testimonial.locationAr
            : testimonial.location,
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

export async function getPublishedUniversities(locale: string) {
  const universities = await prisma.university.findMany({
    where: publishedUniversityWhere,
    orderBy: [{ name: "asc" }],
    select: universityCardSelect,
  });

  return universities.map((university) => mapUniversity(locale, university));
}

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
