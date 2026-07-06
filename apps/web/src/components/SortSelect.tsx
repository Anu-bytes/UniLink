"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { useIntl } from "@/i18n/provider";

export function SortSelect() {
  const { m } = useIntl();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "relevance";

  const options = [
    { value: "relevance", label: m.search.sortRelevance },
    { value: "fees_asc", label: m.search.sortFeesAsc },
    { value: "fees_desc", label: m.search.sortFeesDesc },
    { value: "name", label: m.search.sortName },
    { value: "distance", label: m.search.sortDistance },
  ];

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 text-sm">
      <ArrowUpDown className="size-4 text-muted" aria-hidden />
      <span className="text-muted">{m.search.sortBy}:</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-medium text-ink outline-none"
        aria-label={m.search.sortBy}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
