"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cloneElement, isValidElement, useId, type ReactElement } from "react";

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
  const generatedId = useId();
  const inputId = htmlFor ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<React.ComponentProps<"input">>, {
        id: inputId,
        "aria-describedby": [
          (children.props as React.ComponentProps<"input">)["aria-describedby"],
          error || hint ? descriptionId : undefined,
        ].filter(Boolean).join(" ") || undefined,
        ...(error ? { "aria-invalid": true } : {}),
        ...(required ? { "aria-required": true } : {}),
      })
    : children;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="flex items-center gap-1 text-[13px] font-semibold text-[#334155]"
      >
        {label}
        {required ? (
          <span aria-hidden className="text-[#F82C1F]">
            *
          </span>
        ) : null}
      </label>
      {control}
      {error ? (
        <p id={descriptionId} role="alert" className="text-[12.5px] font-medium text-[#C81F15]">{error}</p>
      ) : hint ? (
        <p id={descriptionId} className="text-[12.5px] text-[#64748B]">{hint}</p>
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
    <div className="relative min-w-0 max-w-full">
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

type BilingualSide<Multiline extends boolean> = Multiline extends true
  ? React.ComponentProps<"textarea">
  : React.ComponentProps<"input">;

/**
 * Every translated column (`name`/`nameAr`, `description`/`descriptionAr`...)
 * is edited as one control: English and Arabic side by side under a single
 * label, so both languages are filled in together and never drift apart.
 * When only one side has text, the empty side says it still needs filling in.
 */
export function BilingualField<Multiline extends boolean = false>({
  label,
  hint,
  error,
  required,
  multiline,
  rows,
  en,
  ar,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  /** Long text: two text areas instead of two single-line inputs. */
  multiline?: Multiline;
  rows?: number;
  en: BilingualSide<Multiline>;
  ar: BilingualSide<Multiline>;
}) {
  const t = useTranslations("Admin");
  const generatedId = useId();
  const enId = en.id ?? `${generatedId}-en`;
  const arId = ar.id ?? `${generatedId}-ar`;
  const hintId = `${generatedId}-hint`;
  const filled = (side: { value?: unknown }) => String(side.value ?? "").trim().length > 0;
  const enFilled = filled(en);
  const arFilled = filled(ar);

  const sides = [
    { key: "en", id: enId, dir: "ltr" as const, lang: "en", heading: t("common.english"), props: en, missing: arFilled && !enFilled },
    { key: "ar", id: arId, dir: "rtl" as const, lang: "ar", heading: t("common.arabic"), props: ar, missing: enFilled && !arFilled },
  ];

  return (
    <div className="space-y-1.5">
      <p id={`${generatedId}-label`} className="flex items-center gap-1 text-[13px] font-semibold text-[#334155]">
        {label}
        {required ? (
          <span aria-hidden className="text-[#F82C1F]">
            *
          </span>
        ) : null}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {sides.map((side) => {
          const shared = {
            dir: side.dir,
            lang: side.lang,
            id: side.id,
            "aria-labelledby": `${generatedId}-label ${side.id}-label`,
            "aria-describedby": hint || error ? hintId : undefined,
            ...(error && side.key === "en" ? { "aria-invalid": true as const } : {}),
          };
          return (
            <div key={side.key} className="min-w-0 space-y-1">
              <label
                htmlFor={side.id}
                id={`${side.id}-label`}
                className="flex items-center justify-between gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#64748B]"
              >
                <span>{side.heading}</span>
                {side.missing ? (
                  <span className="rounded-full bg-[#FFF6E5] px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-[#B77714]">
                    {t("common.notTranslated")}
                  </span>
                ) : null}
              </label>
              {multiline ? (
                <TextArea rows={rows} {...(side.props as React.ComponentProps<"textarea">)} {...shared} />
              ) : (
                <TextInput {...(side.props as React.ComponentProps<"input">)} {...shared} />
              )}
            </div>
          );
        })}
      </div>

      {error ? (
        <p id={hintId} role="alert" className="text-[12.5px] font-medium text-[#C81F15]">{error}</p>
      ) : hint ? (
        <p id={hintId} className="text-[12.5px] text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  );
}
