"use client";

import { ChevronRight, GraduationCap, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type FacultyGridItem = {
  id: string;
  name: string;
  /** Short dot-separated keywords under the name (e.g. program names). */
  summary: string;
  /** Program count shown beside the arrow, e.g. "12 programs". */
  countLabel: string;
  icon: React.ReactNode;
  /** Pre-rendered on the server: translations and formatting stay there. */
  body: React.ReactNode;
};

/**
 * Compact two-column grid of faculty tiles with a search box. Tapping a tile
 * opens it in place (it spans the full row so its programs have room) and
 * closes whichever was open. The height animation uses a CSS grid-rows
 * transition (0fr <-> 1fr) instead of measuring pixels in JS.
 */
export function FacultyGrid({
  items,
  heading,
  subtitle,
  countBadge,
  searchPlaceholder,
  emptyLabel,
  defaultOpenId,
}: {
  items: FacultyGridItem[];
  heading: string;
  subtitle: string;
  countBadge: string;
  searchPlaceholder: string;
  emptyLabel: string;
  defaultOpenId?: string;
}) {
  const [openId, setOpenId] = useState(defaultOpenId);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.name} ${item.summary}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]">
            <GraduationCap className="size-6" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[#1F2A44]">{heading}</h2>
              <span className="rounded-full bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-bold text-[#1E6DEB]">
                {countBadge}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[#5a6072]">{subtitle}</p>
          </div>
        </div>

        <label className="relative block w-full sm:max-w-64">
          <Search
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-[#98A0B4]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-11 w-full rounded-full border border-slate-200 bg-white ps-10 pe-4 text-sm text-[#1F2A44] outline-none transition-colors placeholder:text-[#98A0B4] focus:border-[#1E6DEB]"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-[#5a6072]">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((item, index) => {
            const isOpen = item.id === openId;
            // A lone last tile fills the row, like the reference layout.
            const isLoneLast =
              index === visible.length - 1 && visible.length % 2 === 1;
            return (
              <div
                key={item.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                  isOpen || isLoneLast ? "sm:col-span-2" : "",
                  isOpen
                    ? "border-[#1E6DEB]/40 shadow-[0_20px_45px_-24px_rgba(30,109,235,0.35)]"
                    : "border-slate-200 shadow-sm hover:border-[#1E6DEB]/30 hover:shadow-md",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? undefined : item.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    "group flex w-full items-center gap-4 p-4 text-start transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]",
                    isOpen ? "bg-[#F5F8FF]" : "",
                  )}
                >
                  {item.icon}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-bold text-[#1F2A44]">
                      {item.name}
                    </span>
                    {item.summary ? (
                      <span className="mt-1 block truncate text-xs text-[#5a6072]">
                        {item.summary}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-bold text-[#1E6DEB]">
                    {item.countLabel}
                  </span>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      isOpen
                        ? "bg-[#1E6DEB] text-white"
                        : "bg-[#EEF3FF] text-[#1E6DEB] group-hover:bg-[#DCE7FE]",
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform duration-300 ease-out rtl:rotate-180",
                        isOpen
                          ? "rotate-90 rtl:rotate-90"
                          : "group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
                      )}
                      aria-hidden
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 pt-2">{item.body}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
