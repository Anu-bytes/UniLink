"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import {
  filtersToSearchParams,
  type SearchFilters,
} from "@/lib/program-filters";

const SORTS = ["match", "tuitionAsc", "tuitionDesc", "name"] as const;

export function SortSelect({ filters }: { filters: SearchFilters }) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t("sortLabel")}</span>
      <select
        value={filters.sort}
        disabled={isPending}
        onChange={(event) => {
          const query = filtersToSearchParams({
            ...filters,
            sort: event.target.value as SearchFilters["sort"],
            page: 1,
          }).toString();
          startTransition(() =>
            router.replace(`/app/search${query ? `?${query}` : ""}`, {
              scroll: false,
            }),
          );
        }}
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB]"
      >
        {SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {t(`sort.${sort}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
