"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type TabKey = "all" | "faculties" | "universities";

/**
 * Segmented All / Faculties / Universities control for the merged saved
 * page. The two lists are pre-rendered server components (cards, translated
 * text, formatting) passed in as nodes — this only owns which one is shown,
 * so it stays a small client island rather than pulling both card types
 * into the client bundle.
 */
export function SavedTabs({
  facultyCount,
  universityCount,
  facultiesHeading,
  universitiesHeading,
  facultiesNode,
  universitiesNode,
  allLabel,
  facultiesLabel,
  universitiesLabel,
  emptyTabLabel,
}: {
  facultyCount: number;
  universityCount: number;
  facultiesHeading: string;
  universitiesHeading: string;
  facultiesNode: React.ReactNode;
  universitiesNode: React.ReactNode;
  allLabel: string;
  facultiesLabel: string;
  universitiesLabel: string;
  /** Shown when the selected tab (not "All") has nothing saved yet. */
  emptyTabLabel: string;
}) {
  const [tab, setTab] = useState<TabKey>("all");

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: allLabel, count: facultyCount + universityCount },
    { key: "faculties", label: facultiesLabel, count: facultyCount },
    { key: "universities", label: universitiesLabel, count: universityCount },
  ];

  const showFaculties = facultyCount > 0 && (tab === "all" || tab === "faculties");
  const showUniversities =
    universityCount > 0 && (tab === "all" || tab === "universities");

  return (
    <div>
      <div
        role="tablist"
        className="mt-5 inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1"
      >
        {tabs.map((entry) => {
          const active = entry.key === tab;
          return (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(entry.key)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-white text-[#1F2A44] shadow-sm"
                  : "text-[#5a6072] hover:text-[#1F2A44]",
              )}
            >
              {entry.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-bold",
                  active ? "bg-slate-100 text-[#5a6072]" : "bg-slate-200/70 text-[#5a6072]",
                )}
              >
                {entry.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* "All" shows both as clearly headed sections rather than one mixed
          grid — a program card and a university card already look different
          (blue vs. red, different actions), but a heading makes it explicit
          instead of relying on visitors to notice the color. */}
      {showFaculties ? (
        <section className="mt-6">
          {tab === "all" ? (
            <h2 className="text-base font-bold text-[#1F2A44]">
              {facultiesHeading}
            </h2>
          ) : null}
          <div className="mt-3 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {facultiesNode}
          </div>
        </section>
      ) : null}

      {showUniversities ? (
        <section className="mt-8">
          {tab === "all" ? (
            <h2 className="text-base font-bold text-[#1F2A44]">
              {universitiesHeading}
            </h2>
          ) : null}
          <div className="mt-3 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {universitiesNode}
          </div>
        </section>
      ) : null}

      {/* A single-type tab with nothing in it yet — "All" never lands here,
          it just omits the empty section entirely. */}
      {tab !== "all" &&
      ((tab === "faculties" && facultyCount === 0) ||
        (tab === "universities" && universityCount === 0)) ? (
        <p className="mt-10 text-center text-sm text-[#5a6072]">
          {emptyTabLabel}
        </p>
      ) : null}
    </div>
  );
}
