/** Existing catalogue uses the TOEFL 0–120 scale. */
export const ENGLISH_SCORE_MAX = { IELTS: 9, TOEFL: 120, PTE: 90, DUOLINGO: 160, NONE: 0 } as const;

export function validEnglishScore(test: keyof typeof ENGLISH_SCORE_MAX, score: number) {
  return Number.isFinite(score) && score > 0 && score <= ENGLISH_SCORE_MAX[test];
}

export function validMinimumScore(unit: string, score: number) {
  return Number.isFinite(score) && score >= 0 && score <= (unit === "PERCENT" ? 100 : 9999.99);
}

// Keep every offset within Prisma's signed 32-bit integer range, even at 100/page.
export const MAX_ADMIN_PAGE = 1_000_000;
export function adminPage(value: string | null | undefined) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? Math.min(parsed, MAX_ADMIN_PAGE) : 1;
}
