import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  const links = [
    { href: "/students", label: t("students"), caret: false },
    { href: "/destinations", label: t("studyDestinations"), caret: true },
    { href: "/partners", label: t("partners"), caret: true },
  ] as const;

  return (
      <header className="sticky top-0 z-50 border-b border-border bg-background font-[family-name:var(--font-open-sans)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1 text-[18px] font-semibold leading-7 text-[#292E3E] transition-colors hover:text-[#1E6DEB]"
                >
                  {link.label}
                  {link.caret ? (
                      <ChevronDown className="size-[18px] text-[#292E3E]" aria-hidden />
                  ) : null}
                </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link
                href="/onboarding"
                className="hidden h-14 items-center justify-center rounded-[8px] border border-[#0064E1] bg-white px-5 text-[18px] font-semibold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5 sm:inline-flex"
            >
              {t("registerAsStudent")}
            </Link>

            <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-6 text-[18px] font-semibold text-white transition-colors hover:bg-[#1859c4]"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </header>
  );
}
