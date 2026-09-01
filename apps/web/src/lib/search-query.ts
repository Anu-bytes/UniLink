// Deterministic natural-language search. Turns a free-text query like
// "computer science bachelor in cairo under 100k with a scholarship" or
// "هندسة بكالوريوس في القاهرة اقل من ١٠٠ الف" into the same `SearchFilters`
// object the filter panel produces, plus the list of terms it understood so the
// UI can show them back as resolved chips.
//
// No model call is involved: everything is phrase matching against the app's
// own vocabularies (fields of study, university and city names, study levels)
// and a small set of budget and perk patterns.

import { facultyAcronyms, universityAcronyms } from "@/lib/acronym";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { STUDY_LEVELS } from "@/lib/onboarding-schema";
import type {
  ProgramTagValue,
  SearchFilters,
} from "@/lib/program-filters";
import { searchFiltersSchema } from "@/lib/program-filters";

export type Vocabulary = {
  universities: { slug: string; name: string; nameAr: string | null }[];
  cities: { value: string; en: string; ar: string | null }[];
  faculties: {
    id: string;
    name: string;
    nameAr: string | null;
    universityName: string;
  }[];
};

export type MatchedTerm = {
  kind:
    | "field"
    | "level"
    | "city"
    | "university"
    | "faculty"
    | "type"
    | "tag"
    | "budget";
  /** Label to show on the resolved chip, already in the request's locale. */
  label: string;
  /** The filter value this term resolved to. */
  value: string;
};

export type ParsedQuery = {
  filters: SearchFilters;
  matched: MatchedTerm[];
  /** Words the parser could not attribute to any filter. */
  unmatched: string[];
};

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

// Harakat (U+064B-U+065F), superscript alef and tatweel. Written as escapes
// so the range cannot swallow the Arabic-Indic digits at U+0660-U+0669.
const ARABIC_DIACRITICS = /[ً-ٰٟـ]/g;
const ARABIC_INDIC_DIGITS = /[٠-٩۰-۹]/g;

/**
 * Fold a string so Arabic spelling variants and Latin casing stop mattering:
 * strips diacritics and tatweel, unifies alef/ya/ta-marbuta, converts
 * Arabic-Indic digits to Latin, and collapses punctuation to single spaces.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, "")
    .replace(ARABIC_INDIC_DIGITS, (digit) =>
      String(digit.charCodeAt(0) >= 0x06f0 ? digit.charCodeAt(0) - 0x06f0 : digit.charCodeAt(0) - 0x0660),
    )
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ـ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Static vocabularies
// ---------------------------------------------------------------------------

const LEVEL_TERMS: { value: (typeof STUDY_LEVELS)[number]; terms: string[] }[] = [
  { value: "BACHELOR", terms: ["bachelor", "bachelors", "undergraduate", "bsc", "ba", "بكالوريوس", "ليسانس"] },
  { value: "MASTER", terms: ["master", "masters", "msc", "ma", "postgraduate", "ماجستير"] },
  { value: "DOCTORATE", terms: ["phd", "doctorate", "doctoral", "دكتوراه"] },
  { value: "DIPLOMA", terms: ["diploma", "دبلوم", "دبلومه"] },
  { value: "CERTIFICATE", terms: ["certificate", "شهاده"] },
];

const TYPE_TERMS: { value: "PUBLIC" | "PRIVATE" | "SPECIALIZED"; terms: string[] }[] = [
  { value: "PUBLIC", terms: ["public university", "public", "government", "حكوميه", "حكومي", "حكوميه"] },
  { value: "PRIVATE", terms: ["private university", "private", "خاصه", "خاص"] },
  { value: "SPECIALIZED", terms: ["specialized", "specialised", "technological", "متخصصه", "تكنولوجيه"] },
];

const TAG_TERMS: { value: ProgramTagValue; terms: string[] }[] = [
  {
    value: "SCHOLARSHIPS_AVAILABLE",
    terms: ["scholarship", "scholarships", "منحه", "منح", "منحه دراسيه"],
  },
  {
    value: "WAIVED_APPLICATION_FEE",
    terms: [
      "waived application fee",
      "waived fee",
      "no application fee",
      "free application",
      "بدون رسوم",
      "رسوم مجانيه",
      "بدون مصاريف تقديم",
    ],
  },
  {
    value: "FAST_ACCEPTANCE",
    terms: ["fast acceptance", "fast admission", "quick acceptance", "قبول سريع"],
  },
  {
    value: "FINANCIAL_AID_AVAILABLE",
    terms: ["financial aid", "aid", "مساعده ماليه", "دعم مالي"],
  },
  {
    value: "HIGH_JOB_DEMAND",
    terms: ["high job demand", "job demand", "in demand", "مطلوب في سوق العمل", "سوق العمل"],
  },
  {
    value: "CREDIT_HOURS",
    terms: ["credit hours", "credit hour", "ساعات معتمده"],
  },
];

// Words that carry no filtering signal, dropped from `unmatched`.
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "at", "on", "of", "for", "to", "with", "and", "or",
  "i", "want", "study", "studying", "program", "programs", "programme",
  "degree", "degrees", "university", "universities", "college", "faculty",
  "egypt", "please", "find", "me", "show", "looking", "search", "best", "top",
  "في", "من", "عن", "على", "مع", "و", "او", "ال", "الي", "اريد", "ابحث", "عايز",
  "دراسه", "برنامج", "برامج", "جامعه", "جامعات", "كليه", "مصر", "افضل", "احسن",
]);

// ---------------------------------------------------------------------------
// Budget patterns
// ---------------------------------------------------------------------------

const THOUSAND_WORDS = ["k", "thousand", "الف", "ألف"];
const MILLION_WORDS = ["m", "million", "مليون"];

const UNDER_WORDS = ["under", "below", "less than", "up to", "max", "maximum", "اقل من", "تحت", "حتي", "في حدود"];
const OVER_WORDS = ["over", "above", "more than", "at least", "min", "minimum", "اكثر من", "فوق", "علي الاقل"];

/**
 * Find a tuition bound in the query, e.g. "under 100k", "اقل من ١٥٠ الف",
 * "less than 250,000". Returns the matched phrase so it can be shown as a chip.
 */
