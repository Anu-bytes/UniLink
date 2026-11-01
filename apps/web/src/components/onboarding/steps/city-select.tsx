"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { EGYPT_GOVERNORATES, cityLabel, isGovernorate } from "@/lib/egypt-governorates";
import { Input } from "@/components/ui/input";

/**
 * The student's city. In Egypt it is picked from the governorates (search
 * also matches the main cities in each, e.g. "Mansoura" finds Dakahlia), so
 * it can be compared with where universities are. "Other" at the end of the
 * list switches to typing the city, as it is everywhere outside Egypt.
 */
export function CityField({
  country,
  value,
  onChange,
  searchPlaceholder,
  textPlaceholder,
  clearLabel,
  noMatch,
  otherLabel,
  backToListLabel,
}: {
  country: string | undefined;
  value: string | undefined;
  onChange: (city: string | undefined) => void;
  searchPlaceholder: string;
  textPlaceholder: string;
  clearLabel: string;
  noMatch: string;
  otherLabel: string;
  backToListLabel: string;
}) {
  if (country !== "EG") {
    return <CityInput value={value} onChange={onChange} placeholder={textPlaceholder} />;
  }
  return (
    <EgyptCity
      value={value}
      onChange={onChange}
      searchPlaceholder={searchPlaceholder}
      textPlaceholder={textPlaceholder}
      clearLabel={clearLabel}
      noMatch={noMatch}
      otherLabel={otherLabel}
      backToListLabel={backToListLabel}
    />
  );
}

function CityInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string | undefined;
  onChange: (city: string | undefined) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <Input
      autoComplete="address-level2"
      placeholder={placeholder}
      maxLength={80}
      autoFocus={autoFocus}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  );
}

function EgyptCity({
  value,
  onChange,
  searchPlaceholder,
  textPlaceholder,
  clearLabel,
  noMatch,
  otherLabel,
  backToListLabel,
}: {
  value: string | undefined;
  onChange: (city: string | undefined) => void;
  searchPlaceholder: string;
  textPlaceholder: string;
  clearLabel: string;
  noMatch: string;
  otherLabel: string;
  backToListLabel: string;
}) {
  // A saved city that is not a governorate was typed under "Other".
  const [other, setOther] = useState(Boolean(value) && !isGovernorate(value));

  if (other) {
    return (
      <div className="space-y-1.5">
        <CityInput value={value} onChange={onChange} placeholder={textPlaceholder} autoFocus />
        <button
          type="button"
          onClick={() => {
            setOther(false);
            onChange(undefined);
          }}
          className="text-xs font-medium text-brand-blue hover:underline"
        >
          {backToListLabel}
        </button>
      </div>
    );
  }
  return (
    <GovernorateCombobox
      value={value}
      onChange={onChange}
      onOther={(typed) => {
        setOther(true);
        // Keep what was typed in the search box as the city.
        onChange(typed || undefined);
      }}
      placeholder={searchPlaceholder}
      clearLabel={clearLabel}
      noMatch={noMatch}
      otherLabel={otherLabel}
    />
  );
}

function GovernorateCombobox({
  value,
  onChange,
  onOther,
  placeholder,
  clearLabel,
  noMatch,
  otherLabel,
}: {
  value: string | undefined;
  onChange: (city: string | undefined) => void;
  onOther: (typed: string) => void;
  placeholder: string;
  clearLabel: string;
  noMatch: string;
  otherLabel: string;
}) {
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const q = (open ? query : "").trim().toLowerCase();
    if (!q) return EGYPT_GOVERNORATES.map((governorate) => ({ governorate, via: null as string | null }));
    const rows = [];
    for (const governorate of EGYPT_GOVERNORATES) {
      if (governorate.value.toLowerCase().includes(q) || governorate.ar.includes(q)) {
        rows.push({ governorate, via: null });
        continue;
      }
      const city = governorate.cities.find((name) => name.toLowerCase().includes(q));
      if (city) rows.push({ governorate, via: city });
    }
    return rows;
  }, [open, query]);

  // A governorate's name in the dropdown, or the city as typed when it was saved
  // from the profile page before Egypt was chosen.
  const display = cityLabel(value, locale) ?? "";

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div className="relative">
      <div className="flex items-center rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
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
          id={listId}
          role="listbox"
          onMouseEnter={cancelClose}
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10 duration-150 animate-in fade-in-0 zoom-in-95"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">{noMatch}</li>
          ) : (
            filtered.map(({ governorate, via }) => (
              <li key={governorate.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === governorate.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(governorate.value);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground",
                    value === governorate.value && "bg-accent/60",
                  )}
                >
                  <span className="flex-1">
                    {isArabic ? governorate.ar : governorate.value}
                    {via ? <span className="ms-1.5 text-xs text-muted-foreground">({via})</span> : null}
                  </span>
                  {value === governorate.value ? <Check className="size-4" /> : null}
                </button>
              </li>
            ))
          )}
          <li className="mt-1 border-t border-border pt-1">
            <button
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpen(false);
                onOther(query.trim());
              }}
              className="flex w-full items-center rounded-md px-3 py-2 text-start text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {otherLabel}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
