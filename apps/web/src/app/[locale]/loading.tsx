import { getTranslations } from "next-intl/server";

import { SplashLoader } from "@/components/splash-loader";

/**
 * Site-wide route fallback. This sits above the marketing and app layouts, so
 * there is no chrome to sit inside yet: the splash takes the whole viewport.
 */
export default async function LocaleLoading() {
  const t = await getTranslations("App");

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-white px-6">
      <SplashLoader label={t("loading")} size="10rem" />
    </div>
  );
}
