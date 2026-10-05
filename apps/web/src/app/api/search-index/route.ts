import { NextResponse, type NextRequest } from "next/server";

import { getUniversitySearchIndex } from "@/lib/catalog";

/**
 * The instant-search index (see getUniversitySearchIndex). Public: it holds
 * only what the public directory already shows (names, city, logo, faculty
 * names). The locale comes as a query param because the i18n proxy does not
 * run on /api routes.
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";
  const entries = await getUniversitySearchIndex(locale);

  return NextResponse.json(
    { entries },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
  );
}
