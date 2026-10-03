"use client";

import { Building2, Heart, Home, Search, UserRound } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  universities: Building2,
  search: Search,
  saved: Heart,
  account: UserRound,
} as const;

export type BottomNavItem = {
  key: keyof typeof ICONS;
  href: string;
  /** Path that marks this tab as current (differs from href for guests, whose
   * Saved/Account taps go to the login page first). */
  match: string;
  label: string;
};

/**
 * App-style tab bar pinned to the bottom of the screen on phones and tablets
 * (hidden from lg up, where the header carries the same links). The middle
 * tab is the raised search button. The `data-bottom-nav` hook lets other
 * fixed-bottom UI (the compare tray) sit above it; see globals.css.
 */
export function BottomNav({ items, label }: { items: BottomNavItem[]; label: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Keeps the last bit of every page (the footer) scrollable past the bar. */}
      <div aria-hidden className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
        data-bottom-nav
        aria-label={label}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-5 items-stretch">
          {items.map((item) => {
            const Icon = ICONS[item.key];
            const active = isNavActive(pathname, item.match);
            const raised = item.key === "search";

            return (
              <li key={item.key} className="flex">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1E6DEB]",
                    active ? "text-[#1E6DEB]" : "text-[#6B7385] active:text-[#1E6DEB]",
                  )}
                >
                  {raised ? (
                    <span className="-mt-7 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-[0_10px_24px_-8px_rgba(30,109,235,0.85)] ring-4 ring-white transition-transform active:scale-95">
                      <Icon className="size-6" strokeWidth={2.25} aria-hidden />
                    </span>
                  ) : (
                    <>
                      {/* Active indicator: a short bar along the top edge. */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-[#1E6DEB] transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon
                        className={cn("size-[22px]", active && item.key === "saved" && "fill-current")}
                        strokeWidth={active ? 2.25 : 1.9}
                        aria-hidden
                      />
                    </>
                  )}
                  <span className="max-w-full truncate px-0.5 leading-none">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
