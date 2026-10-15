"use client";

import { AlertCircle, Check, Loader2, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { useToast } from "@/components/admin/toast";
import { useUnsavedChanges } from "@/components/admin/unsaved-changes";
import { cn } from "@/lib/utils";

export type BulkValue = string | number | boolean | null;

export type BulkColumn = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "bool";
  options?: { value: string; label: string }[];
  width?: number;
  dir?: "ltr" | "rtl";
  /** Not sent when empty (e.g. a required name). */
  required?: boolean;
};

export type BulkRow = {
  id: string;
  /** Shown in the sticky first column. */
  title: string;
  subtitle?: string;
  href?: string;
  values: Record<string, BulkValue>;
};

function normalize(value: BulkValue) {
  return value === "" ? null : value;
}

/**
 * A spreadsheet for editing many records at once. Changed cells are tinted;
 * "Save" sends one PATCH per changed row through the normal admin API (so
 * the same validation and audit log apply), and a row the API refuses is
 * marked with its reason while the rest still save.
 */
export function BulkGrid({
  columns,
  rows,
  endpoint,
  searchPlaceholder,
}: {
  columns: BulkColumn[];
  rows: BulkRow[];
  /** e.g. "/api/admin/universities/" (the row id is appended). */
  endpoint: string;
  searchPlaceholder: string;
}) {
  const t = useTranslations("Admin.bulk");
  const router = useRouter();
  const { toast } = useToast();
  const [edits, setEdits] = useState<Record<string, Record<string, BulkValue>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<{ done: number; total: number } | null>(null);
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);

  const dirtyIds = Object.keys(edits).filter((id) => Object.keys(edits[id]).length > 0);
  const dirtyCells = dirtyIds.reduce((sum, id) => sum + Object.keys(edits[id]).length, 0);
  useUnsavedChanges(dirtyCells > 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (onlyChanged && !edits[row.id]) return false;
      if (!q) return true;
      return [row.title, row.subtitle ?? "", ...Object.values(row.values).map((value) => String(value ?? ""))]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, onlyChanged, edits]);

  function set(row: BulkRow, key: string, value: BulkValue) {
    setEdits((previous) => {
      const rowEdits = { ...previous[row.id] };
      if (normalize(value) === normalize(row.values[key] ?? null)) delete rowEdits[key];
      else rowEdits[key] = value;
      const next = { ...previous };
      if (Object.keys(rowEdits).length) next[row.id] = rowEdits;
      else delete next[row.id];
      return next;
    });
    setErrors((previous) => {
      if (!previous[row.id]) return previous;
      const next = { ...previous };
      delete next[row.id];
      return next;
    });
  }

  async function save() {
    const ids = dirtyIds;
    setSaving({ done: 0, total: ids.length });
    const failed: Record<string, string> = {};
    let ok = 0;
    for (const [index, id] of ids.entries()) {
      const body = Object.fromEntries(
        Object.entries(edits[id]).map(([key, value]) => {
          const column = columns.find((entry) => entry.key === key);
          if (column?.type === "number") return [key, value === "" || value === null ? null : Number(value)];
          return [key, normalize(value)];
        }),
      );
      const response = await fetch(`${endpoint}${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => null);
      if (response?.ok) ok++;
      else {
        const payload = (await response?.json().catch(() => null)) as { error?: string } | null;
        failed[id] = payload?.error ?? t("rowFailed");
      }
      setSaving({ done: index + 1, total: ids.length });
    }
    setSaving(null);
    setErrors(failed);
    setEdits((previous) => Object.fromEntries(Object.entries(previous).filter(([id]) => failed[id])));
    toast({
      title: t("savedRows", { count: ok }),
      description: Object.keys(failed).length ? t("failedRows", { count: Object.keys(failed).length }) : undefined,
      tone: Object.keys(failed).length ? "error" : "success",
    });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-slate-200 ps-9 pe-3 text-[13.5px] outline-none focus:border-[#1E6DEB]"
          />
        </div>
        <label className="flex items-center gap-2 text-[13px] font-semibold text-[#334155]">
          <input type="checkbox" checked={onlyChanged} onChange={(event) => setOnlyChanged(event.target.checked)} className="size-4 accent-[#1E6DEB]" />
          {t("onlyChanged")}
        </label>
        <span className="text-[12.5px] text-[#64748B]">{t("changedCount", { cells: dirtyCells, rows: dirtyIds.length })}</span>
        <div className="ms-auto flex gap-2">
          <button
            type="button"
            disabled={!dirtyCells || saving !== null}
            onClick={() => {
              setEdits({});
              setErrors({});
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[13px] font-semibold text-[#334155] disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden />
            {t("discard")}
          </button>
          <button
            type="button"
            disabled={!dirtyCells || saving !== null}
            onClick={() => void save()}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-3.5 text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
            {saving ? t("savingProgress", { done: saving.done, total: saving.total }) : t("save", { count: dirtyIds.length })}
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-[#E2E8F0] bg-white" style={{ maxHeight: "calc(100vh - 220px)" }}>
        <table className="w-max min-w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky start-0 z-20 min-w-[240px] border-b border-e border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-start text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">
                {t("record")}
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ minWidth: column.width ?? 150 }}
                  className="border-b border-slate-200 bg-[#F8FAFC] px-2 py-2.5 text-start text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="group">
                <th
                  scope="row"
                  className={cn(
                    "sticky start-0 z-[5] border-b border-e border-slate-100 bg-white px-3 py-1.5 text-start font-normal group-hover:bg-[#FAFBFC]",
                    errors[row.id] && "bg-[#FFF0EE]",
                  )}
                >
                  {row.href ? (
                    <Link href={row.href} className="block max-w-[260px] truncate text-[13px] font-semibold text-[#0F172A] hover:text-[#1E6DEB] hover:underline">
                      {row.title}
                    </Link>
                  ) : (
                    <span className="block max-w-[260px] truncate text-[13px] font-semibold text-[#0F172A]">{row.title}</span>
                  )}
                  {errors[row.id] ? (
                    <span className="mt-0.5 flex items-center gap-1 text-[11.5px] font-semibold text-[#C81F15]">
                      <AlertCircle className="size-3" aria-hidden />
                      {errors[row.id]}
                    </span>
                  ) : row.subtitle ? (
                    <span className="block max-w-[260px] truncate text-[11.5px] text-[#94A3B8]">{row.subtitle}</span>
                  ) : null}
                </th>
                {columns.map((column) => {
                  const edited = edits[row.id] && column.key in edits[row.id];
                  const value = edited ? edits[row.id][column.key] : (row.values[column.key] ?? null);
                  const cell = cn(
                    "h-9 w-full rounded-md border bg-transparent px-2 text-[13px] outline-none transition-colors focus:border-[#1E6DEB] focus:bg-white focus:ring-2 focus:ring-[#1E6DEB]/15",
                    edited ? "border-[#F3DFB4] bg-[#FFFBEA]" : "border-transparent hover:border-slate-200",
                  );
                  return (
                    <td key={column.key} className={cn("border-b border-slate-100 px-1 py-1 group-hover:bg-[#FAFBFC]", edited && "bg-[#FFFBEA]")}>
                      {column.type === "bool" ? (
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            aria-label={`${column.label}: ${row.title}`}
                            checked={Boolean(value)}
                            onChange={(event) => set(row, column.key, event.target.checked)}
                            className="size-4 accent-[#1E6DEB]"
                          />
                        </div>
                      ) : column.type === "select" ? (
                        <select
                          aria-label={`${column.label}: ${row.title}`}
                          value={String(value ?? "")}
                          onChange={(event) => set(row, column.key, event.target.value)}
                          className={cell}
                        >
                          {column.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={column.type === "number" ? "number" : "text"}
                          dir={column.dir}
                          aria-label={`${column.label}: ${row.title}`}
                          value={value === null ? "" : String(value)}
                          onChange={(event) => set(row, column.key, event.target.value)}
                          className={cn(cell, column.type === "number" && "tabular-nums")}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-[13px] text-[#64748B]">
                  {t("noRows")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
