// Display helpers shared by the catalogue, search and compare surfaces.
// Anything that needs wording (level names, tag names) is translated in the
// components instead; this file only handles numbers and dates.

// Node and browsers resolve the default numbering system for `ar` differently
// (Node's ICU picks arab, Chrome picks latn), so an unpinned Intl call renders
// ٩٨٬٠٠٠ on the server and 98,000 on the client. That is a hydration mismatch
// in any client component, so pin the digits for every locale. Latin digits
// also keep the compare CSV export parseable by spreadsheets.
const NUMBERING_SYSTEM = "latn";

/** Currency amount with no decimals, e.g. "EGP 98,000" / "98,000 ج.م.". */
export function formatMoney(
  locale: string,
  amount: number | null | undefined,
  currency: string,
) {
  if (amount == null) return null;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    numberingSystem: NUMBERING_SYSTEM,
  }).format(amount);
}

export function formatNumber(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    numberingSystem: NUMBERING_SYSTEM,
  }).format(value);
}

/** Abbreviates large counts the way the hero meta row does: 13.9K, 1.2M. */
export function formatCompact(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
    numberingSystem: NUMBERING_SYSTEM,
  }).format(value);
}

export function formatDate(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: NUMBERING_SYSTEM,
    // Pin the zone too: the server runs in UTC while the browser uses the
    // visitor's zone, which can render a date one day out.
    timeZone: "UTC",
  }).format(date);
}

export function formatMonthYear(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    numberingSystem: NUMBERING_SYSTEM,
    timeZone: "UTC",
  }).format(date);
}

/** Whole years when the month count divides evenly, otherwise null. */
export function yearsFromMonths(months: number | null | undefined) {
  if (!months || months % 12 !== 0) return null;
  return months / 12;
}

/**
 * Palette for initials placeholders. Constrained to the brand's blue family
 * rather than a free hue rotation, which produced pinks and greens that
 * clashed with everything around them.
 */
const AVATAR_PALETTE = [
  { background: "#EEF3FF", color: "#1E3A8A" },
  { background: "#E4EEFC", color: "#1E6DEB" },
  { background: "#E7F0F6", color: "#15607D" },
  { background: "#EAEFF9", color: "#33497A" },
  { background: "#EDF1F7", color: "#3F4657" },
] as const;

/**
 * Words that carry no identity and must not supply the initial. Nearly every
 * Egyptian institution starts with "جامعة" (University), so without this every
 * placeholder in the catalogue would read the same letter.
 */
const GENERIC_NAME_WORDS = new Set([
  "the", "of", "in", "and", "for", "at",
  "university", "universities", "academy", "college", "institute", "city", "school",
  "جامعة", "الجامعة", "أكاديمية", "الأكاديمية", "مدينة", "المدينة",
  "كلية", "الكلية", "معهد", "المعهد", "في", "و", "من",
]);

/** Leading Arabic definite article, so "الإسكندرية" yields "إ" not "ا". */
function stripArabicArticle(word: string) {
  return word.length > 2 && word.startsWith("ال") ? word.slice(2) : word;
}

/**
 * Deterministic initials badge used wherever a real logo or photo is missing.
 *
 * `organization` takes a single letter from the first meaningful word: two
 * Arabic letters do not read as initials the way Latin ones do, and at the
 * sizes these render (36-56px) one glyph is simply clearer.
 */
export function initialsAvatar(
  name: string,
  kind: "person" | "organization" = "person",
) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word && !GENERIC_NAME_WORDS.has(word.toLowerCase()));

  const meaningful = words.length > 0 ? words : name.trim().split(/\s+/);

  const initials =
    kind === "organization"
      ? (stripArabicArticle(meaningful[0] ?? "")[0] ?? "").toUpperCase()
      : meaningful
          .slice(0, 2)
          .map((word) => word[0] ?? "")
          .join("")
          .toUpperCase();

  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  const swatch = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];

  return {
    initials: initials || "U",
    background: swatch.background,
    color: swatch.color,
  };
}
