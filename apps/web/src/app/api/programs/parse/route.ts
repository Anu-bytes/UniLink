import { NextResponse } from "next/server";
import { z } from "zod";

import { filtersToSearchParams } from "@/lib/program-filters";
import { getSearchVocabulary } from "@/lib/program-search";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { parseSearchQuery } from "@/lib/search-query";

const bodySchema = z.object({
  query: z.string().trim().min(1).max(200),
  locale: z.string().max(10).optional(),
});

/**
 * Turns free text into a filter query string. Used two ways: the in-app
 * search bar (signed-in) calls it right before navigating to results, and
 * the homepage's live preview (signed-out) calls it on every keystroke to
 * show what the AI parser resolves the query to, without needing an account:
 * it only ever returns interpreted labels, never search results, so
 * there's nothing here that needs to be gated behind a session. Open to
 * anonymous callers means it needs its own rate limit instead of relying on
 * auth to keep it from being hammered.
 */
export async function POST(request: Request) {
  if (!rateLimit(`parse:ip:${clientIp(request)}`, { limit: 60, windowMs: 30_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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
