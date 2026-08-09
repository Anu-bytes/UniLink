"use client";

import {
  BadgePercent,
  Banknote,
  ChevronDown,
  GraduationCap,
  MapPin,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition, type ComponentType } from "react";

import { useRouter } from "@/i18n/navigation";
import { FiltersPanel } from "@/components/app/filters-panel";
import { formatNumber } from "@/lib/format";
import {
  QUICK_TAGS,
  TUITION_RANGES,
  countActiveFilters,
  filtersToSearchParams,
  tuitionRangeKeyOf,
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

/**
 * The chip row above the results. Tuition and city get dedicated dropdowns
 * because they are what students narrow on first; everything else stays in the
 * filter drawer behind "Filters & Eligibility".
 */
export function FilterBar({
  filters,
  options,
}: {
  filters: SearchFilters;
  options: FilterOptions;
}) {
  const t = useTranslations("Search");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);

  const activeCount = countActiveFilters(filters);
  const activeTags = new Set(filters.tags ?? []);
  const activeCity = filters.cities?.[0] ?? "";
  const activeRange = tuitionRangeKeyOf(filters);

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

  function selectCity(city: string) {
    push({ ...filters, cities: city ? [city] : undefined });
  }

  function selectTuition(key: string) {
    const range = TUITION_RANGES.find((entry) => entry.key === key);
    push({
      ...filters,
      minTuition: range?.min,
      maxTuition: range?.max,
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
            ? t("filtersCount", { count: formatNumber(locale, activeCount) })
            : t("filtersButton")}
        </button>

        {/* City and tuition are the two filters students reach for first, so
            they sit next to the drawer button and carry more visual weight
            than the perk chips further along the row. */}
        <SelectChip
          icon={MapPin}
          label={t("filters.city")}
          value={activeCity}
          onChange={selectCity}
          placeholder={t("filters.anyCity")}
          options={options.cities}
        />

        <SelectChip
          icon={Banknote}
          label={t("filters.tuition")}
          value={activeRange}
          onChange={selectTuition}
          placeholder={t("filters.anyTuition")}
          options={TUITION_RANGES.map((range) => ({
            value: range.key,
            label: t(`tuitionRanges.${range.key}`),
          }))}
        />

        <span aria-hidden className="hidden h-6 w-px bg-slate-200 sm:block" />

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

/**
 * A native select styled as a chip. Native rather than a custom dropdown so it
 * keeps platform keyboard and touch behaviour, and needs no extra JS.
 */
function SelectChip({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const active = Boolean(value);

  return (
    <div className="relative">
      {/* Icon stays brand blue in both states: these two are the highlighted
          primary filters, so they should read as active controls even before
          anything is chosen. */}
      <Icon
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB]"
        aria-hidden
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 cursor-pointer appearance-none rounded-lg border-2 ps-9 pe-8 text-sm font-semibold shadow-sm outline-none transition-colors focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25",
          active
            ? "border-[#1E6DEB] bg-[#EEF3FF] text-[#1E6DEB]"
            : "border-[#1E6DEB]/35 bg-white text-[#1F2A44] hover:border-[#1E6DEB]/60 hover:bg-[#F7F9FE]",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB]"
        aria-hidden
      />
    </div>
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
