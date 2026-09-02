import { getTranslations } from "next-intl/server";

import { SplashLoader } from "@/components/splash-loader";

/**
 * Route fallback for the sign-in, sign-up, password-reset and onboarding
 * pages. It lives on this group rather than on `[locale]` because a
 * route-level `loading.tsx` commits the HTTP status: see the note in
 * `[locale]/[...rest]/page.tsx`. Nothing under `(auth)` calls `notFound()`,
 * so the boundary is free here.
 */
export default async function AuthLoading() {
  const t = await getTranslations("App");

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-white px-6">
      <SplashLoader label={t("loading")} size="10rem" />
    </div>
  );
}
