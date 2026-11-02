import { BellRing } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Opens the partners page: partner services are not live yet, and this says
 * so before anything else. The headline rises in word by word (never letter
 * by letter: Arabic letters join, and splitting them breaks the word) and a
 * light sweeps across it; a slow ribbon underneath repeats the message.
 * The gradient only paints inside the word's own box, so the word carries
 * padding for descenders and the dots under Arabic letters.
 * Motion stops for visitors who ask for reduced motion (globals.css).
 */
export async function ComingSoonBanner() {
  const t = await getTranslations("Partners.landing.comingSoon");
  const locale = await getLocale();
  const words = t("title").split(" ");
  // Letter spacing pulls Arabic letters apart, so it is for Latin text only.
  const latin = !locale.startsWith("ar");
  const ribbon = Array.from({ length: 8 }, () => t("ribbon"));

  return (
    <section
      aria-labelledby="partners-coming-soon"
      className="relative overflow-hidden border-b border-[#E7EDF5] bg-white"
    >
      <div aria-hidden className="ul-dots pointer-events-none absolute -inset-8 opacity-[0.07]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 text-center md:px-6 md:pb-10 md:pt-14">
        <p className="ul-soon-fade inline-flex items-center gap-2 rounded-full border border-[#F5A524]/30 bg-[#FFF6E5] px-3.5 py-1.5 text-[13px] font-semibold text-[#B77714]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F5A524] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#F5A524]" />
          </span>
          {t("eyebrow")}
        </p>

        <h2
          id="partners-coming-soon"
          lang={locale}
          className={`mt-5 flex flex-wrap items-baseline justify-center gap-x-[0.25em] text-[clamp(3.5rem,13vw,9.5rem)] font-black leading-[1.05] ${latin ? "tracking-tight" : ""}`}
        >
          {words.map((word, index) => (
            <span key={index} className="-mb-[0.2em] inline-block overflow-hidden">
              <span
                className="ul-soon-word inline-block px-[0.04em] pb-[0.2em] pt-[0.04em]"
                style={{ animationDelay: `${index * 140}ms, ${900 + index * 140}ms` }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        <p className="ul-soon-fade mx-auto mt-4 max-w-2xl text-base leading-8 text-[#4A5568] [animation-delay:350ms] md:text-lg">
          {t("body")}
        </p>

        <div className="ul-soon-fade mt-7 flex justify-center [animation-delay:500ms]">
          <Link
            href="/work-with-us"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#16233F]/15 bg-white px-6 text-[15px] font-bold text-[#16233F] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F5A524]/60 hover:text-[#B77714] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <BellRing className="size-4" aria-hidden />
            {t("cta")}
          </Link>
        </div>
      </div>

      <div aria-hidden dir="ltr" className="relative overflow-hidden border-t border-[#E7EDF5] bg-[#16233F] py-2.5">
        <div className={`ul-soon-ribbon flex w-max gap-10 whitespace-nowrap text-sm font-bold text-white/85 ${latin ? "uppercase tracking-[0.18em]" : ""}`}>
          {[...ribbon, ...ribbon].map((text, index) => (
            <span key={index} className="inline-flex items-center gap-10">
              {text}
              <span className="size-1.5 rounded-full bg-[#F5A524]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
