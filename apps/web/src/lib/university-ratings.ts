import { prisma } from "@/lib/prisma";
import { MAX_STARS, MIN_STARS, summarize, type RatingSummary } from "@/lib/rating-summary";

export { MAX_STARS, MIN_STARS, type RatingSummary } from "@/lib/rating-summary";

/** Read fresh on every request: ratings change as people rate. */
export async function getRatingSummary(
  universityId: string,
  userId: string | null,
): Promise<RatingSummary> {
  const [groups, own] = await Promise.all([
    prisma.universityRating.groupBy({
      by: ["stars"],
      where: { universityId },
      _count: { _all: true },
    }),
    userId
      ? prisma.universityRating.findUnique({
          where: { userId_universityId: { userId, universityId } },
          select: { stars: true },
        })
      : null,
  ]);

  const distribution: RatingSummary["distribution"] = [0, 0, 0, 0, 0];
  for (const group of groups) {
    if (group.stars >= MIN_STARS && group.stars <= MAX_STARS) {
      distribution[group.stars - 1] = group._count._all;
    }
  }
  return summarize(distribution, own?.stars ?? null);
}
