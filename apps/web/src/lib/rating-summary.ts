// Pure rating maths, shared by the server (lib/university-ratings) and the
// rating card in the browser, so the card doesn't pull in the database client.

export type RatingSummary = {
  /** Mean of all ratings, one decimal; null when nobody has rated yet. */
  average: number | null;
  count: number;
  /** How many ratings gave 1..5 stars (index 0 is one star). */
  distribution: [number, number, number, number, number];
  /** The signed-in visitor's own rating, if any. */
  mine: number | null;
};

export const MIN_STARS = 1;
export const MAX_STARS = 5;

export function summarize(
  distribution: RatingSummary["distribution"],
  mine: number | null,
): RatingSummary {
  const count = distribution.reduce((sum, n) => sum + n, 0);
  const total = distribution.reduce((sum, n, i) => sum + n * (i + 1), 0);
  return {
    average: count > 0 ? Math.round((total / count) * 10) / 10 : null,
    count,
    distribution,
    mine,
  };
}
