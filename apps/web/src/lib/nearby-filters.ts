// The "Find nearest" filters and their URL form. Kept free of server
// imports so the map's client components can use them.

export const NEARBY_LEVELS = ["BACHELOR", "MASTER", "DOCTORATE", "DIPLOMA", "CERTIFICATE"] as const;
export type NearbyLevel = (typeof NEARBY_LEVELS)[number];

export const NEARBY_RADII = [10, 25, 50, 100] as const;

/** Filters as they travel in the /nearby URL. The visitor's location never does. */
export type NearbyFilters = {
  field: string | null;
  level: NearbyLevel | null;
  type: "NATIONAL" | "PRIVATE" | null;
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
  const level = one("level");
  const type = one("type");
  const radius = Number(one("radius"));
  return {
    field: field && fields.includes(field) ? field : null,
    level: NEARBY_LEVELS.includes(level as NearbyLevel) ? (level as NearbyLevel) : null,
    type: type === "NATIONAL" || type === "PRIVATE" ? type : null,
    radius: (NEARBY_RADII as readonly number[]).includes(radius) ? radius : null,
    start: one("start") === "pick" ? "pick" : "locate",
  };
}

/** The /nearby path (without locale) for a set of filters. */
export function nearbyHref(filters: NearbyFilters) {
  const params = new URLSearchParams();
  if (filters.field) params.set("field", filters.field);
  if (filters.level) params.set("level", filters.level);
  if (filters.type) params.set("type", filters.type);
  if (filters.radius) params.set("radius", String(filters.radius));
  if (filters.start === "pick") params.set("start", "pick");
  const query = params.toString();
  return `/nearby${query ? `?${query}` : ""}`;
}
