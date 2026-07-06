import { UNIVERSITIES } from "@/data/universities";
import { FIELDS, getField } from "@/data/fields";
import { getFeeBucket, overlapsBucket } from "@/data/fee-buckets";
import { matches, normalize } from "./normalize";
import { distanceKm, withinBBox, type BBox } from "./geo";
import { pick } from "./format";
import type { Locale } from "@/i18n/config";
import type {
  University,
  UniversityFilters,
  UniversitySummary,
  SortKey,
  Paginated,
  Program,
  SearchGroup,
  SearchHit,
  Bilingual,
  DegreeType,
  FieldOfStudyId,
} from "./types";

export interface ProgramListItem {
  id: string;
  name: Bilingual;
  degreeType: DegreeType;
  fieldOfStudy: FieldOfStudyId;
  minFees: number;
  maxFees: number;
  durationYears: number;
  university: { id: string; slug: string; name: Bilingual; city: Bilingual };
  faculty: Bilingual;
  department: Bilingual;
}

export interface LatLng {
  lat: number;
  lng: number;
}

// --- program-level predicate (field, degree, fees) -------------------------

function programPasses(p: Program, f: UniversityFilters): boolean {
  if (f.degreeType && p.degreeType !== f.degreeType) return false;
  if (f.field?.length && !f.field.includes(p.fieldOfStudy)) return false;
  if (f.feeBucket?.length) {
    const ok = f.feeBucket.some((id) => {
      const b = getFeeBucket(id);
      return b ? overlapsBucket(p.minFees, p.maxFees, b) : false;
    });
    if (!ok) return false;
  }
  if (f.minFees != null || f.maxFees != null) {
    const lo = f.minFees ?? -Infinity;
    const hi = f.maxFees ?? Infinity;
    if (!(p.minFees <= hi && p.maxFees >= lo)) return false;
  }
  return true;
}

function* eachProgram(u: University) {
  for (const fac of u.faculties)
    for (const dep of fac.departments)
      for (const p of dep.programs) yield { program: p, faculty: fac, department: dep };
}

function universityTextMatch(u: University, q?: string): boolean {
  if (!q) return true;
  if (matches(u.name.en, q) || matches(u.name.ar, q)) return true;
  if (matches(u.city.en, q) || matches(u.city.ar, q)) return true;
  if (matches(u.governorate.en, q) || matches(u.governorate.ar, q)) return true;
  for (const fac of u.faculties) {
    if (matches(fac.name.en, q) || matches(fac.name.ar, q)) return true;
    const field = getField(fac.fieldOfStudy);
    if (matches(field.name.en, q) || matches(field.name.ar, q)) return true;
    for (const dep of fac.departments) {
      if (matches(dep.name.en, q) || matches(dep.name.ar, q)) return true;
      for (const p of dep.programs)
        if (matches(p.name.en, q) || matches(p.name.ar, q)) return true;
    }
  }
  return false;
}

function cityMatch(u: University, cities?: string[]): boolean {
  if (!cities?.length) return true;
  const targets = cities.map((c) => normalize(c));
  const hay = [u.city.en, u.city.ar, u.governorate.en, u.governorate.ar].map(normalize);
  return targets.some((t) => hay.some((h) => h.includes(t) || t.includes(h)));
}

function universityPasses(u: University, f: UniversityFilters): boolean {
  if (!universityTextMatch(u, f.q)) return false;
  if (f.nationalIntl && u.nationalOrInternational !== f.nationalIntl) return false;
  if (!cityMatch(u, f.city)) return false;
  // Needs at least one program passing the program-level filters.
  for (const { program } of eachProgram(u)) if (programPasses(program, f)) return true;
  return false;
}

// --- summaries -------------------------------------------------------------

export function summarize(
  u: University,
  f: UniversityFilters = {},
  origin?: LatLng,
): UniversitySummary {
  const hasProgramFilter =
    !!f.degreeType || !!f.field?.length || !!f.feeBucket?.length || f.minFees != null || f.maxFees != null;

  const chosen = [...eachProgram(u)]
    .filter(({ program }) => (hasProgramFilter ? programPasses(program, f) : true))
    .map((x) => x.program);
  const progs = chosen.length ? chosen : [...eachProgram(u)].map((x) => x.program);

  const minFees = Math.min(...progs.map((p) => p.minFees));
  const maxFees = Math.max(...progs.map((p) => p.maxFees));
  const topFields = Array.from(new Set(u.faculties.map((fac) => fac.fieldOfStudy))).slice(0, 3);

  return {
    id: u.id,
    slug: u.slug,
    name: u.name,
    city: u.city,
    governorate: u.governorate,
    lat: u.lat,
    lng: u.lng,
    isVerified: u.isVerified,
    nationalOrInternational: u.nationalOrInternational,
    rating: u.rating,
    topFields,
    programCount: progs.length,
    facultyCount: u.faculties.length,
    minFees,
    maxFees,
    distanceKm: origin ? distanceKm(origin.lat, origin.lng, u.lat, u.lng) : undefined,
  };
}

// --- sorting ---------------------------------------------------------------

function sortSummaries(
  list: UniversitySummary[],
  sort: SortKey,
  locale: Locale,
): UniversitySummary[] {
  const arr = [...list];
  switch (sort) {
    case "fees_asc":
      return arr.sort((a, b) => a.minFees - b.minFees);
    case "fees_desc":
      return arr.sort((a, b) => b.minFees - a.minFees);
    case "name":
      return arr.sort((a, b) => pick(a.name, locale).localeCompare(pick(b.name, locale), locale));
    case "distance":
      return arr.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    case "relevance":
    default:
      return arr.sort(
        (a, b) => Number(b.isVerified) - Number(a.isVerified) || b.rating - a.rating,
      );
  }
}

