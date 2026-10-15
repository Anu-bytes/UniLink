"use client";

import { Check, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { SelectOption } from "@/components/admin";
import { cn } from "@/lib/utils";

/**
 * Pick the universities a university admin manages: a searchable checklist,
 * with the current picks shown as removable chips above it.
 */
export function UniversityPicker({
  options,
  value,
  onChange,
  invalid,
}: {
  options: SelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
}) {
  const t = useTranslations("Admin.admins");
  const [query, setQuery] = useState("");
  const chosen = new Set(value);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((option) => option.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  function toggle(id: string) {
    onChange(chosen.has(id) ? value.filter((entry) => entry !== id) : [...value, id]);
  }

  return (
    <div className={cn("rounded-xl border bg-white", invalid ? "border-[#F5C2BD]" : "border-slate-200")}>
      {value.length ? (
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 p-2.5">
          {value.map((id) => {
            const option = options.find((entry) => entry.value === id);
            return (
              <span key={id} className="inline-flex items-center gap-1 rounded-full bg-[#EEF3FF] py-1 ps-2.5 pe-1 text-[12.5px] font-semibold text-[#1E3A8A]">
                {option?.label ?? id}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  aria-label={t("unassign", { name: option?.label ?? id })}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-[#DCE6FF]"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}
      <div className="relative border-b border-slate-100">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchUniversities")}
          className="h-10 w-full bg-transparent ps-9 pe-3 text-[13.5px] outline-none"
        />
      </div>
      <ul role="listbox" aria-multiselectable="true" className="max-h-56 overflow-y-auto p-1.5">
        {visible.map((option) => {
          const on = chosen.has(option.value);
          return (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => toggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-[13.5px] transition-colors",
                  on ? "text-[#1E6DEB]" : "text-[#0F172A] hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    on ? "border-[#1E6DEB] bg-[#1E6DEB] text-white" : "border-slate-300",
                  )}
                >
                  {on ? <Check className="size-3" aria-hidden /> : null}
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            </li>
          );
        })}
        {visible.length === 0 ? <li className="px-3 py-4 text-center text-[13px] text-[#94A3B8]">{t("noUniversityMatch")}</li> : null}
      </ul>
    </div>
  );
}
