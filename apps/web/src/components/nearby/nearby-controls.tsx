"use client";

import { Slider } from "@base-ui/react/slider";
import { Check, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";

import type { NearbyField } from "@/lib/nearby";
import { NEARBY_RADII, NEARBY_RADIUS_MAX, NEARBY_RADIUS_MIN } from "@/lib/nearby-filters";
import { normalize } from "@/lib/normalize-text";
import { cn } from "@/lib/utils";

/** "850 m", "4.2 km", "37 km": Latin digits, as everywhere else on the site. */
export function useFormatDistance() {
  const t = useTranslations("Nearby");
  const locale = useLocale();
  return useMemo(() => {
    const format = (value: number, digits: number) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: digits, numberingSystem: "latn" }).format(value);
    return (km: number) =>
      km < 1
        ? t("m", { value: format(Math.max(10, Math.round((km * 1000) / 10) * 10), 0) })
        : t("km", { value: format(km, km < 10 ? 1 : 0) });
  }, [locale, t]);
}

/** Searchable single-choice list of fields of study, with how many universities teach each. */
export function FieldList({
  fields,
  value,
  onChange,
  autoFocus = false,
  className,
}: {
  fields: NearbyField[];
  value: string | null;
  onChange: (value: string | null) => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const t = useTranslations("Nearby");
  const [query, setQuery] = useState("");
  const listId = useId();
  const shown = useMemo(() => {
    const q = normalize(query);
    return q ? fields.filter((field) => normalize(field.label).includes(q)) : fields;
  }, [fields, query]);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <label className="relative block">
        <span className="sr-only">{t("controls.fieldSearch")}</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("controls.fieldSearch")}
          autoComplete="off"
          aria-controls={listId}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-3 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-[#1E6DEB] focus:shadow-[0_0_0_3px_rgba(30,109,235,0.12)]"
        />
      </label>
      <ul id={listId} role="listbox" aria-label={t("controls.field")} className="ul-thin-scroll mt-2 min-h-0 flex-1 overflow-y-auto">
        {!query ? (
          <FieldOption selected={value === null} onSelect={() => onChange(null)} label={t("controls.anyField")} />
        ) : null}
        {shown.map((field) => (
          <FieldOption
            key={field.value}
            selected={value === field.value}
            onSelect={() => onChange(field.value)}
            label={field.label}
            count={t("controls.universitiesCount", { count: field.count })}
          />
        ))}
        {shown.length === 0 ? <li className="px-3 py-6 text-center text-sm text-slate-400">{t("controls.noField")}</li> : null}
      </ul>
    </div>
  );
}

function FieldOption({
  selected,
  onSelect,
  label,
  count,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  count?: string;
}) {
  return (
    <li role="option" aria-selected={selected}>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]",
          selected ? "bg-[#EFF5FF] font-medium text-[#1E6DEB]" : "text-slate-700 hover:bg-slate-50",
        )}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count ? <span className={cn("shrink-0 text-xs", selected ? "text-[#1E6DEB]/70" : "text-slate-400")}>{count}</span> : null}
        <Check className={cn("size-4 shrink-0 transition-opacity", selected ? "opacity-100" : "opacity-0")} aria-hidden />
      </button>
    </li>
  );
}

/** A row of mutually exclusive options with a sliding highlight. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative grid rounded-lg bg-slate-100 p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 start-1 rounded-md bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.04)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] rtl:[--dir:-1]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(calc(${index * 100}% * var(--dir, 1)))`,
        }}
      />
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#1E6DEB]",
              size === "sm" ? "h-7 text-xs" : "h-8 text-[13px]",
              active ? "text-slate-900" : "text-slate-500 hover:text-slate-800",
            )}
          >
            {option.icon}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Maximum distance: a slider (5 to 150 km), quick picks, or no limit. */
export function DistanceControl({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const t = useTranslations("Nearby");
  const [last, setLast] = useState(value ?? 25);
  const current = value ?? last;
  const any = value === null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={cn("text-2xl font-semibold tabular-nums tracking-tight transition-colors", any ? "text-slate-300" : "text-slate-900")}>
          {t("km", { value: current })}
        </span>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-slate-600">
          {t("controls.anyDistance")}
          <button
            type="button"
            role="switch"
            aria-checked={any}
            onClick={() => onChange(any ? last : null)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
              any ? "bg-[#1E6DEB]" : "bg-slate-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white shadow transition-[inset-inline-start] duration-200",
                any ? "start-[18px]" : "start-0.5",
              )}
            />
          </button>
        </label>
      </div>

      <Slider.Root
        value={current}
        min={NEARBY_RADIUS_MIN}
        max={NEARBY_RADIUS_MAX}
        step={5}
        onValueChange={(next) => {
          const km = Array.isArray(next) ? next[0]! : next;
          setLast(km);
          onChange(km);
        }}
        className={cn("mt-3 transition-opacity", any && "opacity-45")}
      >
        <Slider.Control className="flex h-6 w-full touch-none items-center select-none">
          <Slider.Track className="relative h-1.5 w-full rounded-full bg-slate-200">
            <Slider.Indicator className="rounded-full bg-[#1E6DEB]" />
            <Slider.Thumb
              aria-label={t("controls.distance")}
              className="size-5 rounded-full border-2 border-[#1E6DEB] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.25)] transition-[box-shadow] has-[:focus-visible]:shadow-[0_0_0_4px_rgba(30,109,235,0.2)] data-dragging:shadow-[0_0_0_6px_rgba(30,109,235,0.15)]"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      <div className="mt-3 flex gap-1.5">
        {NEARBY_RADII.map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => {
              setLast(km);
              onChange(km);
            }}
            className={cn(
              "h-7 flex-1 rounded-md border text-xs font-medium transition-colors",
              value === km
                ? "border-[#1E6DEB] bg-[#EFF5FF] text-[#1E6DEB]"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {t("km", { value: km })}
          </button>
        ))}
      </div>
    </div>
  );
}
