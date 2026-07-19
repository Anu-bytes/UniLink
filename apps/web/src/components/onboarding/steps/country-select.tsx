"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { COUNTRIES, countryName, flagEmoji, flagSrc } from "@/lib/countries";

/** Flag as an image when we ship one, otherwise the emoji (with letters on Windows). */
function Flag({ code, className }: { code: string; className?: string }) {
  const src = flagSrc(code);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        className={cn("inline-block rounded-sm object-cover", className)}
      />
    );
  }
  return (
    <span className={className} aria-hidden>
      {flagEmoji(code)}
    </span>
  );
}

function useFilteredCountries(query: string, exclude: Set<string> = new Set()) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    // Match either English or Arabic name so search works in both languages.
    return COUNTRIES.filter(
      (c) =>
        !exclude.has(c.code) &&
        (q === "" ||
          c.name.toLowerCase().includes(q) ||
          c.nameAr.includes(query.trim())),
    );
  }, [query, exclude]);
}

/** Flag-card multi-select grid of popular destinations (destination step). */
export function CountryCardGrid({
  value,
  onChange,
  codes,
  max = 5,
}: {
  value: string[];
  onChange: (codes: string[]) => void;
  codes: readonly string[];
  max?: number;
}) {
  const locale = useLocale();
  const selected = new Set(value);
  const atMax = value.length >= max;

  function toggle(code: string) {
    if (selected.has(code)) {
      onChange(value.filter((c) => c !== code));
    } else if (!atMax) {
      onChange([...value, code]);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {codes.map((code) => {
        const isSelected = selected.has(code);
        const disabled = atMax && !isSelected;
        return (
          <button
            key={code}
            type="button"
            onClick={() => toggle(code)}
            aria-pressed={isSelected}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-150 motion-reduce:transition-none",
              isSelected
                ? "border-brand-blue bg-brand-blue-light shadow-sm ring-1 ring-brand-blue/30"
                : "border-input hover:-translate-y-0.5 hover:border-brand-blue/40 hover:bg-muted/40 active:scale-[0.98]",
              disabled && "opacity-40",
            )}
          >
            <Flag code={code} className="h-8 w-11 text-3xl leading-none" />
            <span className="text-sm font-medium">
              {countryName(code, locale)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Single-select searchable country combobox (nationality step). */
export function CountryCombobox({
  value,
  onChange,
  placeholder,
  clearLabel,
}: {
  value: string | undefined;
  onChange: (code: string | undefined) => void;
  placeholder: string;
  clearLabel: string;
}) {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtered = useFilteredCountries(open ? query : "");

  const display = value ? countryName(value, locale) : "";

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div className="relative">
      <div className="flex items-center rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {value ? (
          <span className="ps-3 text-lg" aria-hidden>
            {flagEmoji(value)}
          </span>
        ) : null}
        <input
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={open ? query : display}
          placeholder={placeholder}
          onFocus={() => {
            cancelClose();
            setOpen(true);
            setQuery("");
          }}
          onBlur={scheduleClose}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        {value ? (
          <button
            type="button"
            aria-label={clearLabel}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange(undefined);
              setQuery("");
            }}
            className="px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
        <ChevronDown className="me-3 size-4 shrink-0 text-muted-foreground" />
      </div>

      {open ? (
        <ul
          role="listbox"
          onMouseEnter={cancelClose}
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10 duration-150 animate-in fade-in-0 zoom-in-95"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">—</li>
          ) : (
            filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === c.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(c.code);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground",
                    value === c.code && "bg-accent/60",
                  )}
                >
                  <span className="text-lg" aria-hidden>
                    {flagEmoji(c.code)}
                  </span>
                  <span className="flex-1">{countryName(c.code, locale)}</span>
                  {value === c.code ? <Check className="size-4" /> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

/** Multi-select country picker with removable chips (destination step). */
export function CountryMultiSelect({
  value,
  onChange,
  placeholder,
  max = 5,
}: {
  value: string[];
  onChange: (codes: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = useMemo(() => new Set(value), [value]);
  const filtered = useFilteredCountries(query, selected);
  const atMax = value.length >= max;

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function toggle(code: string) {
    if (selected.has(code)) {
      onChange(value.filter((c) => c !== code));
    } else if (!atMax) {
      onChange([...value, code]);
    }
    setQuery("");
  }

  return (
    <div className="space-y-2">
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((code) => (
            <li key={code}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-light py-1 pe-1 ps-2.5 text-sm text-brand-blue-dark">
                <span aria-hidden>{flagEmoji(code)}</span>
                {countryName(code)}
                <button
                  type="button"
                  aria-label={`Remove ${countryName(code)}`}
                  onClick={() => toggle(code)}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-brand-blue/15"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <input
          role="combobox"
          aria-expanded={open}
          value={query}
          disabled={atMax}
          placeholder={atMax ? "" : placeholder}
          onFocus={() => {
            cancelClose();
            setOpen(true);
          }}
          onBlur={scheduleClose}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50 placeholder:text-muted-foreground"
        />

        {open && !atMax ? (
          <ul
            role="listbox"
            onMouseEnter={cancelClose}
            className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10 duration-150 animate-in fade-in-0 zoom-in-95"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">—</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggle(c.code)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="text-lg" aria-hidden>
                      {flagEmoji(c.code)}
                    </span>
                    <span className="flex-1">{c.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
