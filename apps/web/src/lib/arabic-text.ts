// Shared Arabic text-matching helper used by the raw `contains` search paths
// in catalog.ts and faculty-search.ts. Kept separate from lib/search-query.ts's
// `normalize()` (used for the AI search bar's vocabulary matching) since
// these two need different shapes: normalize() folds a string so two
// normalized strings can be compared for equality/containment, while what a
// Prisma `contains` filter needs is a set of literal variants to OR together
// against an un-normalized database column.

const ALIF_FORMS = ["ا", "أ", "إ", "آ", "ٱ"];
const ALIF_SET = new Set(ALIF_FORMS);

/**
 * All hamza/madda spellings of `word`'s alif letters — e.g. "اكتوبر" (plain
 * alif) also yields "أكتوبر" (hamza-above), so a search for one finds
 * content stored with the other. This is the single most common Arabic
 * search miss: most keyboards/IMEs don't reliably autocomplete the hamza,
 * so users type whichever form is easiest and expect it to just work.
 *
 * Capped: real words in this app's data have at most 1-2 alif letters, so
 * the combinatorial expansion stays tiny (4 or 16 variants) — the cap is
 * just a safety net against a pathological input blowing up a `contains`
 * OR-list.
 */
export function arabicAlifVariants(word: string, maxVariants = 16): string[] {
  const positions: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (ALIF_SET.has(word[i])) positions.push(i);
  }
  if (positions.length === 0) return [word];

  let variants = [word];
  for (const pos of positions) {
    if (variants.length * ALIF_FORMS.length > maxVariants) break;
    const next: string[] = [];
    for (const variant of variants) {
      for (const form of ALIF_FORMS) {
        next.push(variant.slice(0, pos) + form + variant.slice(pos + 1));
      }
    }
    variants = next;
  }
  return [...new Set(variants)];
}
