import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { AccountMenu } from "@/components/account-menu";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { StickyHeaderShell } from "@/components/sticky-header-shell";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const locale = await getLocale();
  const session = await auth();

  const user = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;

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
    { href: "/partners", label: t("partners") },
    { href: "/about", label: t("about") },
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

          {user ? (
            <>
              <Link
                href="/app/search"
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#1E6DEB] px-4 text-base font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] xl:h-14 xl:px-6 xl:text-[18px]"
              >
                {t("searchPrograms")}
              </Link>
              <AccountMenu user={user} />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <MobileNav
          links={links}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          registerHref="/onboarding"
          registerLabel={t("registerAsStudent")}
          loginHref="/login"
          loginLabel={t("login")}
          user={user}
        >
          <LanguageSwitcher />
        </MobileNav>
      </div>
    </StickyHeaderShell>
  );
}
