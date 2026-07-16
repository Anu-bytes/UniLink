"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { MessageSquareText, Sparkles } from "lucide-react";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// -----------------------------------------------------------------------------
// useStepForm — a tiny dependency-free replacement for react-hook-form. Holds
// the step's values, validates them against the step's Zod schema on submit,
// and maps issues to a { field -> message } record. Same schemas as the API.
// -----------------------------------------------------------------------------

export function useStepForm<S extends z.ZodTypeAny>(
  schema: S,
  initial: Partial<z.input<S>>,
) {
  const [values, setValues] = useState<Record<string, unknown>>({
    ...(initial as Record<string, unknown>),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setValue(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate(): z.output<S> | null {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const mapped: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!mapped[key]) mapped[key] = issue.message;
    }
    setErrors(mapped);
    return null;
  }

  return { values, setValue, setValues, errors, validate };
}

// -----------------------------------------------------------------------------
// Mascot avatar (UniLink logo mark) shown beside the question pill.
// -----------------------------------------------------------------------------

function Mascot() {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue-light sm:size-12">
      <Image
        src="/logo/unilink-logo-mark.png"
        alt=""
        width={40}
        height={40}
        className="size-8 object-contain"
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Illustration panel: rings + optional orbiting flag/emoji badges around a
// central icon. Approximates the reference art with our own styling.
// -----------------------------------------------------------------------------

const ORBIT_POS = [
  "top-6 start-10",
  "top-5 end-12",
  "top-1/3 start-4",
  "top-1/2 end-6",
  "bottom-10 start-12",
  "bottom-7 end-14",
  "bottom-1/3 start-1/3",
  "top-1/4 end-1/3",
];

export function IllustrationPanel({
  children,
  orbits,
}: {
  children: ReactNode;
  orbits?: string[];
}) {
  return (
    <div className="relative hidden min-h-[280px] overflow-hidden rounded-2xl bg-brand-blue-light md:flex md:items-center md:justify-center">
      <div className="absolute size-72 rounded-full border border-brand-blue/10" />
      <div className="absolute size-52 rounded-full border border-brand-blue/10" />
      <div className="absolute size-32 rounded-full border border-brand-blue/10" />

      {orbits?.slice(0, ORBIT_POS.length).map((emoji, i) => (
        <span
          key={i}
          className={cn(
            "absolute flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-sm",
            ORBIT_POS[i],
          )}
        >
          {emoji}
        </span>
      ))}

      <div className="relative flex size-24 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm">
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Step layout: question pill (mascot + question), two-column body, helper note,
// and the sparkle Continue button.
// -----------------------------------------------------------------------------

export function StepShell({
  question,
  help,
  submitLabel,
  onSubmit,
  illustration,
  orbits,
  children,
  submitting,
}: {
  question: string;
  help: string;
  submitLabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  illustration: ReactNode;
  orbits?: string[];
  children: ReactNode;
  submitting?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex items-center gap-3 sm:gap-4">
        <Mascot />
        <div className="flex-1 rounded-2xl bg-muted/60 px-5 py-4">
          <p className="text-lg font-bold sm:text-xl">{question}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <IllustrationPanel orbits={orbits}>{illustration}</IllustrationPanel>
        <div className="flex flex-col justify-center gap-4">{children}</div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-violet-100 to-pink-100 p-4 text-sm text-violet-900 dark:from-violet-950/40 dark:to-pink-950/40 dark:text-violet-100">
        <MessageSquareText className="mt-0.5 size-5 shrink-0" />
        <p>{help}</p>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="group w-full gap-2 bg-gradient-to-r from-brand-blue to-violet-600 py-6 text-base font-semibold text-white transition-all hover:opacity-95 hover:shadow-lg hover:shadow-brand-blue/25 active:scale-[0.99] disabled:opacity-70 motion-reduce:transition-none"
      >
        <Sparkles className="size-5 transition-transform group-hover:rotate-12" />
        {submitLabel}
      </Button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// Field wrapper + selectable option cards
// -----------------------------------------------------------------------------

export function Field({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="text-sm font-medium text-foreground">{label}</label>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OptionCards<T extends string>({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: {
    value: T;
    label: string;
    hint?: string;
    disabled?: boolean;
    badge?: string;
  }[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            aria-pressed={selected}
            className={cn(
              "rounded-xl border px-4 py-3 text-start transition-all duration-150 motion-reduce:transition-none",
              opt.disabled
                ? "cursor-not-allowed border-input bg-muted/40 opacity-60"
                : selected
                  ? "border-brand-blue bg-brand-blue-light text-brand-blue-dark shadow-sm ring-1 ring-brand-blue/30"
                  : "border-input hover:-translate-y-0.5 hover:border-brand-blue/40 hover:bg-muted/50 active:scale-[0.99]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium">{opt.label}</span>
              {opt.badge ? (
                <span className="rounded-full bg-brand-blue-light px-2 py-0.5 text-xs font-medium text-brand-blue-dark">
                  {opt.badge}
                </span>
              ) : null}
            </span>
            {opt.hint ? (
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {opt.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
