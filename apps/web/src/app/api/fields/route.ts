import { NextResponse } from "next/server";
import { FIELDS } from "@/data/fields";
import { parseLocale } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ lang: parseLocale(searchParams), data: FIELDS });
}
