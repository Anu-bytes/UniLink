import { revalidateTag, unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { MAX_STARS, MIN_STARS, summarize, type RatingSummary } from "@/lib/rating-summary";

export { MAX_STARS, MIN_STARS, type RatingSummary } from "@/lib/rating-summary";

const ratingTag = (universityId: string) => `university-rating:${universityId}`;

function countByStars(universityId: string) {
  return prisma.universityRating.groupBy({
    by: ["stars"],
    where: { universityId },
    _count: { _all: true },
  });
}

/**
 * The star counts are the same for every visitor, so they are cached per
 * university and dropped whenever someone rates it (refreshRatingCache):
 * a profile view costs no rating query, and a new rating still shows at once.
 */
function cachedCountByStars(universityId: string) {
  return unstable_cache(() => countByStars(universityId), ["university-rating-counts", universityId], {
    revalidate: 3600,
    tags: [ratingTag(universityId)],
  })();
}

/** Call after a rating is added, changed or removed. */
export function refreshRatingCache(universityId: string) {
  revalidateTag(ratingTag(universityId), { expire: 0 });
}

/**
 * The counts plus the viewer's own rating. `fresh` skips the cache, for the
 * response to a rating the viewer just changed.
 */
export async function getRatingSummary(
  universityId: string,
  userId: string | null,
  { fresh = false }: { fresh?: boolean } = {},
): Promise<RatingSummary> {
  const [groups, own] = await Promise.all([
    fresh ? countByStars(universityId) : cachedCountByStars(universityId),
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
