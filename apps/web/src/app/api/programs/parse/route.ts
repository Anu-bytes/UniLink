import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { filtersToSearchParams } from "@/lib/program-filters";
import { getSearchVocabulary } from "@/lib/program-search";
import { parseSearchQuery } from "@/lib/search-query";

const bodySchema = z.object({
  query: z.string().trim().min(1).max(200),
  locale: z.string().max(10).optional(),
});

/**
 * Turns the free-text search box into a filter query string. The search page
 * runs the same parser server-side, so this route only exists to give the
 * input instant feedback before navigating.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const vocabulary = await getSearchVocabulary();
  const result = parseSearchQuery(
    parsed.data.query,
    vocabulary,
    parsed.data.locale ?? "en",
  );

  return NextResponse.json({
    search: filtersToSearchParams(result.filters).toString(),
    matched: result.matched,
    unmatched: result.unmatched,
  });
}
