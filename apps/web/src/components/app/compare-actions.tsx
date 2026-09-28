"use client";

import { ChevronDown, Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import {
  compareKindParam,
  useCompare,
  type CompareEntry,
} from "@/components/app/compare-context";

/**
 * When someone opens /app/compare without ids (a bookmark, or the sidebar),
 * seed the URL from the tray so the server can render the table.
 */
export function CompareBootstrap({ hasIds }: { hasIds: boolean }) {
  const router = useRouter();
  const { ids, kind, ready } = useCompare();

  useEffect(() => {
    if (!ready || hasIds || ids.length === 0) return;
    router.replace(`/app/compare?ids=${ids.join(",")}${compareKindParam(kind)}`);
  }, [hasIds, ids, kind, ready, router]);

  return null;
}

/**
 * Keeps the tray in sync with a comparison opened from a shared link: any id in
 * the URL that is not in local state gets added.
 */
export function CompareSync({
  entries,
}: {
  entries: CompareEntry[];
}) {
  const { ids, toggle, ready } = useCompare();

  useEffect(() => {
    if (!ready) return;
    for (const entry of entries) {
      if (!ids.includes(entry.id)) toggle(entry);
    }
    // Runs when the server-rendered set changes, not on every tray edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, entries.map((entry) => entry.id).join(",")]);

  return null;
}

export function CompareRemoveButton({
  id,
  name,
  remainingIds,
}: {
  id: string;
  name: string;
  remainingIds: string[];
}) {
  const t = useTranslations("Compare");
  const router = useRouter();
  const { remove, kind } = useCompare();

  return (
    <button
      type="button"
      aria-label={t("remove")}
      title={`${t("remove")}: ${name}`}
      onClick={() => {
        remove(id);
        const next = remainingIds.filter((value) => value !== id);
        router.replace(
          next.length > 0
            ? `/app/compare?ids=${next.join(",")}${compareKindParam(kind)}`
            : "/app/compare",
        );
      }}
      className="flex size-8 items-center justify-center rounded-full text-[#98A0B4] transition-colors hover:bg-slate-100 hover:text-[#1F2A44]"
    >
      <X className="size-4" aria-hidden />
    </button>
  );
}

export type CsvTable = { headers: string[]; rows: string[][] };

/** Download split button: CSV export, or the browser's print/save-as-PDF sheet. */
export function CompareDownload({ table }: { table: CsvTable }) {
  const t = useTranslations("Compare");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // A plain <details> element doesn't close on an outside click, and stays
  // open even after one of its own buttons is clicked — same bug the app
  // shell's account menu and the old mobile nav had.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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

  function downloadCsv() {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [table.headers, ...table.rows]
      .map((row) => row.map(escape).join(","))
      .join("\r\n");

    // The BOM makes Excel read the Arabic columns as UTF-8.
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "unilink-compare.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div ref={rootRef} className="relative print:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#1E6DEB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
      >
        <Download className="size-4" aria-hidden />
        {t("download")}
        <ChevronDown className="size-4" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-30 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              downloadCsv();
              setOpen(false);
            }}
            className="flex min-h-11 w-full items-center rounded-lg px-3 text-start text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
          >
            {t("downloadCsv")}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              window.print();
            }}
            className="flex min-h-11 w-full items-center rounded-lg px-3 text-start text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
          >
            {t("downloadPrint")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
