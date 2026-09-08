import type {
  ContentSection,
  HighSchoolSystem,
  ScoreUnit,
  UniversityType,
} from "@prisma/client";

// The enum members are written out rather than imported as values: importing
// them from "@prisma/client" is a runtime import, and these lists feed selects
// inside client components. `satisfies` still fails the build if the schema
// gains a member that is missing here.
export const UNIVERSITY_TYPES = [
  "PUBLIC",
  "PRIVATE",
  "SPECIALIZED",
] as const satisfies readonly UniversityType[];

export const CONTENT_SECTIONS = [
  "ADMISSION_REQUIREMENTS",
  "ADMISSION_CRITERIA",
  "TUITION_NOTES",
  "ABOUT_EXTRA",
] as const satisfies readonly ContentSection[];

export const HIGH_SCHOOL_SYSTEMS = [
  "THANAWEYA_AMMA",
  "IGCSE",
  "AMERICAN_DIPLOMA",
  "STEM",
  "AL_AZHAR",
  "ARAB_CERTIFICATE",
  "OTHER",
] as const satisfies readonly HighSchoolSystem[];

export const SCORE_UNITS = [
  "PERCENT",
  "GPA",
  "POINTS",
] as const satisfies readonly ScoreUnit[];

/** One row of the list table; mirrors the `select` in the list page. */
export type UniversityRow = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  type: UniversityType;
  country: string;
  countryAr: string | null;
  city: string;
  cityAr: string | null;
  logoUrl: string | null;
  publishedAt: Date | null;
  facultyCount: number;
  programCount: number;
};

/** Everything the Details tab edits, plus the two media columns. */
export type UniversityDetail = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  type: UniversityType;
  country: string;
  countryAr: string | null;
  city: string;
  cityAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  aboutRich: string | null;
  aboutRichAr: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  establishedYear: number | null;
  addressLine: string | null;
  addressLineAr: string | null;
  phone: string | null;
  email: string | null;
  isFeatured: boolean;
  isRecommended: boolean;
  isTrending: boolean;
  latitude: number | null;
  longitude: number | null;
  publishedAt: Date | null;
};

/** The `counts` object the 409 from DELETE carries, in display order. */
export type DeleteCounts = {
  faculties: number;
  programs: number;
  images: number;
  features: number;
  contentBlocks: number;
  minimumScores: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  altAr: string | null;
  sortOrder: number;
};

export type FeatureRow = {
  id: string;
  title: string;
  titleAr: string | null;
  body: string | null;
  bodyAr: string | null;
  sortOrder: number;
};

export type ContentBlockRow = {
  id: string;
  section: ContentSection;
  title: string | null;
  titleAr: string | null;
  body: string;
  bodyAr: string | null;
  sortOrder: number;
};

/** minScore arrives as a number: Prisma's Decimal cannot cross to a client. */
export type ScoreRow = {
  id: string;
  system: HighSchoolSystem;
  facultyId: string | null;
  minScore: number;
  unit: ScoreUnit;
  year: number | null;
};

export type FacultyOption = {
  id: string;
  name: string;
  nameAr: string | null;
};
