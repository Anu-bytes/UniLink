import type {
  EnglishTest,
  IntakeSeason,
  ProgramTag,
  StudyLevel,
  TuitionPeriod,
} from "@prisma/client";

// The enum members are written out rather than imported as values: importing
// them from "@prisma/client" is a runtime import, and these lists feed selects
// inside client components. `satisfies` still fails the build if the schema
// gains a member that is missing here.
export const STUDY_LEVELS = [
  "CERTIFICATE",
  "DIPLOMA",
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
] as const satisfies readonly StudyLevel[];

export const TUITION_PERIODS = [
  "YEAR",
  "TERM",
  "TOTAL",
] as const satisfies readonly TuitionPeriod[];

export const PROGRAM_TAGS = [
  "HIGH_JOB_DEMAND",
  "SCHOLARSHIPS_AVAILABLE",
  "FAST_ACCEPTANCE",
  "WAIVED_APPLICATION_FEE",
  "FINANCIAL_AID_AVAILABLE",
  "CREDIT_HOURS",
] as const satisfies readonly ProgramTag[];

export const INTAKE_SEASONS = [
  "WINTER",
  "SPRING",
  "SUMMER",
  "FALL",
] as const satisfies readonly IntakeSeason[];

/**
 * EnglishTest.NONE is deliberately missing. It exists so a student can say
 * they hold no certificate; as a program requirement the API rejects it, so
 * offering it here would only ever produce a 400.
 */
export const REQUIREMENT_TESTS = [
  "IELTS",
  "TOEFL",
  "PTE",
  "DUOLINGO",
] as const satisfies readonly EnglishTest[];

export type RequirementTest = (typeof REQUIREMENT_TESTS)[number];

export function isRequirementTest(value: string): value is RequirementTest {
  return (REQUIREMENT_TESTS as readonly string[]).includes(value);
}

/** One row of the list table; mirrors the `select` in the list page. */
export type ProgramRow = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  studyLevel: StudyLevel;
  fieldOfStudy: string;
  /** Decimal cannot cross into a client component, so the page converts it. */
  tuitionFee: number | null;
  tuitionPeriod: TuitionPeriod;
  currency: string;
  isPublished: boolean;
  university: { id: string; name: string; nameAr: string | null };
  faculty: { id: string; name: string; nameAr: string | null } | null;
};

/** Everything the Details tab writes back through PATCH. */
export type ProgramDetail = {
  id: string;
  universityId: string;
  facultyId: string | null;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  studyLevel: StudyLevel;
  fieldOfStudy: string;
  durationMonths: number | null;
  durationLabel: string | null;
  durationLabelAr: string | null;
  minGradePercent: number | null;
  coopAvailable: boolean;
  tags: ProgramTag[];
  isPublished: boolean;
};

/** Everything the Fees tab writes back; the money columns already converted. */
export type ProgramFees = {
  tuitionFee: number | null;
  tuitionPeriod: TuitionPeriod;
  currency: string;
  applicationFee: number | null;
  applicationFeeWaived: boolean;
};

/**
 * The program's children, in the order the delete dialog reads them. Doubles
 * as the `counts` object the 409 from DELETE carries.
 */
export type ProgramCounts = {
  intakes: number;
  englishRequirements: number;
  savedBy: number;
  applications: number;
};

export type IntakeRow = {
  id: string;
  season: IntakeSeason;
  year: number;
  applicationDeadline: Date | null;
};

/** minScore arrives as a number: the column is a Float, not a Decimal. */
export type EnglishRequirementRow = {
  id: string;
  test: EnglishTest;
  minScore: number;
};

export type UniversityOption = {
  id: string;
  name: string;
  nameAr: string | null;
};

/**
 * `universityId` travels with every faculty so the create form can narrow the
 * list without a round trip: the API rejects a faculty belonging to another
 * university, so an unfiltered select would offer choices that cannot be saved.
 */
export type FacultyOption = UniversityOption & { universityId: string };
