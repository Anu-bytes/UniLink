import { Menu } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StickyHeaderShell } from "@/components/sticky-header-shell";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const locale = await getLocale();

  // Open Sans has no Arabic glyphs, so Arabic falls back to an unstyled system
  // font. Use Cairo (--font-arabic) for Arabic; Open Sans for Latin locales.
  const isArabic = locale.startsWith("ar");
  const fontClass = isArabic
    ? "font-[family-name:var(--font-arabic)]"
    : "font-[family-name:var(--font-open-sans)]";

  // Cairo renders visually smaller than its metric size, so the Arabic nav
  // needs a larger px value than the Latin one to read at the same weight.
  const navLinkSize = isArabic
    ? "text-[21px] xl:text-[24px]"
    : "text-[17px] xl:text-[19px]";

  // Universities is intentionally absent here: it is reachable from the
  // footer's quick links (and from in-page CTAs), not the main nav.
  const links = [
    { href: "/students", label: t("students") },
    { href: "/about", label: t("about") },
    { href: "/partners", label: t("partners") },
  ] as const;

  return (
    <StickyHeaderShell className={fontClass}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-6 lg:px-8">
        <Logo className="min-h-11 shrink-0 [&_img]:h-9 md:[&_img]:h-12" />

        <nav className="hidden items-center gap-8 lg:flex xl:gap-9">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-11 items-center whitespace-nowrap font-semibold leading-8 text-[#1F2A44] transition-colors hover:text-[#1E6DEB] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] ${navLinkSize}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <LanguageSwitcher />

          {/* Both CTAs stay visible for the whole lg+ range. Below lg they
              live in the mobile menu, so neither can fall into a gap where
              it is hidden here but the hamburger is already gone. */}
          <Link
            href="/onboarding"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] border border-[#0064E1] bg-white px-4 text-base font-bold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] xl:h-14 xl:px-5 xl:text-[18px]"
          >
            {t("registerAsStudent")}
          </Link>

          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#1E6DEB] px-4 text-base font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] xl:h-14 xl:px-6 xl:text-[18px]"
          >
            {t("login")}
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-[#292E3E] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation menu</span>
            <Menu className="size-6" aria-hidden />
          </summary>

          <div className="absolute end-0 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-12 items-center rounded-lg px-3 py-2 text-base font-semibold text-[#292E3E] transition-colors hover:bg-[#EEF3FF] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-slate-200 pt-4">
              <LanguageSwitcher />
              <div className="mt-4 grid gap-2">
                <Link
                  href="/onboarding"
                  className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[#0064E1] px-4 text-center text-base font-semibold text-[#1E6DEB]"
                >
                  {t("registerAsStudent")}
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-4 text-center text-base font-semibold text-white"
                >
                  {t("login")}
                </Link>
              </div>
            </div>
          </div>
        </details>
      </div>
    </StickyHeaderShell>
  );
}
