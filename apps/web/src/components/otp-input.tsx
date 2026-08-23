"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Six single-character boxes backed by one string value.
 *
 * Boxes rather than one field because a code arriving as six digits should look
 * like six digits, but the usual failure modes of that pattern are handled
 * here: pasting the whole code into any box fills them all, Backspace on an
 * empty box steps back, and the arrow keys move without wiping a digit.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  label,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Fired once the sixth digit lands, so the form can submit itself. */
  onComplete?: (code: string) => void;
  disabled?: boolean;
  label: string;
  invalid?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  function commit(next: string) {
    const clean = next.replace(/\D/g, "").slice(0, LENGTH);
    onChange(clean);
    if (clean.length === LENGTH) onComplete?.(clean);
    return clean;
  }

  function handleChange(index: number, raw: string) {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    // Several digits at once (paste, or a keyboard suggestion) fill forward
    // from this box rather than landing as one character.
    const next =
      value.slice(0, index) + typed + value.slice(index + typed.length);
    const clean = commit(next);

    const target = Math.min(index + typed.length, LENGTH - 1);
    if (clean.length >= LENGTH) refs.current[LENGTH - 1]?.blur();
    else refs.current[target]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        // Clear this box and stay put.
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        // Already empty: step back and clear that one instead.
        commit(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    handleChange(index, pasted);
  }

  return (
    <div
      role="group"
      aria-label={label}
      // Force LTR: a numeric code reads left to right even on the Arabic pages.
      dir="ltr"
      className="flex justify-center gap-2 sm:gap-2.5"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          // Lets iOS and macOS offer the code straight from the email.
          autoComplete={index === 0 ? "one-time-code" : "off"}
          // maxLength 1 keeps the box single-digit, but paste still arrives
          // whole via onPaste above.
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`${label} ${index + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
          className={cn(
            "size-12 rounded-xl border bg-background text-center text-xl font-bold tabular-nums outline-none transition-colors sm:size-14 sm:text-2xl",
            "focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30",
            "disabled:opacity-60",
            invalid ? "border-destructive" : "border-input",
          )}
        />
      ))}
    </div>
  );
}

const LENGTH = 6;