function parseBudget(text: string): {
  minTuition?: number;
  maxTuition?: number;
  phrase: string;
} | null {
  const magnitude = `(?:${[...THOUSAND_WORDS, ...MILLION_WORDS].join("|")})?`;
  const numberPattern = `(\\d+(?:\\.\\d+)?)\\s*${magnitude}`;

  const build = (words: string[]) =>
    new RegExp(`(?:${words.join("|")})\\s*${numberPattern}`, "u");

  const applyMagnitude = (raw: string, whole: string) => {
    const value = Number(raw);
    const tail = whole.slice(whole.indexOf(raw) + raw.length).trim();
    if (MILLION_WORDS.some((word) => tail.startsWith(word))) return value * 1_000_000;
    if (THOUSAND_WORDS.some((word) => tail.startsWith(word))) return value * 1_000;
    // A bare small number in a tuition context is read as thousands.
    return value < 1000 ? value * 1_000 : value;
  };

  const under = build(UNDER_WORDS).exec(text);
  if (under) {
    return { maxTuition: applyMagnitude(under[1], under[0]), phrase: under[0].trim() };
  }

  const over = build(OVER_WORDS).exec(text);
  if (over) {
    return { minTuition: applyMagnitude(over[1], over[0]), phrase: over[0].trim() };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

type Candidate = {
  needle: string;
  kind: MatchedTerm["kind"];
  value: string;
  label: string;
};

function buildCandidates(vocabulary: Vocabulary, locale: string): Candidate[] {
  const isArabic = locale.startsWith("ar");
  const candidates: Candidate[] = [];

  const push = (
    kind: MatchedTerm["kind"],
    value: string,
    label: string,
    terms: (string | null | undefined)[],
  ) => {
    for (const term of terms) {
      const needle = term ? normalize(term) : "";
      if (needle.length >= 2) candidates.push({ needle, kind, value, label });
    }
  };

  for (const field of FIELDS_OF_STUDY) {
    push("field", field.value, isArabic ? field.ar : field.en, [
      field.en,
      field.ar,
      // "computer science" should also match a bare "cs" style shorthand.
      field.value.replace(/_/g, " "),
    ]);
  }

  for (const university of vocabulary.universities) {
    push(
      "university",
      university.slug,
      isArabic && university.nameAr ? university.nameAr : university.name,
      [
        university.name,
        university.nameAr,
        // "BUE" resolves the same as the full name.
        ...universityAcronyms(university.name),
      ],
    );
  }

  for (const faculty of vocabulary.faculties) {
    push(
      "faculty",
      faculty.id,
      isArabic && faculty.nameAr ? faculty.nameAr : faculty.name,
      [
        faculty.name,
        faculty.nameAr,
        // "ICS" for "Faculty of Informatics and Computer Science".
        ...facultyAcronyms(faculty.name),
      ],
    );
  }

  for (const city of vocabulary.cities) {
    push("city", city.value, isArabic && city.ar ? city.ar : city.en, [city.en, city.ar]);
  }

  for (const level of LEVEL_TERMS) {
    push("level", level.value, level.terms[0], level.terms);
  }

  for (const type of TYPE_TERMS) {
    push("type", type.value, type.terms[0], type.terms);
  }

  for (const tag of TAG_TERMS) {
    push("tag", tag.value, tag.terms[0], tag.terms);
  }

  // Longest needle first, so "computer science" wins over "science".
  return candidates.sort((a, b) => b.needle.length - a.needle.length);
}

type Span = { index: number; length: number };

/** Whole-phrase containment, so "art" does not match inside "smart". */
function findPhrase(haystack: string, needle: string): Span | null {
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`, "u");
  const match = pattern.exec(haystack);
  return match ? { index: match.index, length: needle.length } : null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Levenshtein edit distance, but gives up the moment it's clear the result
 * will exceed `max`. This runs against every candidate word in the query,
 * so a query with a typo shouldn't cost more than one without.
 */
function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prevRow = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(row[j - 1] + 1, prevRow[j] + 1, prevRow[j - 1] + cost);
      row.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    prevRow = row;
  }
  return prevRow[b.length];
}

/**
 * Typo-tolerant fallback for names only (university/faculty/city): slides a
 * window the same length as `needle`'s word count across `haystack`'s
 * words, allowing roughly one edit per 4 letters per word (one missed,
 * extra, or wrong letter), so "amreican univercity" still resolves to
 * "American University". Words of 3 letters or fewer require an exact
 * match, short words like city abbreviations are too easy to confuse with
 * an unrelated word under fuzzy matching. Deliberately not used for
 * fields/levels/types/tags: that's a small controlled vocabulary where a
 * wrong fuzzy guess is more likely than a genuine typo.
 */
function findPhraseFuzzy(haystack: string, needle: string): Span | null {
  const needleWords = needle.split(" ").filter(Boolean);
  if (needleWords.length === 0) return null;

  const words: Span[] = [];
  const wordPattern = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = wordPattern.exec(haystack))) {
    words.push({ index: match.index, length: match[0].length });
  }

  outer: for (let start = 0; start <= words.length - needleWords.length; start++) {
    for (let k = 0; k < needleWords.length; k++) {
      const span = words[start + k];
      const word = haystack.slice(span.index, span.index + span.length);
      const needleWord = needleWords[k];
      if (word === needleWord) continue;
      if (needleWord.length <= 3) continue outer;
      const allowed = Math.max(1, Math.floor(needleWord.length / 4));
      if (levenshtein(word, needleWord, allowed) > allowed) continue outer;
    }
    const first = words[start];
    const last = words[start + needleWords.length - 1];
    return { index: first.index, length: last.index + last.length - first.index };
  }
  return null;
}

export function parseSearchQuery(
  query: string,
  vocabulary: Vocabulary,
  locale = "en",
): ParsedQuery {
  const base = searchFiltersSchema.parse({});
  const trimmed = query.trim();

  if (!trimmed) {
    return { filters: base, matched: [], unmatched: [] };
  }

  let text = ` ${normalize(trimmed)} `;
  const matched: MatchedTerm[] = [];
  const seen = new Set<string>();

  // Budget first: its phrase contains numbers that no other candidate uses.
  const budget = parseBudget(text);
  if (budget) {
    text = text.replace(budget.phrase, " ");
  }

  const isName = (kind: MatchedTerm["kind"]) =>
    kind === "university" || kind === "faculty" || kind === "city";

  for (const candidate of buildCandidates(vocabulary, locale)) {
    const key = `${candidate.kind}:${candidate.value}`;
    if (seen.has(key)) continue;

    // Exact match first (cheap, and the common case); a name that isn't
    // found verbatim gets one more attempt tolerating a typo before giving
    // up on that candidate entirely.
    const span =
      findPhrase(text, candidate.needle) ??
      (isName(candidate.kind) ? findPhraseFuzzy(text, candidate.needle) : null);
    if (!span) continue;

    seen.add(key);
    matched.push({ kind: candidate.kind, value: candidate.value, label: candidate.label });
    // Blank the span so shorter candidates cannot match inside it.
    text = `${text.slice(0, span.index)} ${text.slice(span.index + span.length)}`;
  }

  const collect = (kind: MatchedTerm["kind"]) =>
    matched.filter((term) => term.kind === kind).map((term) => term.value);

  const fields = collect("field");
  const levels = collect("level") as SearchFilters["levels"];
  const cities = collect("city");
  const universities = collect("university");
  const faculties = collect("faculty");
  const universityTypes = collect("type") as SearchFilters["universityTypes"];
  const tags = collect("tag") as SearchFilters["tags"];

  const filters: SearchFilters = {
    ...base,
    q: trimmed,
    ...(fields.length ? { fields } : {}),
    ...(levels?.length ? { levels } : {}),
    ...(cities.length ? { cities } : {}),
    ...(universities.length ? { universities } : {}),
    ...(faculties.length ? { faculties } : {}),
    ...(universityTypes?.length ? { universityTypes } : {}),
    ...(tags?.length ? { tags } : {}),
    ...(budget?.maxTuition != null ? { maxTuition: budget.maxTuition } : {}),
    ...(budget?.minTuition != null ? { minTuition: budget.minTuition } : {}),
  };

  if (budget) {
    const amount = budget.maxTuition ?? budget.minTuition ?? 0;
    matched.push({
      kind: "budget",
      value: String(amount),
      label: budget.phrase,
    });
  }

  const unmatched = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));

  return { filters, matched, unmatched };
}
