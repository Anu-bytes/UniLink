import { NextResponse } from "next/server";
import { listPrograms } from "@/lib/catalog";
import { parseFilters, parseLocale, parsePage, parseSort } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = parseLocale(searchParams);
  const { page, pageSize } = parsePage(searchParams);
  const result = listPrograms(parseFilters(searchParams), {
    sort: parseSort(searchParams),
    page,
    pageSize,
    locale,
  });
  return NextResponse.json(result);
}
