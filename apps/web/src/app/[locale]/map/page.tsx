import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { UNIVERSITIES } from "@/data/universities";
import { summarize } from "@/lib/catalog";
import { MapExplorer } from "@/components/MapExplorer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getMessages(locale).map.title };
}

export default function MapPage() {
  const points = UNIVERSITIES.map((u) => summarize(u));
  return <MapExplorer points={points} />;
}
