"use client";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Onboarding header: circular back button, step title, "X/N" pill, and the
 * segmented progress bar. Presentational — the wizard owns state and passes
 * `onBack` (which may exit the flow on the first step).
 */
export function WizardProgress({
  title,
  step,
  total,
  onBack,
  backLabel,
  onStepSelect,
  stepAriaLabel,
}: {
  title: string;
  /** 1-based current step. */
  step: number;
  total: number;
  onBack: () => void;
  backLabel: string;
  /** Jump to a 0-based step index (only completed steps are clickable). */
  onStepSelect?: (index: number) => void;
  stepAriaLabel?: (step: number) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-all hover:bg-muted/70 active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
        >
          {/* Mirrors automatically for RTL via the parent's `dir`. */}
          <ArrowLeft className="size-5 rtl:-scale-x-100" />
        </button>

        <h1 className="flex-1 text-xl font-bold sm:text-2xl">{title}</h1>

        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground tabular-nums">
          {step}/{total}
        </span>
      </div>

      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {Array.from({ length: total }, (_, i) => {
          const filled = i < step;
          // Only completed steps before the current one are navigable back to.
          const clickable = onStepSelect != null && i < step - 1;
          const bar = (
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none",
                filled ? "bg-brand-blue" : "bg-muted",
                clickable && "group-hover:bg-brand-blue-dark",
              )}
            />
          );

          return clickable ? (
            <button
              key={i}
              type="button"
              onClick={() => onStepSelect(i)}
              aria-label={stepAriaLabel?.(i + 1)}
              className="group -my-2 flex-1 cursor-pointer py-2 focus-visible:outline-none"
            >
              {bar}
            </button>
          ) : (
            <span key={i} className="flex-1">
              {bar}
            </span>
          );
        })}
      </div>
    </div>
  );
}
