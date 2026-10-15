// Search analytics: one SearchLog row per search a visitor runs. Read by the
// admin statistics (top terms, searches with no results, most searched
// universities). Never allowed to slow down or break the search itself.

import { prisma } from "@/lib/prisma";

export type SearchSource = "search_page" | "directory" | "quick_search" | "hero";

export async function logSearch(entry: {
  query: string;
  mode: "faculties" | "universities";
  source: SearchSource;
  locale?: string | null;
  resultCount?: number | null;
  universityId?: string | null;
  universitySlug?: string | null;
  userId?: string | null;
}) {
  const query = entry.query.trim().replace(/\s+/g, " ").slice(0, 200);
  if (!query) return;
  try {
    let universityId = entry.universityId ?? null;
    if (!universityId && entry.universitySlug) {
      universityId =
        (await prisma.university.findUnique({ where: { slug: entry.universitySlug }, select: { id: true } }))?.id ?? null;
    }
    await prisma.searchLog.create({
      data: {
        query,
        mode: entry.mode,
        source: entry.source,
        locale: entry.locale ?? null,
        resultCount: entry.resultCount ?? null,
        universityId,
        userId: entry.userId ?? null,
      },
    });
  } catch (error) {
    console.error("Unable to log the search", error);
  }
}
