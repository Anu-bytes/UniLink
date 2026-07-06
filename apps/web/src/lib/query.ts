import { isLocale, type Locale } from "@/i18n/config";
import type {
  UniversityFilters,
  SortKey,
  DegreeType,
  FieldOfStudyId,
  FeeBucketId,
  NationalOrInternational,
} from "./types";

const FIELD_IDS: FieldOfStudyId[] = [
  "business", "engineering", "cs-ai-it", "medicine", "pharmacy", "dentistry",
  "media", "arts-design", "law", "economics-poli", "education", "languages",
  "tourism", "applied-sciences", "social-sciences",
];
const FEE_IDS: FeeBucketId[] = ["budget", "mid", "upper-mid", "premium", "elite"];
const SORTS: SortKey[] = ["relevance", "fees_asc", "fees_desc", "name", "distance"];

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function readAll(p: Params, key: string): string[] {
  if (p instanceof URLSearchParams) {
    return p.getAll(key).flatMap((v) => v.split(",")).map((s) => s.trim()).filter(Boolean);
  }
  const v = p[key];
  if (v == null) return [];
  return (Array.isArray(v) ? v : [v]).flatMap((x) => x.split(",")).map((s) => s.trim()).filter(Boolean);
}

function readOne(p: Params, key: string): string | undefined {
  return readAll(p, key)[0];
}

function toInt(v: string | undefined): number | undefined {
  if (v == null) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parseLocale(p: Params, fallback: Locale = "en"): Locale {
  const l = readOne(p, "lang");
  return l && isLocale(l) ? l : fallback;
}

export function parseFilters(p: Params): UniversityFilters {
  const field = readAll(p, "field").filter((v): v is FieldOfStudyId =>
    (FIELD_IDS as string[]).includes(v),
  );
  const feeBucket = readAll(p, "fee_bucket").filter((v): v is FeeBucketId =>
    (FEE_IDS as string[]).includes(v),
  );
  const degreeRaw = readOne(p, "degree_type");
  const degreeType: DegreeType | undefined =
    degreeRaw === "undergraduate" || degreeRaw === "postgraduate" ? degreeRaw : undefined;
  const natRaw = readOne(p, "national_intl");
  const nationalIntl: NationalOrInternational | undefined =
    natRaw === "national" || natRaw === "international" ? natRaw : undefined;

  return {
    q: readOne(p, "q"),
    field: field.length ? field : undefined,
    degreeType,
    feeBucket: feeBucket.length ? feeBucket : undefined,
    minFees: toInt(readOne(p, "min_fees")),
    maxFees: toInt(readOne(p, "max_fees")),
    city: readAll(p, "city").length ? readAll(p, "city") : undefined,
    nationalIntl,
  };
}

export function parseSort(p: Params, fallback: SortKey = "relevance"): SortKey {
  const s = readOne(p, "sort");
  return s && (SORTS as string[]).includes(s) ? (s as SortKey) : fallback;
}

export function parsePage(p: Params): { page: number; pageSize: number } {
  return {
    page: Math.max(1, toInt(readOne(p, "page")) ?? 1),
    pageSize: Math.min(48, Math.max(1, toInt(readOne(p, "page_size")) ?? 12)),
  };
}
