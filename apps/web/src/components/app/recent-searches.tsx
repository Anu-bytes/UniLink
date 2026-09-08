"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

export type RecentSearchEntry = { label: string; href: string };

const STORAGE_KEY = "unilink.recentFacultySearches";
const MAX_ENTRIES = 5;

function readEntries(): RecentSearchEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentSearchEntry[]) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: RecentSearchEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Best-effort only: a private-browsing visitor just never gets recent
    // searches remembered, nothing else depends on this succeeding.
  }
}

/** Records the current search once it actually runs, so the empty state
 * before the next visit can offer it as a one-click shortcut. Only text
 * queries get recorded (a filter-only search has no good short label to
 * show as a chip). Deduped by URL, newest first, capped at MAX_ENTRIES. */
export function RecentSearchRecorder({ query, href }: { query: string; href: string }) {
  useEffect(() => {
    const label = query.trim();
    if (!label) return;
    const deduped = readEntries().filter((entry) => entry.href !== href);
    writeEntries([{ label, href }, ...deduped].slice(0, MAX_ENTRIES));
  }, [query, href]);

  return null;
}

/** Shown in the empty state before a search: shortcuts back to whatever this
 * browser searched for recently. Renders nothing until mounted (localStorage
 * doesn't exist during SSR, so this avoids a server/client mismatch) and
 * nothing at all if there's no history yet or storage is blocked. */
export function RecentSearches() {
  const t = useTranslations("Search");
  const [entries, setEntries] = useState<RecentSearchEntry[] | null>(null);

  useEffect(() => {
    setEntries(readEntries());
  }, []);

  if (!entries || entries.length === 0) return null;

  return (
    <div className="mt-7">
      <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#98A0B4]">
        <Clock className="size-3.5" aria-hidden />
        {t("recentSearches")}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#1F2A44] transition-colors hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB]"
          >
            {entry.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
