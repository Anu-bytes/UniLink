"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { cn } from "@/lib/utils";

// One base ring for every control, so a form reads as a single instrument.
// React 19 passes `ref` through as an ordinary prop, so none of these need
// forwardRef to be focusable from a parent.
const CONTROL =
  "w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] text-[#0F172A] transition-colors placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 aria-invalid:border-[#F82C1F] aria-invalid:focus-visible:outline-[#F82C1F]";

/**
 * Label, hint and error around one control. The control itself still owns its
 * `id` and `aria-invalid`: pass the same value to `htmlFor` and to the input,
 * and set `aria-invalid` whenever `error` is set.
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-[13px] font-semibold text-[#334155]"
      >
        {label}
        {required ? (
          <span aria-hidden className="text-[#F82C1F]">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-[12.5px] font-medium text-[#C81F15]">{error}</p>
      ) : hint ? (
        <p className="text-[12.5px] text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(CONTROL, "h-10", className)} {...props} />;
}

export function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={4}
      className={cn(CONTROL, "min-h-24 py-2.5 leading-relaxed", className)}
      {...props}
    />
  );
}

export function NumberInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className={cn(CONTROL, "h-10 tabular-nums", className)}
      {...props}
    />
  );
}

export type SelectOption = { value: string; label: string };

export function SelectInput({
  options,
  placeholder,
  className,
  ...props
}: Omit<React.ComponentProps<"select">, "children"> & {
  options: SelectOption[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          CONTROL,
          // The native arrow sits on the wrong side under RTL, so it is
          // replaced with our own icon positioned logically.
          "h-10 appearance-none pe-9",
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-lg text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 flex h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#1E6DEB]" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute start-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0",
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-semibold text-[#334155]">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[12.5px] font-normal text-[#64748B]">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
        {description ? (
          <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>
        ) : null}
      </header>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
      {children}
    </div>
  );
}

/**
 * The `name`/`nameAr` pair repeats across every table in the schema, so it
 * gets one control instead of two loose fields that drift apart.
 */
export function BilingualField({
  label,
  hint,
  required,
  en,
  ar,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  en: React.ComponentProps<"input">;
  ar: React.ComponentProps<"input">;
}) {
  const t = useTranslations("Admin");
  const generatedId = useId();
  const enId = en.id ?? `${generatedId}-en`;
  const arId = ar.id ?? `${generatedId}-ar`;

  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-1 text-[13px] font-semibold text-[#334155]">
        {label}
        {required ? (
          <span aria-hidden className="text-[#F82C1F]">
            *
          </span>
        ) : null}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor={enId}
            className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]"
          >
            {t("common.english")}
          </label>
          <TextInput dir="ltr" {...en} id={enId} />
        </div>
        <div className="space-y-1">
          <label
            htmlFor={arId}
            className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]"
          >
            {t("common.arabic")}
          </label>
          <TextInput dir="rtl" {...ar} id={arId} />
        </div>
      </div>

      {hint ? <p className="text-[12.5px] text-[#64748B]">{hint}</p> : null}
    </div>
  );
}
