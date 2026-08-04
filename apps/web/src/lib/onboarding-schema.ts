import { z } from "zod";

import { FIELDS_OF_STUDY } from "@/lib/fields";

// ---------------------------------------------------------------------------
// Option constants — mirror the Prisma enums in prisma/schema.prisma.
// The `value` is what we persist; labels are resolved via next-intl at render
// time using the `key` (see messages/*.json → Onboarding.options.*).
// ---------------------------------------------------------------------------

export const STUDY_LEVELS = [
  "CERTIFICATE",
  "DIPLOMA",
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
] as const;

export const ENGLISH_TESTS = [
  "IELTS",
  "TOEFL",
  "PTE",
  "DUOLINGO",
  "NONE",
] as const;

export const HIGH_SCHOOL_SYSTEMS = [
  "THANAWEYA_AMMA",
  "IGCSE",
  "AMERICAN_DIPLOMA",
  "STEM",
  "AL_AZHAR",
  "ARAB_CERTIFICATE",
  "OTHER",
] as const;

export const INTAKE_SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

export const BUDGET_BANDS = [
  "UNDER_100K",
  "B100_200K",
  "B200_300K",
  "B300_500K",
  "OVER_500K",
] as const;

const currentYear = new Date().getFullYear();
// Previous year, current year, and next year (3 intake years total),
// e.g. 2025, 2026, 2027.
const INTAKE_YEAR_COUNT = 3;
export const INTAKE_YEARS: readonly number[] = Array.from(
  { length: INTAKE_YEAR_COUNT },
  (_, i) => currentYear - 1 + i,
);

// Expected high-school graduation years: previous, current, and next year
// (e.g. 2025, 2026, 2027).
export const GRADUATION_YEARS: readonly number[] = Array.from(
  { length: 3 },
  (_, i) => currentYear - 1 + i,
);

// ---------------------------------------------------------------------------
// Per-step schemas. Each wizard step validates exactly its own slice so we can
// gate the "Continue" button per step, then compose them into `wizardSchema`
// for the final submit.
// ---------------------------------------------------------------------------

export const studyLevelSchema = z.object({
  studyLevel: z.enum(STUDY_LEVELS),
});

// First step: name + country. firstName/lastName live on the User; nationality
// (the country code) is a StudentProfile field.
export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(50),
  lastName: z.string().trim().min(1, "Enter your last name").max(50),
  nationality: z.string().length(2, "Select your country"),
});

export const academicsSchema = z
  .object({
    highSchoolSystem: z.enum(HIGH_SCHOOL_SYSTEMS),
    // Free-text detail, only required when the chosen system is "OTHER".
    highSchoolSystemOther: z.string().trim().max(80).optional(),
    graduationYear: z.coerce
      .number()
      .int()
      .refine((y) => (GRADUATION_YEARS as readonly number[]).includes(y), {
        message: "Select your expected graduation year",
      }),
    // Kept free-text so it fits any system (percentage, GPA, letter grades…).
    gradeValue: z.string().trim().min(1, "Enter your expected grade"),
  })
  .superRefine((data, ctx) => {
    if (data.highSchoolSystem === "OTHER" && !data.highSchoolSystemOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["highSchoolSystemOther"],
        message: "Please specify your high school system",
      });
    }
  });

export const fieldSchema = z.object({
  fieldsOfStudy: z
    .array(z.string().min(1))
    .min(1, "Select at least one field of study")
    .max(3, "Choose up to 3 fields of study"),
});

export const englishSchema = z
  .object({
    englishTest: z.enum(ENGLISH_TESTS),
    englishScore: z.coerce.number().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.englishTest !== "NONE" && data.englishScore == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["englishScore"],
        message: "Enter your test score",
      });
    }
  });

export const nationalitySchema = z.object({
  nationality: z.string().length(2, "Select your nationality"),
});

export const intakeSchema = z.object({
  intakeSeason: z.enum(INTAKE_SEASONS),
  intakeYear: z.coerce
    .number()
    .int()
    .refine((y) => (INTAKE_YEARS as readonly number[]).includes(y), {
      message: "Select an intake year",
    }),
});