// --- public queries --------------------------------------------------------

export interface ListOptions {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
  locale?: Locale;
  origin?: LatLng;
}

export function listUniversities(
  filters: UniversityFilters = {},
  opts: ListOptions = {},
): Paginated<UniversitySummary> {
  const { sort = "relevance", page = 1, pageSize = 12, locale = "en", origin } = opts;
  const matched = UNIVERSITIES.filter((u) => universityPasses(u, filters)).map((u) =>
    summarize(u, filters, origin),
  );
  const sorted = sortSummaries(matched, sort, locale);
  const total = sorted.length;
  const start = (page - 1) * pageSize;
  return {
    data: sorted.slice(start, start + pageSize),
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    appliedFilters: { ...filters, sort },
  };
}

export function getUniversityBySlug(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

export function getAllSlugs(): string[] {
  return UNIVERSITIES.map((u) => u.slug);
}

export function totals() {
  const programs = UNIVERSITIES.reduce(
    (n, u) => n + [...eachProgram(u)].length,
    0,
  );
  return { universities: UNIVERSITIES.length, programs, fields: FIELDS.length };
}

export function featured(limit = 6): UniversitySummary[] {
  return sortSummaries(
    UNIVERSITIES.map((u) => summarize(u)),
    "relevance",
    "en",
  ).slice(0, limit);
}

// --- geo queries -----------------------------------------------------------

export function nearby(
  origin: LatLng,
  radiusKm: number,
  filters: UniversityFilters = {},
  locale: Locale = "en",
): UniversitySummary[] {
  return sortSummaries(
    UNIVERSITIES.filter((u) => universityPasses(u, filters))
      .map((u) => summarize(u, filters, origin))
      .filter((s) => (s.distanceKm ?? Infinity) <= radiusKm),
    "distance",
    locale,
  );
}

export function within(
  bbox: BBox,
  filters: UniversityFilters = {},
  locale: Locale = "en",
): UniversitySummary[] {
  return sortSummaries(
    UNIVERSITIES.filter((u) => universityPasses(u, filters))
      .filter((u) => withinBBox(u.lat, u.lng, bbox))
      .map((u) => summarize(u, filters)),
    "relevance",
    locale,
  );
}

// --- search & autocomplete -------------------------------------------------

export function searchGroups(q: string, limit = 5): SearchGroup[] {
  const groups: SearchGroup[] = [];

  const fieldHits: SearchHit[] = FIELDS.filter(
    (f) => matches(f.name.en, q) || matches(f.name.ar, q),
  )
    .slice(0, limit)
    .map((f) => ({
      type: "field",
      id: f.id,
      title: f.name,
      href: `/search?field=${f.id}`,
      fieldOfStudy: f.id,
    }));
  if (fieldHits.length) groups.push({ type: "field", items: fieldHits });

  const uniHits: SearchHit[] = UNIVERSITIES.filter(
    (u) => matches(u.name.en, q) || matches(u.name.ar, q) || matches(u.city.en, q) || matches(u.city.ar, q),
  )
    .slice(0, limit)
    .map((u) => ({
      type: "university",
      id: u.id,
      title: u.name,
      subtitle: u.city,
      href: `/universities/${u.slug}`,
    }));
  if (uniHits.length) groups.push({ type: "university", items: uniHits });

  const progHits: SearchHit[] = [];
  for (const u of UNIVERSITIES) {
    for (const { program } of eachProgram(u)) {
      if (matches(program.name.en, q) || matches(program.name.ar, q)) {
        progHits.push({
          type: "program",
          id: program.id,
          title: program.name,
          subtitle: u.name,
          href: `/universities/${u.slug}`,
          fieldOfStudy: program.fieldOfStudy,
        });
      }
      if (progHits.length >= limit) break;
    }
    if (progHits.length >= limit) break;
  }
  if (progHits.length) groups.push({ type: "program", items: progHits });

  return groups;
}

export function autocomplete(q: string, limit = 8): SearchHit[] {
  if (!q.trim()) return [];
  return searchGroups(q, limit)
    .flatMap((g) => g.items)
    .slice(0, limit);
}

// --- programs listing (API completeness) -----------------------------------

export function listPrograms(
  filters: UniversityFilters = {},
  opts: ListOptions = {},
): Paginated<ProgramListItem> {
  const { sort = "relevance", page = 1, pageSize = 12 } = opts;
  const items: ProgramListItem[] = [];

  for (const u of UNIVERSITIES) {
    if (!universityTextMatch(u, filters.q)) continue;
    if (filters.nationalIntl && u.nationalOrInternational !== filters.nationalIntl) continue;
    if (!cityMatch(u, filters.city)) continue;
    for (const { program, faculty, department } of eachProgram(u)) {
      if (!programPasses(program, filters)) continue;
      items.push({
        id: program.id,
        name: program.name,
        degreeType: program.degreeType,
        fieldOfStudy: program.fieldOfStudy,
        minFees: program.minFees,
        maxFees: program.maxFees,
        durationYears: program.durationYears,
        university: { id: u.id, slug: u.slug, name: u.name, city: u.city },
        faculty: faculty.name,
        department: department.name,
      });
    }
  }

  if (sort === "fees_asc") items.sort((a, b) => a.minFees - b.minFees);
  else if (sort === "fees_desc") items.sort((a, b) => b.minFees - a.minFees);
  else if (sort === "name") items.sort((a, b) => a.name.en.localeCompare(b.name.en));

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    appliedFilters: { ...filters, sort },
  };
}
