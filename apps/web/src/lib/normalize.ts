// Text normalization for bilingual search (SRS FR-SR-03).
// Applies Arabic letter normalization + diacritic/tatweel stripping so that
// أ/ا/إ, ة/ه and ى/ي are treated as equivalent, and lowercases Latin text.

const ARABIC_DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
const TATWEEL = /ـ/g;

export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, "")
    .replace(TATWEEL, "")
    .replace(/[آأإٱ]/g, "ا") // آأإٱ -> ا
    .replace(/ة/g, "ه") // ة -> ه
    .replace(/ى/g, "ي") // ى -> ي
    .replace(/ؤ/g, "و") // ؤ -> و
    .replace(/ئ/g, "ي") // ئ -> ي
    .replace(/\s+/g, " ");
}

/** True if `haystack` contains `needle` after normalizing both. */
export function matches(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalize(haystack).includes(normalize(needle));
}
