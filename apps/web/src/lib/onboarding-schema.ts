import { z } from "zod";

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

export const GRADING_SCHEMES = ["percentage", "gpa4", "gpa10"] as const;

export const INTAKE_SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

export const BUDGET_BANDS = [
  "UNDER_100K",
  "B100_200K",
  "B200_300K",
  "B300_500K",
  "OVER_500K",
] as const;

const currentYear = new Date().getFullYear();
// Current year plus the next four (5 intake years total).
const INTAKE_YEAR_COUNT = 5;
export const INTAKE_YEARS: readonly number[] = Array.from(
  { length: INTAKE_YEAR_COUNT },
  (_, i) => currentYear + i,
);

// ---------------------------------------------------------------------------
// Per-step schemas. Each wizard step validates exactly its own slice so we can
// gate the "Continue" button per step, then compose them into `wizardSchema`
// for the final submit.
// ---------------------------------------------------------------------------

export const studyLevelSchema = z.object({
  studyLevel: z.enum(STUDY_LEVELS),
});

export const academicsSchema = z
  .object({
    gradingScheme: z.enum(GRADING_SCHEMES),
    gradeValue: z.coerce
      .number({ invalid_type_error: "Enter your grade" })
      .positive("Enter your grade"),
  })
  .superRefine((data, ctx) => {
    // Sanity-bound the grade to the chosen scheme.
    const max =
      data.gradingScheme === "gpa4"
        ? 4
        : data.gradingScheme === "gpa10"
          ? 10
          : 100; // percentage
    if (data.gradeValue > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gradeValue"],
        message: `Grade cannot exceed ${max} for this scheme`,
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
  { key: "studyLevel", schema: studyLevelSchema },
  { key: "academics", schema: academicsSchema },
  { key: "field", schema: fieldSchema },
  { key: "english", schema: englishSchema },
  { key: "nationality", schema: nationalitySchema },
  { key: "intake", schema: intakeSchema },
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
  studyLevel: studyLevelSchema.shape.studyLevel,
  gradingScheme: z.enum(GRADING_SCHEMES),
  gradeValue: z.coerce.number().positive(),
  fieldsOfStudy: fieldSchema.shape.fieldsOfStudy,
  englishTest: z.enum(ENGLISH_TESTS),
  englishScore: z.coerce.number().positive().optional(),
  nationality: nationalitySchema.shape.nationality,
  intakeSeason: intakeSchema.shape.intakeSeason,
  intakeYear: intakeSchema.shape.intakeYear,
  budgetBand: financialsSchema.shape.budgetBand,
});

export const registerPayloadSchema = z.object({
  email: accountSchema.shape.email,
  password: accountSchema.shape.password,
  profile: profileSchema,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProfileData = z.infer<typeof profileSchema>;
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

// The wizard accumulates a partial version of all fields as the user advances.
export type WizardData = Partial<
  ProfileData & {
    email: string;
    password: string;
    acceptTerms: boolean;
  }
>;
