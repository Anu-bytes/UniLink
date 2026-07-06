import { NextResponse } from "next/server";
import { getUniversityBySlug } from "@/lib/catalog";
import { parseLocale } from "@/lib/query";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const university = getUniversityBySlug(slug);
  if (!university) {
    return NextResponse.json({ error: "University not found" }, { status: 404 });
  }
  return NextResponse.json({ lang: parseLocale(searchParams), data: university });
}
