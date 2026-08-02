"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";

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
  children,
}: {
  links: readonly NavLink[];
  openLabel: string;
  closeLabel: string;
  registerHref: string;
  registerLabel: string;
  loginHref: string;
  loginLabel: string;
  /** Locale switcher, rendered by the server component that owns it. */
  children?: React.ReactNode;
}) {
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
