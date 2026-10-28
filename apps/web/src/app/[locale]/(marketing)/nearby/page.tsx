import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { NearbyExplorer } from "@/components/nearby/nearby-explorer";
import { NearbyGate } from "@/components/nearby/nearby-gate";
import { getNearbyCatalog } from "@/lib/nearby";
import { nearbyHref, parseNearbyFilters } from "@/lib/nearby-filters";
import { NEARBY_TRIAL_COOKIE, readTrial } from "@/lib/nearby-trial";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Nearby.meta");
  return { title: `${t("title")} | UniLink`, description: t("description") };
}

export default async function NearbyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const [session, catalog, params, cookieStore] = await Promise.all([
    auth(),
    getNearbyCatalog(locale),
    searchParams,
    cookies(),
  ]);
  const filters = parseNearbyFilters(
    params,
    catalog.fields.map((field) => field.value),
  );
  const isGuest = !session?.user?.id;

  if (isGuest) {
    const trial = readTrial(cookieStore.get(NEARBY_TRIAL_COOKIE)?.value);
    if (trial === "none" && params.trial !== "1") {
      // The free search starts in a route handler, which can set its cookie.
      const query = nearbyHref(filters).split("?")[1];
      redirect(`/api/nearby/start?locale=${locale}${query ? `&${query}` : ""}`);
    }
    if (trial !== "active") {
      // Spent (or cookies refused): no catalogue is sent to the browser.
      return <NearbyGate catalog={catalog} callbackUrl={`/${locale}${nearbyHref(filters)}`} />;
    }
  }

  return <NearbyExplorer catalog={catalog} initialFilters={filters} guest={isGuest} />;
}
