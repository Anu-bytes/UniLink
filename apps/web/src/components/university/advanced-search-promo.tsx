import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Shown to signed-out visitors browsing the plain directory, to make the
 * AI/advanced search (only available once registered) visible right where
 * they're already searching by hand, not just on the homepage. Hidden for
 * signed-in users since they already have it in /app/search.
 */
export async function AdvancedSearchPromo() {
  const t = await getTranslations("Universities.promoBanner");

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#1E6DEB] to-[#3B86F7] px-5 py-6 shadow-[0_20px_45px_-20px_rgba(30,58,138,0.55)] md:px-8 md:py-7">
      <div
        aria-hidden
        className="ul-dots pointer-events-none absolute -inset-8 opacity-20"
      />
      <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#F5A623]">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              {t("badge")}
            </span>
            <h2 className="mt-1.5 text-lg font-bold text-white md:text-xl">
              {t("title")}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/85">
              {t("body")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-stretch md:self-center">
          <Link
            href="/onboarding"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-[#1E6DEB] shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex-initial"
          >
            {t("registerCta")}
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-white/50 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex-initial"
          >
            {t("loginCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
