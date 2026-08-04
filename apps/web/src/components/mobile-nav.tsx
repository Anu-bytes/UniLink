"use client";

import { GraduationCap, Heart, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { Avatar, type SessionUser } from "@/components/account-menu";

type NavLink = { href: string; label: string };

/**
 * Mobile navigation menu.
 *
 * This was a plain <details> element, which never closed again: client-side
 * navigation does not reset the `open` attribute, so the panel stayed expanded
 * over the new page. Holding the state in React lets it close on navigation,
 * on an outside tap, and on Escape.
 */
export function MobileNav({
  links,
  openLabel,
  closeLabel,
  registerHref,
  registerLabel,
  loginHref,
  loginLabel,
  user,
  children,
}: {
  links: readonly NavLink[];
  openLabel: string;
  closeLabel: string;
  registerHref: string;
  registerLabel: string;
  loginHref: string;
  loginLabel: string;
  /** Present when signed in; swaps the auth buttons for account links. */
  user?: SessionUser | null;
  /** Locale switcher, rendered by the server component that owns it. */
  children?: React.ReactNode;
}) {
  const tAccount = useTranslations("Account");
  const tApp = useTranslations("App");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close whenever the route changes. Tapping a link to the page you are
  // already on does not change the pathname, so the links also close it
  // directly rather than relying on this alone.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : openLabel}
        className="flex size-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-[#292E3E] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        {open ? (
          <X className="size-6" aria-hidden />
        ) : (
          <Menu className="size-6" aria-hidden />
        )}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute end-0 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="inline-flex min-h-12 items-center rounded-lg px-3 py-2 text-base font-semibold text-[#292E3E] transition-colors hover:bg-[#EEF3FF] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 border-t border-slate-200 pt-4">
            {children}

            {user ? (
              <div className="mt-4">
                <div className="flex items-center gap-3 rounded-xl bg-[#F7F9FE] p-3">
                  <Avatar user={user} className="size-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1F2A44]">
                      {user.name ?? user.email ?? tAccount("account")}
                    </p>
                    {user.email ? (
                      <p dir="ltr" className="truncate text-xs text-[#5a6072]">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <nav className="mt-2 flex flex-col">
                  {[
                    { href: "/app", label: tAccount("dashboard"), icon: LayoutDashboard },
                    {
                      href: "/app/applications",
                      label: tApp("sidebar.applications"),
                      icon: GraduationCap,
                    },
                    { href: "/app/saved", label: tApp("saved"), icon: Heart },
                    { href: "/app/profile", label: tApp("sidebar.profile"), icon: User },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className="inline-flex min-h-12 items-center gap-2.5 rounded-lg px-3 text-base font-semibold text-[#292E3E] transition-colors hover:bg-[#EEF3FF] hover:text-[#1E6DEB]"
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 inline-flex min-h-12 w-full items-center gap-2.5 rounded-lg px-3 text-base font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE]"
                >
                  <LogOut className="size-4 shrink-0" aria-hidden />
                  {tApp("signOut")}
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-2">
                <Link
                  href={registerHref}
                  onClick={close}
                  className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[#0064E1] px-4 text-center text-base font-semibold text-[#1E6DEB]"
                >
                  {registerLabel}
                </Link>
                <Link
                  href={loginHref}
                  onClick={close}
                  className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-4 text-center text-base font-semibold text-white"
                >
                  {loginLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
