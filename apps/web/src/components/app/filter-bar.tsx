"use client";

import {
  BadgePercent,
  Banknote,
  Check,
  ChevronDown,
  GraduationCap,
  MapPin,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ComponentType,
} from "react";

import { useRouter } from "@/i18n/navigation";
import { FiltersPanel } from "@/components/app/filters-panel";
import { formatNumber } from "@/lib/format";
import {
  MAX_CITIES,
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
  const activeCities = filters.cities ?? [];
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

  function toggleCity(city: string) {
    const cities = new Set(activeCities);
    if (cities.has(city)) {
      cities.delete(city);
    } else {
      // Same cap as the drawer's city chips (see MAX_CITIES) — a blocked
      // click is a no-op here too, communicated by the checkbox's disabled
      // state rather than by swapping out an existing choice.
      if (cities.size >= MAX_CITIES) return;
      cities.add(city);
    }
    push({ ...filters, cities: cities.size > 0 ? [...cities] : undefined });
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
        <CityMultiSelect
          selected={activeCities}
          onToggle={toggleCity}
          options={options.cities}
          label={t("filters.city")}
          placeholder={t("filters.anyCity")}
          moreLabel={(count) => t("filters.moreCities", { count })}
          limitLabel={t("filters.cityLimit", {
            count: activeCities.length,
            max: MAX_CITIES,
          })}
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
 * The city filter, styled to match SelectChip but backed by checkboxes rather
 * than a native `<select>` — a native select has no multi-select affordance a
 * casual user would find (it needs a ctrl/cmd-click most people never learn),
 * so picking several cities needs a real checklist instead.
 */
function CityMultiSelect({
  selected,
  onToggle,
  options,
  label,
  placeholder,
  moreLabel,
  limitLabel,
}: {
  selected: string[];
  onToggle: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  placeholder: string;
  /** "+2" for however many are selected beyond the first, shown on the trigger. */
  moreLabel: (extraCount: number) => string;
  /** e.g. "2 / 5", shown as a caption inside the list. */
  limitLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const atMax = selected.length >= MAX_CITIES;

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

  const firstLabel = options.find((option) => option.value === selected[0])?.label;
  const triggerText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (firstLabel ?? placeholder)
        : `${firstLabel ?? selected[0]} ${moreLabel(selected.length - 1)}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 max-w-52 cursor-pointer items-center gap-2 rounded-lg border-2 ps-9 pe-8 text-sm font-semibold shadow-sm outline-none transition-colors focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25",
          selected.length > 0
            ? "border-[#1E6DEB] bg-[#EEF3FF] text-[#1E6DEB]"
            : "border-[#1E6DEB]/35 bg-white text-[#1F2A44] hover:border-[#1E6DEB]/60 hover:bg-[#F7F9FE]",
        )}
      >
        <MapPin
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB]"
          aria-hidden
        />
        <span className="truncate">{triggerText}</span>
        <ChevronDown
          className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB]"
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          className="absolute start-0 top-full z-20 mt-1.5 max-h-72 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          <p className="px-2 pb-1.5 pt-1 text-xs font-semibold text-[#98A0B4]">
            {limitLabel}
          </p>
          {options.map((option) => {
            const active = selected.includes(option.value);
            const disabled = !active && atMax;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                disabled={disabled}
                onClick={() => onToggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm font-medium transition-colors",
                  disabled
                    ? "cursor-not-allowed text-[#C3C8D4]"
                    : active
                      ? "text-[#1E6DEB]"
                      : "text-[#1F2A44] hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    active
                      ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
                      : "border-slate-300",
                  )}
                >
                  {active ? <Check className="size-3" aria-hidden /> : null}
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
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
