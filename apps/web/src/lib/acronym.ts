// Acronym generation for search.
//
// Students type "BUE ics", not "The British University in Egypt Faculty of
// Informatics and Computer Science". The parser matches whole phrases, so the
// acronyms have to exist in its vocabulary as terms in their own right.

/**
 * Words that never contribute a letter to an acronym. Articles and
 * prepositions are dropped in both scripts.
 */
const ACRONYM_SKIP = new Set([
  "the", "of", "in", "and", "for", "at", "a", "an", "on",
  "في", "و", "من", "على", "ال",
]);

/**
 * Words dropped only for faculty acronyms. "Faculty of Informatics and
 * Computer Science" should give ICS, not FICS, because the leading noun is
 * shared by every faculty and carries no distinguishing information.
 */
const FACULTY_SKIP = new Set([
  "faculty", "faculties", "school", "college", "institute", "department",
  "كلية", "الكلية", "معهد", "المعهد", "قسم", "القسم",
]);

/** Strips the Arabic definite article so "الهندسة" contributes "ه" not "ا". */
function stripArabicArticle(word: string) {
  return word.length > 2 && word.startsWith("ال") ? word.slice(2) : word;
}

function initialsOf(name: string, skip: Set<string>): string {
  return name
    .split(/[\s,\-/()]+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .filter((word) => !skip.has(word.toLowerCase()))
    .map((word) => stripArabicArticle(word)[0] ?? "")
    .join("");
}

/**
 * Acronyms for a university name, longest first.
 *
 * "The British University in Egypt" gives BUE. Names with many words also get
 * a shortened head, so the Arab Academy resolves from either AASTMT or AAST.
 * Returns an empty array for anything under two letters, which would be too
 * noisy to match on.
 */
export function universityAcronyms(name: string): string[] {
  const full = initialsOf(name, ACRONYM_SKIP);
  if (full.length < 2) return [];

  const variants = new Set<string>([full]);
  // Long names are commonly shortened to their first four initials.
  if (full.length > 4) variants.add(full.slice(0, 4));

  return [...variants];
}

/**
 * Acronyms for a faculty name, with the generic leading noun removed.
 *
 * "Faculty of Informatics and Computer Science" gives ICS. Single-letter
 * results such as "Faculty of Engineering" are dropped: a lone "E" would match
 * far too much.
 */
export function facultyAcronyms(name: string): string[] {
  const skip = new Set([...ACRONYM_SKIP, ...FACULTY_SKIP]);
  const acronym = initialsOf(name, skip);
  return acronym.length >= 2 ? [acronym] : [];
}
