import { getTranslations } from "next-intl/server";

import { SplashScreen } from "@/components/splash-loader";

/**
 * Search has its own fallback so the wait is labelled as "searching" rather
 * than the generic app-shell load.
 */
export default async function SearchLoading() {
  const t = await getTranslations("Search");

  return <SplashScreen label={t("searching")} />;
}
