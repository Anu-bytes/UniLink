import { NextResponse } from "next/server";
import { nearby } from "@/lib/catalog";
import { parseFilters, parseLocale } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required numeric parameters" },
      { status: 400 },
    );
  }
  const radiusKm = Math.min(500, Math.max(1, Number(searchParams.get("radius_km")) || 25));
  const locale = parseLocale(searchParams);
  const data = nearby({ lat, lng }, radiusKm, parseFilters(searchParams), locale);
  return NextResponse.json({ origin: { lat, lng }, radiusKm, count: data.length, data });
}
