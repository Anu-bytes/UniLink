// Text folding shared by the natural-language search (lib/search-query.ts)
// and the client-side instant search (components/search/*). Kept in its own
// dependency-free module so client components can import it without pulling
// in the search vocabularies.

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
