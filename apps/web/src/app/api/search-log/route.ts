import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logSearch } from "@/lib/search-log";

// Searches that happen in the browser (quick search, homepage search) report
// here with navigator.sendBeacon. Fire and forget: always 204.
const schema = z.object({
  query: z.string().trim().min(1).max(200),
  source: z.enum(["quick_search", "hero"]),
  universitySlug: z.string().trim().max(120).optional(),
  resultCount: z.number().int().min(0).max(10000).optional(),
  locale: z.enum(["en", "ar"]).optional(),
});

export async function POST(request: Request) {
  if (!rateLimit(`search-log:${clientIp(request)}`, { limit: 60, windowMs: 60_000 })) {
    return new NextResponse(null, { status: 204 });
  }
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const parsed = schema.safeParse(body);
  if (parsed.success) {
    const session = await auth();
    await logSearch({
      query: parsed.data.query,
      mode: "universities",
      source: parsed.data.source,
      locale: parsed.data.locale,
      resultCount: parsed.data.resultCount,
      universitySlug: parsed.data.universitySlug,
      userId: session?.user?.id ?? null,
    });
  }
  return new NextResponse(null, { status: 204 });
}
