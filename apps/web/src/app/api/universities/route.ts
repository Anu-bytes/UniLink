import { NextResponse } from "next/server";
import { listUniversities } from "@/lib/catalog";
import { parseFilters, parseLocale, parsePage, parseSort } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = parseLocale(searchParams);
  const { page, pageSize } = parsePage(searchParams);
  const result = listUniversities(parseFilters(searchParams), {
    sort: parseSort(searchParams),
    page,
    pageSize,
    locale,
  });
  return NextResponse.json(result);
}
