import { z } from "zod";

import { BUDGET_BANDS, STUDY_LEVELS } from "@/lib/onboarding-schema";

// The single shape of a program search, shared by the URL, the API route and
// the filter panel. Every field is optional: an empty object means "everything".

export const PROGRAM_TAGS = [
  "HIGH_JOB_DEMAND",
  "SCHOLARSHIPS_AVAILABLE",
  "FAST_ACCEPTANCE",
  "WAIVED_APPLICATION_FEE",
  "FINANCIAL_AID_AVAILABLE",
  "CREDIT_HOURS",
] as const;

export type ProgramTagValue = (typeof PROGRAM_TAGS)[number];

export const UNIVERSITY_TYPES = ["PUBLIC", "PRIVATE", "SPECIALIZED"] as const;

/** Quick toggles rendered as chips above the results, in display order. */
export const QUICK_TAGS: readonly ProgramTagValue[] = [
  "WAIVED_APPLICATION_FEE",
  "SCHOLARSHIPS_AVAILABLE",
  "FAST_ACCEPTANCE",
  "HIGH_JOB_DEMAND",
];

/** Accepts either an array or a comma-separated string from the URL. */
const csv = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value) =>
      typeof value === "string"
        ? value.split(",").map((part) => part.trim()).filter(Boolean)
        : value,
    schema,
  );

export const searchFiltersSchema = z.object({
  /** Raw natural-language query, kept so the input can be repopulated. */
  q: z.string().trim().max(200).optional(),
  fields: csv(z.array(z.string().min(1)).max(10)).optional(),
  levels: csv(z.array(z.enum(STUDY_LEVELS)).max(5)).optional(),
  cities: csv(z.array(z.string().min(1)).max(10)).optional(),
  universities: csv(z.array(z.string().min(1)).max(10)).optional(),
  universityTypes: csv(z.array(z.enum(UNIVERSITY_TYPES)).max(3)).optional(),
  tags: csv(z.array(z.enum(PROGRAM_TAGS)).max(6)).optional(),
  /** Inclusive tuition bounds in EGP per year. */
  minTuition: z.coerce.number().min(0).optional(),
  maxTuition: z.coerce.number().min(0).optional(),
  budgetBand: z.enum(BUDGET_BANDS).optional(),
  intakeYear: z.coerce.number().int().min(2000).max(2100).optional(),
  intakeSeason: z.enum(["WINTER", "SPRING", "SUMMER", "FALL"]).optional(),
  sort: z.enum(["match", "tuitionAsc", "tuitionDesc", "name"]).default("match"),
  page: z.coerce.number().int().min(1).max(200).default(1),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

export const PAGE_SIZE = 12;

/**
 * Quick tuition brackets in EGP per year, surfaced as a dropdown in the filter
 * bar. Tuition and location are the two things students filter on first, so
 * both get a control of their own rather than living inside the filter drawer.
 *
 * `min`/`max` map straight onto the SearchFilters range, so the dropdown and
 * the drawer's numeric inputs drive the same two fields.
 */
export const TUITION_RANGES = [
  { key: "under100", min: undefined, max: 100_000 },
  { key: "from100to200", min: 100_000, max: 200_000 },
  { key: "from200to300", min: 200_000, max: 300_000 },
  { key: "from300to500", min: 300_000, max: 500_000 },
  { key: "over500", min: 500_000, max: undefined },
] as const;

export type TuitionRangeKey = (typeof TUITION_RANGES)[number]["key"];

/**
 * The bracket the current filters correspond to, or "" when the range was set
 * by hand in the drawer and matches no preset.
 */
export function tuitionRangeKeyOf(
  filters: Pick<SearchFilters, "minTuition" | "maxTuition">,
): TuitionRangeKey | "" {
  const match = TUITION_RANGES.find(
    (range) =>
      range.min === filters.minTuition && range.max === filters.maxTuition,
  );
  return match ? match.key : "";
}

/** Upper bound in EGP per year for each onboarding budget band. */
export const BUDGET_BAND_CEILING: Record<string, number> = {
  UNDER_100K: 100_000,
  B100_200K: 200_000,
  B200_300K: 300_000,
  B300_500K: 500_000,
  OVER_500K: Number.POSITIVE_INFINITY,
};

/** Parse `URLSearchParams`-style input into filters, dropping invalid values. */
export function parseSearchFilters(
  input: Record<string, string | string[] | undefined>,
): SearchFilters {
  const flat: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(input)) {
    flat[key] = Array.isArray(value) ? value.join(",") : value;
  }

  const parsed = searchFiltersSchema.safeParse(flat);
  return parsed.success ? parsed.data : searchFiltersSchema.parse({});
}

/** Serialise filters back to a query string, omitting defaults and empties. */
export function filtersToSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();

  const setList = (key: string, values?: readonly string[]) => {
    if (values && values.length > 0) params.set(key, values.join(","));
  };

  if (filters.q) params.set("q", filters.q);
  setList("fields", filters.fields);
  setList("levels", filters.levels);
  setList("cities", filters.cities);
  setList("universities", filters.universities);
  setList("universityTypes", filters.universityTypes);
  setList("tags", filters.tags);
  if (filters.minTuition != null) params.set("minTuition", String(filters.minTuition));
  if (filters.maxTuition != null) params.set("maxTuition", String(filters.maxTuition));
  if (filters.budgetBand) params.set("budgetBand", filters.budgetBand);
  if (filters.intakeYear) params.set("intakeYear", String(filters.intakeYear));
  if (filters.intakeSeason) params.set("intakeSeason", filters.intakeSeason);
  if (filters.sort !== "match") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params;
}

/** True when anything beyond the defaults is set. */
export function hasActiveFilters(filters: SearchFilters): boolean {
  return filtersToSearchParams({ ...filters, page: 1 }).toString().length > 0;
}

/** Number of distinct filter facets in play, for the "Filters (n)" badge. */
export function countActiveFilters(filters: SearchFilters): number {
  let count = 0;
  if (filters.fields?.length) count += 1;
  if (filters.levels?.length) count += 1;
  if (filters.cities?.length) count += 1;
  if (filters.universities?.length) count += 1;
  if (filters.universityTypes?.length) count += 1;
  if (filters.tags?.length) count += filters.tags.length;
  if (filters.minTuition != null || filters.maxTuition != null) count += 1;
  if (filters.budgetBand) count += 1;
  if (filters.intakeYear || filters.intakeSeason) count += 1;
  return count;
}
