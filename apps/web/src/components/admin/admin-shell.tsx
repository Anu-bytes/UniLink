"use client";

import {
  Award,
  Building2,
  ChevronLeft,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Quote,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ComponentType } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { initialsAvatar } from "@/lib/format";

const STORAGE_KEY = "unilink.admin.sidebar.collapsed";

type NavItem = {
  href: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
};

type NavGroup = {
  /** A group without a label sits at the top of the rail, above the headings. */
  labelKey?: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    items: [{ href: "/admin", labelKey: "overview", icon: LayoutDashboard }],
  },
  {
    labelKey: "catalogue",
    items: [
      { href: "/admin/universities", labelKey: "universities", icon: Building2 },
      { href: "/admin/faculties", labelKey: "faculties", icon: Library },
      { href: "/admin/programs", labelKey: "programs", icon: GraduationCap },
    ],
  },
  {
    labelKey: "people",
    items: [
      { href: "/admin/users", labelKey: "users", icon: Users },
      { href: "/admin/applications", labelKey: "applications", icon: FileText },
    ],
  },
  {
    labelKey: "growth",
    items: [
      { href: "/admin/leads", labelKey: "leads", icon: Inbox },
      { href: "/admin/testimonials", labelKey: "testimonials", icon: Quote },
      { href: "/admin/scholarships", labelKey: "scholarships", icon: Award },
    ],
  },
];

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string | null; email: string | null; image: string | null };
}) {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Read the stored preference after mount so the server and client agree on
  // the first render.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  // Covers navigation to a different route. Tapping the link for the route you
  // are already on does not change the pathname, so the links close it directly
  // as well. Adjusted during render rather than in an effect so the drawer
  // never paints once on the new page before closing.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // The account menu is held in React rather than in a <details>, which is the
  // mistake MobileNav already had to undo: client-side navigation never resets
  // the `open` attribute, and the shell stays mounted while you move between
  // admin pages, so the panel would hang over the page you landed on.
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function toggleCollapsed() {
    setCollapsed((previous) => {
      const next = !previous;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const avatar = initialsAvatar(user.name ?? user.email ?? "UniLink");

  // The drawer always renders the expanded rail, whatever the desktop
  // preference is: a 248px panel showing icon-only items reads as broken.
  function renderSidebar(isCollapsed: boolean) {
    return (
      <div className="flex h-full flex-col bg-[#0B1220]">
        <div
          className={cn(
            "flex h-16 items-center gap-2.5 px-4",
            isCollapsed && "justify-center px-2",
          )}
        >
          <Link
            href="/admin"
            aria-label="UniLink"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#3B85F5] to-[#1E6DEB] text-xs font-bold text-white"
            >
              UL
            </span>
            {isCollapsed ? null : (
              <span className="flex items-center gap-2">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                  UniLink
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {t("nav.tag")}
                </span>
              </span>
            )}
          </Link>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-2"
          aria-label={t("nav.tag")}
        >
          {NAV.map((group, index) => (
            <div key={group.labelKey ?? "root"} className={index > 0 ? "mt-5" : undefined}>
              {group.labelKey ? (
                isCollapsed ? (
                  <div className="mx-2 mb-2 border-t border-white/[0.06]" />
                ) : (
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    {t(`nav.${group.labelKey}`)}
                  </p>
                )
              ) : null}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const label = t(`nav.${item.labelKey}`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      aria-current={active ? "page" : undefined}
                      title={isCollapsed ? label : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                        isCollapsed && "justify-center px-0",
                        active
                          ? "bg-[#1E6DEB] font-semibold text-white"
                          : "font-normal text-white/65 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      <item.icon className="size-[18px] shrink-0" />
                      {isCollapsed ? (
                        <span className="sr-only">{label}</span>
                      ) : (
                        <span className="truncate">{label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "hidden min-h-9 w-full items-center gap-1.5 rounded-lg px-3 text-[13px] text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] lg:flex",
              isCollapsed && "justify-center px-0",
            )}
          >
            <ChevronLeft
              className={cn(
                "size-4 shrink-0 transition-transform rtl:rotate-180",
                isCollapsed && "rotate-180 rtl:rotate-0",
              )}
              aria-hidden
            />
            <span className={isCollapsed ? "sr-only" : undefined}>
              {isCollapsed ? t("nav.expand") : t("nav.collapse")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 bg-[#F7F8FA]">
      {/* Desktop rail */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-e border-white/[0.06] bg-[#0B1220] transition-[width] duration-200 lg:block",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        {renderSidebar(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t("nav.closeMenu")}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <div className="absolute inset-y-0 start-0 w-[248px] shadow-xl">
            {renderSidebar(false)}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 md:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("nav.openMenu")}
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-[#0F172A] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            {/* Same control as the rest of the site, so switching language keeps
                you on the admin page you were reading. */}
            <LanguageSwitcher />

            <Link
              href="/"
              className="hidden h-10 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] sm:flex"
            >
              <ExternalLink className="size-4" aria-hidden />
              {t("nav.backToSite")}
            </Link>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((previous) => !previous)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <span className="sr-only">{t("nav.account")}</span>
                {user.image ? (
                  // Avatars come from arbitrary OAuth hosts.
                  // eslint-disable-next-line @next/next/no-img-element
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
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-slate-100 px-3 pb-3 pt-2">
                    <p className="truncate text-[14px] font-semibold text-[#0F172A]">
                      {user.name ?? t("nav.account")}
                    </p>
                    {user.email ? (
                      // An address stays Latin on the Arabic side, so it carries
                      // its own direction the way the marketing account menu does.
                      <p dir="ltr" className="truncate text-[12px] text-[#64748B]">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href="/app"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                  >
                    <LayoutDashboard className="size-4" aria-hidden />
                    {t("nav.studentApp")}
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    {t("nav.backToSite")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-[13.5px] font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F82C1F]"
                  >
                    <LogOut className="size-4" aria-hidden />
                    {t("nav.signOut")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-[#F7F8FA]">{children}</main>
      </div>
    </div>
  );
}
