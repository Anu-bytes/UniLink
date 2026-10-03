"use client";

import { ArrowRight, ChevronDown, GitCompareArrows, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { MAX_COMPARE, compareKindParam, useCompare } from "@/components/app/compare-context";
import { UniversityLogo } from "@/components/university-logo";
import { cn } from "@/lib/utils";

/**
 * Floating bar that appears once anything is selected for comparison. Hidden
 * on the compare page itself, where the table already shows the selection.
 *
 * It floats as a card above the bottom edge (and above the phone tab bar, via
 * --ul-bottom-nav) rather than a full-width slab, so it covers as little of a
 * phone screen as possible, and it can be tucked into a small pill that keeps
 * the count visible.
 */
export function CompareTray() {
  const t = useTranslations("Compare.tray");
  const { entries, ids, kind, clear, remove, ready } = useCompare();
  const pathname = usePathname();
  const count = entries.length;
  // The selection size the bar was tucked away at. Adding or removing an
  // item changes the count, which brings the bar back on its own.
  const [collapsedAt, setCollapsedAt] = useState<number | null>(null);
  const collapsed = collapsedAt === count;
  const setCollapsed = (value: boolean) => setCollapsedAt(value ? count : null);

  if (!ready || count === 0 || pathname.startsWith("/app/compare")) {
    return null;
  }

  // A comparison needs at least two things side by side.
  const canCompare = count >= 2;
  const href = `/app/compare?ids=${ids.join(",")}${compareKindParam(kind)}`;
  const title = t(
    kind === "faculty"
      ? "titleFaculties"
      : kind === "university"
        ? "titleUniversities"
        : "title",
    { count },
  );

  return (
    <>
      {/* Keeps the end of the page (footer links) scrollable past the bar. */}
      <div aria-hidden className={collapsed ? "h-20" : "h-36"} />

      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label={t("show")}
          className="fixed bottom-[calc(var(--ul-bottom-nav,0px)+1rem)] end-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[#1E6DEB] ps-4 pe-5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(30,109,235,0.45)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <GitCompareArrows className="size-4" aria-hidden />
          {t("show")}
          <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs text-[#1E6DEB]">
            {count}
          </span>
        </button>
      ) : (
        <div
          role="region"
          aria-label={title}
          className="ul-tray-in fixed inset-x-3 bottom-[calc(var(--ul-bottom-nav,0px)+0.75rem)] z-40 mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur-md md:p-4"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 md:flex-nowrap">
            <div className="flex shrink-0 -space-x-2.5 rtl:space-x-reverse">
              {entries.slice(0, 3).map((entry) => (
                <UniversityLogo
                  key={entry.id}
                  name={entry.universityName}
                  logoUrl={entry.logoUrl}
                  className="size-9 ring-2 ring-white md:size-10"
                  textClassName="text-[10px]"
                />
              ))}
              {count > 3 ? (
                <span className="flex size-9 items-center justify-center rounded-full bg-[#EEF4FF] text-xs font-bold text-[#1E6DEB] ring-2 ring-white md:size-10">
                  +{count - 3}
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold leading-snug text-[#1F2A44] md:truncate md:text-sm">
                {title}
              </p>
              <p
                className={cn(
                  "text-xs leading-snug md:truncate",
                  canCompare ? "text-[#5a6072]" : "font-semibold text-[#C2410C]",
                )}
              >
                {canCompare ? t("roomLeft", { max: MAX_COMPARE }) : t("needMore")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label={t("hide")}
              title={t("hide")}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#5a6072] hover:bg-slate-100 hover:text-[#1F2A44] md:order-last"
            >
              <ChevronDown className="size-5" aria-hidden />
            </button>

            {/* Second row on a phone: clear + a wide compare button that is
                easy to hit with a thumb. On wider screens it joins the first
                row. */}
            <div className="flex w-full items-center gap-2 md:w-auto">
              <button
                type="button"
                onClick={clear}
                className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50 md:hidden"
              >
                {t("clear")}
              </button>
              <Link
                href={href}
                aria-disabled={!canCompare}
                tabIndex={canCompare ? undefined : -1}
                onClick={(event) => {
                  if (!canCompare) event.preventDefault();
                }}
                className={cn(
                  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-bold transition-colors md:flex-none",
                  canCompare
                    ? "bg-[#1E6DEB] text-white shadow-[0_8px_20px_-8px_rgba(30,109,235,0.8)] hover:bg-[#1859c4]"
                    : "cursor-not-allowed bg-slate-100 text-slate-400",
                )}
              >
                {t("compare")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Removable chips (wider screens; on a phone the logos above and
              the toggles on each card already show and change the selection). */}
          <div className="mt-3 hidden items-center gap-2 border-t border-slate-100 pt-3 md:flex">
            <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {entries.map((entry) => (
                <li key={entry.id} className="shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F6FC] py-1 ps-3 pe-1 text-xs font-semibold text-[#1F2A44]">
                    <span className="max-w-36 truncate">{entry.name}</span>
                    <button
                      type="button"
                      onClick={() => remove(entry.id)}
                      aria-label={t("remove", { name: entry.name })}
                      className="flex size-6 items-center justify-center rounded-full text-[#98A0B4] hover:bg-white hover:text-[#1F2A44]"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={clear}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-[#5a6072] hover:bg-slate-100 hover:text-[#1F2A44]"
            >
              {t("clear")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
