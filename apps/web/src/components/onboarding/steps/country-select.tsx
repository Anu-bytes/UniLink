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
