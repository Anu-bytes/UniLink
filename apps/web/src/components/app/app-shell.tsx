"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ExternalLink,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ComponentType } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { PageTransition } from "@/components/page-transition";
import { SearchPalette } from "@/components/search/search-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { useSavedCount } from "@/components/app/saved-context";
import { cn } from "@/lib/utils";
import { initialsAvatar } from "@/lib/format";
import { isNavActive } from "@/lib/nav-active";

const STORAGE_KEY = "unilink.sidebar.collapsed";

type NavItem = {
  href: string;
  labelKey: "home" | "search" | "applications" | "profile";
  icon: ComponentType<{ className?: string }>;
  /** Sub-paths that should also light this item up. */
  extraMatches?: string[];
  /** Marks the section as previewed but not finished. Does not gate access. */
  comingSoon?: boolean;
};

const NAV: NavItem[] = [
  { href: "/app", labelKey: "home", icon: LayoutDashboard },
  { href: "/app/search", labelKey: "search", icon: Search, extraMatches: ["/app/compare"] },
  {
    href: "/app/applications",
    labelKey: "applications",
    icon: GraduationCap,
    comingSoon: true,
  },
  { href: "/app/profile", labelKey: "profile", icon: User },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string | null; email: string | null; image: string | null };
}) {
  const t = useTranslations("App");
  const pathname = usePathname();
  const { count: savedCount } = useSavedCount();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Read the stored preference after mount so the server and client agree on
  // the first render.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  // Covers navigation to a different route. Tapping the link for the route you
  // are already on does not change the pathname, so the links close it directly
  // as well.
  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // The account menu used to be a plain <details> element, which never closes
  // on its own: a click outside leaves it open, and a client-side route
  // change (this component stays mounted across /app pages) doesn't reset
  // its open attribute either. Same pointerdown/Escape pattern as the
  // marketing header's AccountMenu.
  useEffect(() => {
    if (!accountOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  function toggleCollapsed() {
    setCollapsed((previous) => {
      const next = !previous;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  function isActive(item: NavItem) {
    if (item.href === "/app") return pathname === "/app";
    return (
      pathname.startsWith(item.href) ||
      (item.extraMatches?.some((match) => pathname.startsWith(match)) ?? false)
    );
  }

  const avatar = initialsAvatar(user.name ?? user.email ?? "UniLink");

  const sidebar = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center px-4",
          collapsed && "justify-center px-2",
        )}
      >
        {collapsed ? (
          // Same destination as the expanded Logo below: inside the app,
          // the mark goes to search, not the dashboard/"home".
          <Link href="/app/search" aria-label="UniLink">
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg bg-[#1E6DEB] text-xs font-bold text-white"
            >
              UL
            </span>
          </Link>
        ) : (
          <Logo href="/app/search" className="[&_img]:h-7" />
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2" aria-label={t("sidebar.home")}>
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              aria-current={active ? "page" : undefined}
              title={collapsed ? t(`sidebar.${item.labelKey}`) : undefined}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                collapsed && "justify-center px-0",
                active
                  ? "bg-[#EAF2FE] font-semibold text-[#1E6DEB]"
                  : "font-normal text-[#3F4657] hover:bg-slate-50",
              )}
            >
              <item.icon className="size-[18px] shrink-0" />
              {collapsed ? (
                <span className="sr-only">
                  {t(`sidebar.${item.labelKey}`)}
                  {item.comingSoon ? ` (${t("comingSoon")})` : null}
                </span>
              ) : (
                <>
                  <span className="whitespace-nowrap">{t(`sidebar.${item.labelKey}`)}</span>
                  {item.comingSoon ? (
                    <span className="ms-auto shrink-0 rounded-full bg-[#FFF6E5] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#B77714]">
                      {t("comingSoon")}
                    </span>
                  ) : null}
                </>
              )}
            </Link>
          );
        })}

        {/* Last in the list, not a nav destination like the items above it,
            so a divider marks the break: still a clear, always-visible way
            out (the account dropdown also has one), not styled as another
            page inside the app. */}
        <div className="my-2 border-t border-slate-100" />
        <Link
          href="/"
          title={collapsed ? t("backToSite") : undefined}
          className={cn(
            "flex min-h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-normal text-[#5a6072] transition-colors hover:bg-slate-50 hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
            collapsed && "justify-center px-0",
          )}
        >
          <ArrowLeft className="size-[18px] shrink-0 rtl:rotate-180" aria-hidden />
          {collapsed ? (
            <span className="sr-only">{t("backToSite")}</span>
          ) : (
            <span>{t("backToSite")}</span>
          )}
        </Link>
      </nav>

      <div className="p-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            "hidden min-h-9 w-full items-center gap-1.5 rounded-lg px-3 text-[13px] text-[#6B7280] transition-colors hover:bg-slate-50 hover:text-[#1F2A44] lg:flex",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronLeft
            className={cn(
              "size-4 shrink-0 transition-transform rtl:rotate-180",
              collapsed && "rotate-180 rtl:rotate-0",
            )}
            aria-hidden
          />
          <span className={collapsed ? "sr-only" : undefined}>
            {collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-full flex-1 bg-white">
      {/* Desktop rail */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-e border-slate-200 bg-white transition-[width] duration-200 lg:block",
          collapsed ? "w-[68px]" : "w-[240px]",
        )}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t("sidebar.closeMenu")}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <div className="absolute inset-y-0 start-0 w-[240px] bg-white shadow-xl">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          // Pinned during page transitions (see components/page-transition.tsx).
          style={{ viewTransitionName: "site-header" }}
          className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-100 bg-white px-4 md:px-6"
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("sidebar.openMenu")}
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-[#1F2A44] lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <div className="ms-auto flex items-center gap-2 sm:gap-3 [&>*]:shrink-0">
            {/* Site-wide instant search (Ctrl/Cmd+K), same as the marketing header. */}
            <SearchPalette signedIn compactOnMobile />

            {/* Same control as the marketing header, so switching language
                keeps you on the current app page rather than sending you
                back to the site. */}
            <LanguageSwitcher />

            {/* Same h-10 as the language switcher, and the count sits as a
                small badge overlapping the icon's corner instead of inline
                in the pill's flow — that inline badge used to render as a
                large blob that threw off the whole row's rhythm. */}
            <Link
              href="/app/saved"
              aria-label={t("saved")}
              title={t("saved")}
              aria-current={isNavActive(pathname, "/app/saved") ? "page" : undefined}
              className={cn(
                "relative flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors sm:px-3.5",
                isNavActive(pathname, "/app/saved") && "ring-2 ring-[#F82C1F]/40",
                savedCount > 0
                  ? "bg-[#FFF0EE] text-[#F82C1F] hover:bg-[#FFE3DF]"
                  : "bg-slate-100 text-[#3F4657] hover:bg-slate-200",
              )}
            >
              <Heart
                className={cn("size-4", savedCount > 0 && "fill-current")}
                aria-hidden
              />
              <span className="hidden sm:inline">{t("savedNav")}</span>
              {savedCount > 0 ? (
                <span className="absolute -top-1 -end-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F82C1F] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {savedCount}
                </span>
              ) : null}
            </Link>

            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((previous) => !previous)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full"
              >
                <span className="sr-only">{t("account")}</span>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatars
                  // come from arbitrary OAuth hosts.
                  <img
                    src={user.image}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    style={{ background: avatar.background, color: avatar.color }}
                    className="flex size-10 items-center justify-center rounded-full text-xs font-bold"
                  >
                    {avatar.initials}
                  </span>
                )}
              </button>

              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-slate-100 px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-semibold text-[#1F2A44]">
                      {user.name ?? t("account")}
                    </p>
                    {user.email ? (
                      <p className="truncate text-xs text-[#5a6072]">{user.email}</p>
                    ) : null}
                  </div>
                  <Link
                    href="/app/profile"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    aria-current={isNavActive(pathname, "/app/profile") ? "page" : undefined}
                    className={cn(
                      "mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold hover:bg-slate-50",
                      isNavActive(pathname, "/app/profile")
                        ? "text-[#1E6DEB]"
                        : "text-[#5a6072]",
                    )}
                  >
                    <User className="size-4" aria-hidden />
                    {t("sidebar.profile")}
                  </Link>
                  <Link
                    href="/"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:bg-slate-50"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    {t("backToSite")}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#C81F15] hover:bg-[#FFF0EE]"
                  >
                    <LogOut className="size-4" aria-hidden />
                    {t("signOut")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <PageTransition>
          <main className="min-w-0 flex-1 bg-white">{children}</main>
        </PageTransition>
      </div>
    </div>
  );
}
