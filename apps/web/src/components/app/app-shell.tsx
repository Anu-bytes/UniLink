"use client";

import {
  ChevronLeft,
  ExternalLink,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ComponentType } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { initialsAvatar } from "@/lib/format";

const STORAGE_KEY = "unilink.sidebar.collapsed";

type NavItem = {
  href: string;
  labelKey: "home" | "search" | "applications" | "profile";
  icon: ComponentType<{ className?: string }>;
  /** Sub-paths that should also light this item up. */
  extraMatches?: string[];
};

const NAV: NavItem[] = [
  { href: "/app", labelKey: "home", icon: Home },
  { href: "/app/search", labelKey: "search", icon: Search, extraMatches: ["/app/compare"] },
  { href: "/app/applications", labelKey: "applications", icon: GraduationCap },
  { href: "/app/profile", labelKey: "profile", icon: User },
];

export function AppShell({
  children,
  user,
  savedCount,
}: {
  children: React.ReactNode;
  user: { name: string | null; email: string | null; image: string | null };
  savedCount: number;
}) {
  const t = useTranslations("App");
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

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
          <Link href="/app" aria-label="UniLink">
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg bg-[#1E6DEB] text-xs font-bold text-white"
            >
              UL
            </span>
          </Link>
        ) : (
          <Logo className="[&_img]:h-7" />
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
                <span className="sr-only">{t(`sidebar.${item.labelKey}`)}</span>
              ) : (
                <span>{t(`sidebar.${item.labelKey}`)}</span>
              )}
            </Link>
          );
        })}
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
          collapsed ? "w-[68px]" : "w-[220px]",
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
          <div className="absolute inset-y-0 start-0 w-[220px] bg-white shadow-xl">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-100 bg-white px-4 md:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("sidebar.openMenu")}
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-[#1F2A44] lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <div className="ms-auto flex items-center gap-1">
            <Link
              href="/app/saved"
              aria-label={t("saved")}
              title={t("saved")}
              className="relative flex size-10 items-center justify-center rounded-lg text-[#3F4657] transition-colors hover:bg-slate-50 hover:text-[#1E6DEB]"
            >
              <Heart className="size-5" aria-hidden />
              {savedCount > 0 ? (
                <span className="absolute end-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-[#F82C1F] px-1 text-[10px] font-bold leading-4 text-white">
                  {savedCount}
                </span>
              ) : null}
            </Link>

            <details className="group relative">
              <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full [&::-webkit-details-marker]:hidden">
                <span className="sr-only">{t("account")}</span>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatars
                  // come from arbitrary OAuth hosts.
                  <img
                    src={user.image}
                    alt=""
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    style={{ background: avatar.background, color: avatar.color }}
                    className="flex size-9 items-center justify-center rounded-full text-xs font-bold"
                  >
                    {avatar.initials}
                  </span>
                )}
              </summary>

              <div className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
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
                  className="mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:bg-slate-50"
                >
                  <User className="size-4" aria-hidden />
                  {t("sidebar.profile")}
                </Link>
                <Link
                  href="/"
                  className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:bg-slate-50"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  {t("backToSite")}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#C81F15] hover:bg-[#FFF0EE]"
                >
                  <LogOut className="size-4" aria-hidden />
                  {t("signOut")}
                </button>
              </div>
            </details>
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}
