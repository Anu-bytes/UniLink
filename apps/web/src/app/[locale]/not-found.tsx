import { ArrowRight, Globe, GraduationCap, MapPin, Plane } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";

/**
 * Localized 404. Rendered inside the [locale] layout (fonts, direction, intl
 * context) for unknown pages — the `[...rest]` catch-all funnels here. Leans on
 * the study-abroad theme: the missing page "went abroad". Idle motion is
 * transform-only and disabled under prefers-reduced-motion (see globals.css).
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#EEF3FF] via-white to-white font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* Soft brand glows in the corners. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#1E6DEB]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-[#F82C1F]/10 blur-3xl"
      />

      <header className="relative mx-auto w-full max-w-7xl px-6 py-6">
        <Logo />
      </header>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        {/* 404 — the middle "0" is a floating globe with an orbiting plane. */}
        <div className="relative flex select-none items-center justify-center gap-3 sm:gap-6">
          <span className="text-[110px] font-black leading-none text-[#363B51] sm:text-[180px]">
            4
          </span>

          <div className="relative grid place-items-center">
            <span
              aria-hidden
              className="ul-spin-slow absolute -inset-4 rounded-full border-2 border-dashed border-[#1E6DEB]/30"
            />
            <span className="ul-float flex size-[104px] items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#0063e7] text-white shadow-[0_24px_60px_-18px_rgba(30,109,235,0.75)] sm:size-[168px]">
              <Globe className="size-14 sm:size-24" strokeWidth={1.5} />
            </span>
            <span
              aria-hidden
              className="absolute -end-1 -top-1 flex size-11 items-center justify-center rounded-full bg-[#F82C1F] text-white shadow-[0_10px_24px_-8px_rgba(248,44,31,0.8)] sm:size-14"
            >
              <Plane className="size-5 -rotate-45 sm:size-7 rtl:-scale-x-100" />
            </span>
          </div>

          <span className="text-[110px] font-black leading-none text-[#363B51] sm:text-[180px]">
            4
          </span>
        </div>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1E6DEB]/10 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-[#1E6DEB]">
          <MapPin className="size-4" />
          {t("code")}
        </p>

        <h1 className="mt-5 text-[32px] font-bold leading-tight text-[#363B51] sm:text-[44px]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[18px] leading-8 text-[#292E3E]">
          {t("body")}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-7 text-[18px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] hover:shadow-[0_16px_30px_-14px_rgba(30,109,235,0.95)] active:translate-y-0 motion-reduce:transform-none"
          >
            {t("home")}
          </Link>
          <Link
            href="/programs"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-[8px] border border-[#0064E1] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E6DEB]/5 active:translate-y-0 motion-reduce:transform-none"
          >
            <GraduationCap className="size-5" />
            {t("explore")}
            <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