export const financialsSchema = z.object({
  budgetBand: z.enum(BUDGET_BANDS),
});

// Reuses the same password policy as the existing /api/register route.
export const accountSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  acceptTerms: z.literal(true, {
    message: "You must accept the terms to continue",
  }),
});

// ---------------------------------------------------------------------------
// Ordered step registry. `key` drives the URL (?step=) and translation
// namespace; `schema` gates each step's Continue button.
// ---------------------------------------------------------------------------

export const WIZARD_STEPS = [
  { key: "personalInfo", schema: personalInfoSchema },
  { key: "academics", schema: academicsSchema },
  { key: "field", schema: fieldSchema },
  { key: "financials", schema: financialsSchema },
  { key: "account", schema: accountSchema },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;
export type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];

// ---------------------------------------------------------------------------
// Master schema — everything except the account credentials makes up the
// profile payload persisted to StudentProfile. `accountSchema` fields go to
// the User. Kept as a single object so the final submit validates the whole
// accumulated state in one pass.
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  highSchoolSystem: z.enum(HIGH_SCHOOL_SYSTEMS),
  highSchoolSystemOther: z.string().trim().max(80).optional(),
  graduationYear: z.coerce.number().int(),
  gradeValue: z.string().trim().min(1),
  fieldsOfStudy: fieldSchema.shape.fieldsOfStudy,
  nationality: nationalitySchema.shape.nationality,
  budgetBand: financialsSchema.shape.budgetBand,
});

export const registerPayloadSchema = z.object({
  email: accountSchema.shape.email,
  phone: accountSchema.shape.phone,
  firstName: personalInfoSchema.shape.firstName,
  lastName: personalInfoSchema.shape.lastName,
  password: accountSchema.shape.password,
  profile: profileSchema,
});

// ---------------------------------------------------------------------------
// Preferences editing (the "Preferences" card on /app/profile).
//
// Composed from the wizard schemas above so the two entry points cannot drift.
// This is the schema the API route validates against: the client runs it too,
// but only as a convenience.
// ---------------------------------------------------------------------------

/** Only values the app actually knows about; blocks arbitrary strings. */
const FIELD_VALUES = new Set(FIELDS_OF_STUDY.map((field) => field.value));

/**
 * Plausible score bounds per test, so a profile cannot claim IELTS 9000 and
 * skew every match calculation.
 */
export const ENGLISH_SCORE_RANGES = {
  IELTS: { min: 0, max: 9 },
  TOEFL: { min: 0, max: 120 },
  PTE: { min: 10, max: 90 },
  DUOLINGO: { min: 10, max: 160 },
} as const satisfies Record<
  Exclude<(typeof ENGLISH_TESTS)[number], "NONE">,
  { min: number; max: number }
>;

export const preferencesSchema = z
  .object({
    fieldsOfStudy: z
      .array(
        z.string().refine((value) => FIELD_VALUES.has(value), {
          message: "Unknown field of study",
        }),
      )
      // Never allow the section to be emptied.
      .min(1, "Select at least one field of study")
      .max(3, "Choose up to 3 fields of study"),
    budgetBand: z.enum(BUDGET_BANDS),
    intakeSeason: z.enum(INTAKE_SEASONS),
    intakeYear: z.coerce
      .number()
      .int()
      .refine((year) => (INTAKE_YEARS as readonly number[]).includes(year), {
        message: "Select an intake year",
      }),
    englishTest: z.enum(ENGLISH_TESTS),
    // Null clears the score; only valid when no test is selected.
    englishScore: z.coerce.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.englishTest === "NONE") {
      return;
    }

    if (data.englishScore == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["englishScore"],
        message: "Enter your test score",
      });
      return;
    }

    const range = ENGLISH_SCORE_RANGES[data.englishTest];
    if (data.englishScore < range.min || data.englishScore > range.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["englishScore"],
        message: `Score must be between ${range.min} and ${range.max}`,
      });
    }
  });

export type PreferencesData = z.infer<typeof preferencesSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProfileData = z.infer<typeof profileSchema>;
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

// The wizard accumulates a partial version of all fields as the user advances.
export type WizardData = Partial<
  ProfileData & {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    acceptTerms: boolean;
  }
>;
