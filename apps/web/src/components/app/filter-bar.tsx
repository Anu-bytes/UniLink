"use client";

import {
  BadgePercent,
  Banknote,
  GraduationCap,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition, type ComponentType } from "react";

import { useRouter } from "@/i18n/navigation";
import { FiltersPanel } from "@/components/app/filters-panel";
import {
  QUICK_TAGS,
  countActiveFilters,
  filtersToSearchParams,
  type ProgramTagValue,
  type SearchFilters,
} from "@/lib/program-filters";
import { cn } from "@/lib/utils";

const TAG_ICONS: Record<ProgramTagValue, ComponentType<{ className?: string }>> = {
  WAIVED_APPLICATION_FEE: Banknote,
  SCHOLARSHIPS_AVAILABLE: BadgePercent,
  FAST_ACCEPTANCE: Zap,
  HIGH_JOB_DEMAND: GraduationCap,
  FINANCIAL_AID_AVAILABLE: Banknote,
  CREDIT_HOURS: GraduationCap,
};

export type FilterOptions = {
  cities: { value: string; label: string }[];
  universities: { value: string; label: string }[];
};

/** The chip row: the full-filters opener plus the quick tag toggles. */
export function FilterBar({
  filters,
  options,
}: {
  filters: SearchFilters;
  options: FilterOptions;
}) {
  const t = useTranslations("Search");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);

  const activeCount = countActiveFilters(filters);
  const activeTags = new Set(filters.tags ?? []);

  function push(next: SearchFilters) {
    const query = filtersToSearchParams({ ...next, page: 1 }).toString();
    startTransition(() =>
      router.replace(`/app/search${query ? `?${query}` : ""}`, { scroll: false }),
    );
  }

  function toggleTag(tag: ProgramTagValue) {
    const tags = new Set(activeTags);
    if (tags.has(tag)) tags.delete(tag);
    else tags.add(tag);

    push({
      ...filters,
      tags: tags.size > 0 ? ([...tags] as SearchFilters["tags"]) : undefined,
    });
  }

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-2"
        data-pending={isPending || undefined}
      >
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className={cn(
            "inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
            activeCount > 0
              ? "border-[#1E6DEB] bg-[#EEF3FF] text-[#1E6DEB]"
              : "border-[#1E6DEB] text-[#1E6DEB] hover:bg-[#EEF3FF]",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {activeCount > 0
            ? t("filtersCount", { count: activeCount })
            : t("filtersButton")}
        </button>

        {QUICK_TAGS.map((tag) => {
          const Icon = TAG_ICONS[tag];
          const active = activeTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                active
                  ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
                  : "border-slate-200 text-[#5a6072] hover:bg-slate-50",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {tCatalog(`tags.${tag}`)}
            </button>
          );
        })}

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => push({ ...filters, ...EMPTY_FILTERS })}
            className="min-h-10 px-2 text-sm font-semibold text-[#5a6072] underline-offset-2 hover:text-[#1E6DEB] hover:underline"
          >
            {t("clearAll")}
          </button>
        ) : null}
      </div>

      {panelOpen ? (
        <FiltersPanel
          filters={filters}
          options={options}
          onClose={() => setPanelOpen(false)}
          onApply={(next) => {
            setPanelOpen(false);
            push(next);
          }}
        />
      ) : null}
    </>
  );
}

/** Everything a "clear all" resets, leaving the free-text query in place. */
const EMPTY_FILTERS = {
  fields: undefined,
  levels: undefined,
  cities: undefined,
  universities: undefined,
  universityTypes: undefined,
  tags: undefined,
  minTuition: undefined,
  maxTuition: undefined,
  budgetBand: undefined,
  intakeYear: undefined,
  intakeSeason: undefined,
} satisfies Partial<SearchFilters>;
