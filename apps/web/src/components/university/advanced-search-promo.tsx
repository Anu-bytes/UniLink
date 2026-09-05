import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Shown to signed-out visitors browsing the plain directory, to make the
 * AI/advanced search (only available once registered) visible right where
 * they're already searching by hand, not just on the homepage. Hidden for
 * signed-in users since they already have it in /app/search.
 *
 * Kept to a single compact row on purpose: this sits above the results grid,
 * so a tall promo card here was pushing every result below the fold.
 */
export async function AdvancedSearchPromo() {
  const t = await getTranslations("Universities.promoBanner");

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#1E6DEB] px-4 py-2.5 md:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-white">
        <Sparkles className="size-4 shrink-0 text-[#F5A623]" aria-hidden />
        <span className="truncate">{t("title")}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/onboarding"
          className="inline-flex h-8 items-center justify-center rounded-full bg-white px-4 text-xs font-bold text-[#1E6DEB] shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("registerCta")}
        </Link>
        <Link
          href="/login"
          className="hidden h-8 items-center justify-center rounded-full border border-white/50 px-4 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
        >
          {t("loginCta")}
        </Link>
      </div>
    </div>
  );
}
