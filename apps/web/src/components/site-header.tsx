import { Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StickyHeaderShell } from "@/components/sticky-header-shell";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  const links = [
    { href: "/students", label: t("students") },
    { href: "/about", label: t("about") },
    { href: "/partners", label: t("partners") },
  ] as const;

  return (
    <StickyHeaderShell className="font-[family-name:var(--font-open-sans)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo className="shrink-0 [&_img]:h-9 sm:[&_img]:h-12" />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center whitespace-nowrap text-base font-semibold leading-7 text-[#292E3E] transition-colors hover:text-[#1E6DEB] xl:text-[18px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <LanguageSwitcher />

          <Link
            href="/onboarding"
            className="hidden h-12 items-center justify-center whitespace-nowrap rounded-[8px] border border-[#0064E1] bg-white px-4 text-base font-semibold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5 xl:inline-flex xl:h-14 xl:px-5 xl:text-[18px]"
          >
            {t("registerAsStudent")}
          </Link>

          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#1E6DEB] px-4 text-base font-semibold text-white transition-colors hover:bg-[#1859c4] xl:h-14 xl:px-6 xl:text-[18px]"
          >
            {t("login")}
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-[#292E3E] transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Navigation</span>
            <Menu className="size-6" aria-hidden />
          </summary>

          <div className="absolute end-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-[#292E3E] transition-colors hover:bg-[#EEF3FF] hover:text-[#1E6DEB]"
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
