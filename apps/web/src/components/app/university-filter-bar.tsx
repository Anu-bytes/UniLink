"use client";

import { Building2, Check, ChevronDown, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition, type ComponentType } from "react";

import { useRouter } from "@/i18n/navigation";
import { MAX_CITIES, UNIVERSITY_TYPES } from "@/lib/program-filters";
import { cn } from "@/lib/utils";

/**
 * Type + city chips for the university search mode, styled to match
 * UniversitySearchBar's red scheme rather than FilterBar's blue one, so the
 * two modes stay visually distinct the way SearchModeSwitch already promises.
 * City is multi-select (same MAX_CITIES cap as the faculty mode's picker);
 * type stays single-select since a university only ever has one.
 */
export function UniversityFilterBar({
  query,
  type,
  cities,
  cityOptions,
}: {
  query: string;
  type: string;
  cities: string[];
  cityOptions: { value: string; label: string }[];
}) {
  const t = useTranslations("Search");
  const tDir = useTranslations("UniversityDirectory");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function push(next: { type?: string; cities?: string[] }) {
    const params = new URLSearchParams();
    params.set("mode", "universities");
    if (query) params.set("q", query);
    const nextType = next.type ?? type;
    const nextCities = next.cities ?? cities;
    if (nextType) params.set("type", nextType);
    if (nextCities.length > 0) params.set("city", nextCities.join(","));

    startTransition(() => {
      router.replace(`/app/search?${params.toString()}`, { scroll: false });
    });
  }

  function toggleCity(city: string) {
    const next = new Set(cities);
    if (next.has(city)) {
      next.delete(city);
    } else {
      if (next.size >= MAX_CITIES) return;
      next.add(city);
    }
    push({ cities: [...next] });
  }

  const hasFilters = Boolean(type || cities.length > 0);

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-pending={isPending || undefined}
    >
      <SelectChip
        icon={Building2}
        label={tDir("typeLabel")}
        value={type}
        onChange={(value) => push({ type: value })}
        placeholder={tDir("allTypes")}
        options={UNIVERSITY_TYPES.map((value) => ({
          value,
          label: tCatalog(`universityTypes.${value}`),
        }))}
      />

      <CityMultiSelect
        selected={cities}
        onToggle={toggleCity}
        options={cityOptions}
        label={tDir("cityLabel")}
        placeholder={tDir("allCities")}
        moreLabel={(count) => t("filters.moreCities", { count })}
        limitLabel={t("filters.cityLimit", { count: cities.length, max: MAX_CITIES })}
      />

      {hasFilters ? (
        <button
          type="button"
          onClick={() => push({ type: "", cities: [] })}
          className="inline-flex min-h-10 items-center gap-1 px-2 text-sm font-semibold text-[#5a6072] hover:text-[#F82C1F]"
        >
          <X className="size-4" aria-hidden />
          {t("clearAll")}
        </button>
      ) : null}
    </div>
  );
}

/** Same checklist-in-a-popover pattern as FilterBar's CityMultiSelect, red
 * instead of blue: a native multi-select needs a ctrl/cmd-click almost no one
 * discovers, so picking several cities needs a real checklist instead. */
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
  moreLabel: (extraCount: number) => string;
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

  const active = selected.length > 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 max-w-52 cursor-pointer items-center gap-2 rounded-lg border-2 ps-9 pe-8 text-sm font-semibold shadow-sm outline-none transition-colors focus-visible:border-[#F82C1F] focus-visible:ring-2 focus-visible:ring-[#F82C1F]/25",
          active
            ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
            : "border-[#F82C1F]/35 bg-white text-[#1F2A44] hover:border-[#F82C1F]/60 hover:bg-[#FFF7F6]",
        )}
      >
        <MapPin
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#F82C1F]"
          aria-hidden
        />
        <span className="truncate">{triggerText}</span>
        <ChevronDown
          className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#F82C1F]"
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
            const isSelected = selected.includes(option.value);
            const disabled = !isSelected && atMax;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                onClick={() => onToggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm font-medium transition-colors",
                  disabled
                    ? "cursor-not-allowed text-[#C3C8D4]"
                    : isSelected
                      ? "text-[#F82C1F]"
                      : "text-[#1F2A44] hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-[#F82C1F] bg-[#F82C1F] text-white"
                      : "border-slate-300",
                  )}
                >
                  {isSelected ? <Check className="size-3" aria-hidden /> : null}
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
      <Icon
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#F82C1F]"
        aria-hidden
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 cursor-pointer appearance-none rounded-lg border-2 ps-9 pe-8 text-sm font-semibold shadow-sm outline-none transition-colors focus-visible:border-[#F82C1F] focus-visible:ring-2 focus-visible:ring-[#F82C1F]/25",
          active
            ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
            : "border-[#F82C1F]/35 bg-white text-[#1F2A44] hover:border-[#F82C1F]/60 hover:bg-[#FFF7F6]",
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
        className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#F82C1F]"
        aria-hidden
      />
    </div>
  );
}
