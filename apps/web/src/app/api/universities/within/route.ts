import { NextResponse } from "next/server";
import { within } from "@/lib/catalog";
import { parseFilters, parseLocale } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minLat = Number(searchParams.get("min_lat"));
  const minLng = Number(searchParams.get("min_lng"));
  const maxLat = Number(searchParams.get("max_lat"));
  const maxLng = Number(searchParams.get("max_lng"));
  if ([minLat, minLng, maxLat, maxLng].some((n) => !Number.isFinite(n))) {
    return NextResponse.json(
      { error: "min_lat, min_lng, max_lat, max_lng are required" },
      { status: 400 },
    );
  }
  const locale = parseLocale(searchParams);
  const data = within({ minLat, minLng, maxLat, maxLng }, parseFilters(searchParams), locale);
  return NextResponse.json({ count: data.length, data });
}
