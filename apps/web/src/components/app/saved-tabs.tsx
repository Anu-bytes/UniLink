"use client";

import { Building2, GraduationCap, Layers, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SavedSection = "universities" | "faculties" | "programs";

const SAVED_SECTIONS: SavedSection[] = ["universities", "faculties", "programs"];

const SECTION_STYLE: Record<
  SavedSection,
  { icon: LucideIcon; active: string; iconTint: string }
> = {
  universities: {
    icon: Building2,
    active: "border-[#F82C1F] bg-[#FFF7F6] ring-1 ring-[#F82C1F]",
    iconTint: "bg-[#FFF0EE] text-[#F82C1F]",
  },
  faculties: {
    icon: Layers,
    active: "border-[#1E6DEB] bg-[#F7F9FE] ring-1 ring-[#1E6DEB]",
    iconTint: "bg-[#EEF3FF] text-[#1E6DEB]",
  },
  programs: {
    icon: GraduationCap,
    active: "border-[#1F2A44] bg-[#F6F7FA] ring-1 ring-[#1F2A44]",
    iconTint: "bg-[#ECEEF3] text-[#1F2A44]",
  },
};

/**
 * Universities / Faculties / Programs picker for the Saved page: one list at
 * a time, each with its count on the selector so you can see what's in the
 * others without opening them. The lists are pre-rendered server components
 * passed in as nodes; this only owns which one is shown. The choice is kept
 * in `?tab=` so a refresh or a shared link opens the same list.
 */
export function SavedTabs({
  initialSection,
  sections,
}: {
  initialSection: SavedSection;
  sections: Record<
    SavedSection,
    {
      label: string;
      count: number;
      node: React.ReactNode;
      emptyLabel: string;
      browseLabel: string;
      browseHref: string;
    }
  >;
}) {
  const [section, setSection] = useState<SavedSection>(initialSection);
  const current = sections[section];

  function select(next: SavedSection) {
    setSection(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <div>
      <div role="tablist" className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 md:max-w-2xl">
        {SAVED_SECTIONS.map((key) => {
          const entry = sections[key];
          const style = SECTION_STYLE[key];
          const active = key === section;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`saved-tab-${key}`}
              aria-selected={active}
              aria-controls="saved-panel"
              onClick={() => select(key)}
              className={cn(
                "flex min-w-0 flex-col items-start gap-2 rounded-xl border bg-white p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] sm:flex-row sm:items-center sm:gap-3 sm:p-4",
                active ? style.active : "border-slate-200 hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                  style.iconTint,
                )}
              >
                <style.icon className="size-[18px] sm:size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xl leading-none font-bold text-[#1F2A44] sm:text-2xl">
                  {entry.count}
                </span>
                <span className="mt-1 block truncate text-xs font-semibold text-[#5a6072] sm:text-sm">
                  {entry.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="saved-panel"
        role="tabpanel"
        aria-labelledby={`saved-tab-${section}`}
        className="mt-6"
      >
        {current.count > 0 ? (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {current.node}
          </div>
        ) : (
          <div className="rounded-xl bg-[#F5F8FF] px-6 py-12 text-center">
            <p className="text-sm text-[#5a6072]">{current.emptyLabel}</p>
            <Link
              href={current.browseHref}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#1E6DEB]/30 bg-white px-5 text-sm font-bold text-[#1E6DEB] hover:bg-[#EEF3FF]"
            >
              {current.browseLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
