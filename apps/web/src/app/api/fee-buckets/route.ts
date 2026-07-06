import { NextResponse } from "next/server";
import { FEE_BUCKETS } from "@/data/fee-buckets";
import { parseLocale } from "@/lib/query";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ lang: parseLocale(searchParams), data: FEE_BUCKETS });
}
