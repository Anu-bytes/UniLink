import { NextResponse } from "next/server";
import { autocomplete } from "@/lib/catalog";
import { parseLocale } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const lang = parseLocale(searchParams);
  const limit = Math.min(15, Math.max(1, Number(searchParams.get("limit")) || 8));
  return NextResponse.json({ query: q, lang, suggestions: autocomplete(q, limit) });
}
