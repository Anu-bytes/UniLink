"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff, Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIntl } from "@/i18n/provider";
import { pick } from "@/lib/format";
import { matches } from "@/lib/normalize";
import type { Bilingual } from "@/lib/types";

export function Field({
  label,
  htmlFor,
  required,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const { m } = useIntl();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-accent">*</span>}
        {optional && (
          <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[11px] font-normal text-muted">
            {m.auth.optional}
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-accent">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full h-11 rounded-[10px] border bg-surface px-3 text-sm text-ink placeholder:text-muted outline-none transition-colors focus:border-brand";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  error,
  required,
  optional,
  autoComplete,
  inputMode,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onBlur?: () => void;
}) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id} required={required} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        dir={type === "email" || type === "tel" ? "ltr" : undefined}
        className={cn(inputBase, error && "border-accent focus:border-accent")}
      />
    </Field>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  autoComplete,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  onBlur?: () => void;
}) {
  const id = useId();
  const { m } = useIntl();
  const [show, setShow] = useState(false);
  return (
    <Field label={label} htmlFor={id} required hint={hint} error={error}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={cn(inputBase, "pe-11", error && "border-accent focus:border-accent")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? m.auth.hidePassword : m.auth.showPassword}
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted hover:text-ink"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </Field>
  );
}

/** Selectable option cards (single- or multi-select). */
export function ChoiceGroup<T extends string>({
  options,
  selected,
  onToggle,
  columns = 1,
  disabledUnselected = false,
}: {
  options: { id: T; label: Bilingual }[];
  selected: T[];
  onToggle: (id: T) => void;
  columns?: 1 | 2 | 3;
  disabledUnselected?: boolean;
}) {
  const { locale } = useIntl();
  const cols = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3" }[columns];
  return (
    <div className={cn("grid gap-2", cols)}>
      {options.map((o) => {
        const active = selected.includes(o.id);
        const disabled = disabledUnselected && !active;
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onToggle(o.id)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-[10px] border px-3.5 py-2.5 text-start text-sm font-medium transition-colors",
              active
                ? "border-brand bg-brand-50 text-brand-600"
                : "border-line bg-surface text-ink hover:border-brand-200",
              disabled && "cursor-not-allowed opacity-40 hover:border-line",
            )}
          >
            <span>{pick(o.label, locale)}</span>
            {active && <Check className="size-4 shrink-0 text-brand" />}
          </button>
        );
      })}
    </div>
  );
}

/** Branded dropdown (styled trigger + scrollable popover). */
export function Select({
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    // bring the selected option into view
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <Field label={label} htmlFor={id} required={required} error={error}>
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          className={cn(
            inputBase,
            "flex items-center justify-between text-start",
            open && "border-brand",
            error && "border-accent focus:border-accent",
          )}
        >
          <span className={cn(!selected && "text-muted")}>{selected ? selected.label : placeholder ?? "—"}</span>
          <ChevronDown className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-[10px] border border-line bg-surface py-1 shadow-lg"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3.5 py-2 text-start text-sm",
                      active ? "bg-brand-50 font-medium text-brand-600" : "text-ink hover:bg-brand-50",
                    )}
                  >
                    {o.label}
                    {active && <Check className="size-4 shrink-0 text-brand" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Field>
  );
}

/** Searchable multi-select combobox: type to filter, selected shown as chips, capped at `max`. */
export function MultiSelect<T extends string>({
  options,
  value,
  onChange,
  max = 3,
  placeholder,
  invalid,
}: {
  options: { id: T; label: Bilingual }[];
  value: T[];
  onChange: (ids: T[]) => void;
  max?: number;
  placeholder?: string;
  invalid?: boolean;
}) {
  const { locale, m } = useIntl();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = value.length >= max;

  const selectedOptions = value
    .map((id) => options.find((o) => o.id === id))
    .filter((o): o is { id: T; label: Bilingual } => !!o);
  const available = options.filter(
    (o) => !value.includes(o.id) && (matches(o.label.en, query) || matches(o.label.ar, query)),
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  useEffect(() => setActive(0), [query, open]);

  function add(id: T) {
    if (value.includes(id) || value.length >= max) return;
    onChange([...value, id]);
    setQuery("");
    inputRef.current?.focus();
  }
  function remove(id: T) {
    onChange(value.filter((v) => v !== id));
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, available.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (available[active]) add(available[active].id);
    } else if (e.key === "Backspace" && !query && value.length) {
      remove(value[value.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => {
          if (!atMax) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
        className={cn(
          "flex min-h-11 flex-wrap items-center gap-1.5 rounded-[10px] border bg-surface p-1.5",
          invalid ? "border-accent" : "border-line focus-within:border-brand",
        )}
      >
        <Search className="ms-1 size-4 shrink-0 text-muted" aria-hidden />
        {selectedOptions.map((o) => (
          <span
            key={o.id}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pe-1 ps-2.5 text-xs font-medium text-brand-600"
          >
            {pick(o.label, locale)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(o.id);
              }}
              aria-label={`${m.common.clearAll} ${pick(o.label, locale)}`}
              className="rounded-full p-0.5 hover:bg-brand-100"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          disabled={atMax}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={atMax ? "" : value.length ? "" : placeholder}
          role="combobox"
          aria-expanded={open}
          className="h-8 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
        />
      </div>

      {open && !atMax && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-[10px] border border-line bg-surface py-1 shadow-lg"
        >
          {available.length === 0 ? (
            <li className="px-3.5 py-2 text-sm text-muted">{m.common.noResults}</li>
          ) : (
            available.map((o, i) => (
              <li key={o.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => add(o.id)}
                  className={cn(
                    "flex w-full items-center px-3.5 py-2 text-start text-sm",
                    i === active ? "bg-brand-50 text-brand-600" : "text-ink hover:bg-brand-50",
                  )}
                >
                  {pick(o.label, locale)}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
