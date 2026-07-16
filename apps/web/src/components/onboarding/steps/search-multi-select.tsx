"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type MultiOption = { value: string; label: string };

/**
 * Generic searchable multi-select: a search box with a dropdown of options and
 * the chosen items shown as removable chips below (ApplyBoard style). Caps the
 * selection at `max`.
 */
export function SearchMultiSelect({
  value,
  onChange,
  options,
  placeholder,
  max = 3,
  emptyLabel,
  counterLabel,
}: {
  value: string[];
  onChange: (values: string[]) => void;
  options: readonly MultiOption[];
  placeholder: string;
  max?: number;
  emptyLabel: string;
  /** e.g. "2 of 3 selected" — receives (selected, max). */
  counterLabel: (selected: number, max: number) => string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = useMemo(() => new Set(value), [value]);
  const atMax = value.length >= max;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => !selected.has(o.value) && (q === "" || o.label.toLowerCase().includes(q)),
    );
  }, [query, options, selected]);

  const labelFor = (val: string) =>
    options.find((o) => o.value === val)?.label ?? val;

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function add(val: string) {
    if (atMax || selected.has(val)) return;
    onChange([...value, val]);
    setQuery("");
  }
  function remove(val: string) {
    onChange(value.filter((v) => v !== val));
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <Search className="ms-3 size-4 shrink-0 text-muted-foreground" />
          <input
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
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
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none disabled:opacity-50 placeholder:text-muted-foreground"
          />
          <ChevronDown className="me-3 size-4 shrink-0 text-muted-foreground" />
        </div>

        {open && !atMax ? (
          <ul
            role="listbox"
            onMouseEnter={cancelClose}
            className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10 duration-150 animate-in fade-in-0 zoom-in-95"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {emptyLabel}
              </li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(o.value)}
                    className="flex w-full items-center rounded-md px-3 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {counterLabel(value.length, max)}
      </p>

      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((val) => (
            <li key={val}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-light py-1 pe-1 ps-3 text-sm text-brand-blue-dark duration-200 animate-in fade-in-0 zoom-in-95">
                {labelFor(val)}
                <button
                  type="button"
                  aria-label={`Remove ${labelFor(val)}`}
                  onClick={() => remove(val)}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-brand-blue/15"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
