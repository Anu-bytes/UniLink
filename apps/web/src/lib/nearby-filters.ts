// The "Find nearest" filters and their URL form. Kept free of server
// imports so the map's client components can use them.

import { TUITION_RANGES, type TuitionRangeKey } from "@/lib/program-filters";

export const NEARBY_LEVELS = ["BACHELOR", "MASTER", "DOCTORATE", "DIPLOMA", "CERTIFICATE"] as const;
export type NearbyLevel = (typeof NEARBY_LEVELS)[number];

/** Quick picks beside the distance slider. */
export const NEARBY_RADII = [10, 25, 50, 100] as const;
export const NEARBY_RADIUS_MIN = 5;
export const NEARBY_RADIUS_MAX = 150;

/** A whole number of kilometres the slider can produce. */
export function isNearbyRadius(value: number) {
  return Number.isInteger(value) && value >= NEARBY_RADIUS_MIN && value <= NEARBY_RADIUS_MAX;
}

/** Yearly budget brackets: the same ones as the program search filter. */
export const NEARBY_BUDGETS = TUITION_RANGES.map((range) => range.key);
export type NearbyBudget = TuitionRangeKey;

export function isNearbyBudget(value: unknown): value is NearbyBudget {
  return typeof value === "string" && (NEARBY_BUDGETS as string[]).includes(value);
}

/** Filters as they travel in the /nearby URL. The visitor's location never does. */
export type NearbyFilters = {
  field: string | null;
  level: NearbyLevel | null;
  type: "NATIONAL" | "PRIVATE" | null;
  /** Tuition bracket, or null for any budget. */
  budget: NearbyBudget | null;
  /** Kilometres, or null for any distance. */
  radius: number | null;
  /** How to get the starting point: ask the browser, or let the visitor pick. */
  start: "locate" | "pick";
};

export function parseNearbyFilters(
  params: Record<string, string | string[] | undefined>,
  fields: readonly string[],
): NearbyFilters {
  const one = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };
  const field = one("field");
  const type = one("type");
  const radius = Number(one("radius"));
  const budget = one("budget");
  return {
    field: field && fields.includes(field) ? field : null,
    // Study level is no longer a filter on the map; old links drop it.
    level: null,
    type: type === "NATIONAL" || type === "PRIVATE" ? type : null,
    budget: isNearbyBudget(budget) ? budget : null,
    radius: isNearbyRadius(radius) ? radius : null,
    start: one("start") === "pick" ? "pick" : "locate",
  };
}

/** The /nearby path (without locale) for a set of filters. */
export function nearbyHref(filters: NearbyFilters) {
  const params = new URLSearchParams();
  if (filters.field) params.set("field", filters.field);
  if (filters.level) params.set("level", filters.level);
  if (filters.type) params.set("type", filters.type);
  if (filters.budget) params.set("budget", filters.budget);
  if (filters.radius) params.set("radius", String(filters.radius));
  if (filters.start === "pick") params.set("start", "pick");
  const query = params.toString();
  return `/nearby${query ? `?${query}` : ""}`;
}

/** True when any filter narrows a university down to some of its programs. */
export function filtersPrograms(filters: NearbyFilters) {
  return Boolean(filters.field || filters.level || filters.budget);
}

/**
 * Whether a program passes the field, level and budget filters. As in the
 * program search, a program with no fee on file is kept by a budget filter.
 */
export function programMatches(
  program: { field: string; level: string; fee: number | null },
  filters: NearbyFilters,
) {
  if (filters.field && program.field !== filters.field) return false;
  if (filters.level && program.level !== filters.level) return false;
  if (filters.budget && program.fee !== null) {
    const range = TUITION_RANGES.find((entry) => entry.key === filters.budget)!;
    if (range.min !== undefined && program.fee < range.min) return false;
    if (range.max !== undefined && program.fee > range.max) return false;
  }
  return true;
}

/**
 * Where a guest goes to register or sign in from the map. Both carry the map
 * URL back: the login form follows it, and the registration wizard offers a
 * way back to the map at the end (see isNearbyReturn).
 */
export function nearbyAuthHrefs(returnTo: string) {
  const back = encodeURIComponent(returnTo);
  return { signup: `/onboarding?callbackUrl=${back}`, login: `/login?callbackUrl=${back}` };
}

/** A return address the registration wizard may follow: this site's map only. */
export function isNearbyReturn(url: string | null | undefined): url is string {
  return Boolean(url && /^\/(?:ar|en)\/nearby(?:[?#]|$)/.test(url));
}
