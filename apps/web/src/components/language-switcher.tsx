"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Rendered order (visual order flips automatically under RTL).
const options = [
  { locale: "en", short: "EN", label: "English" },
  { locale: "ar", short: "العربية", label: "العربية" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.locale === locale),
  );

  const switchTo = (next: string) => {
    if (next === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label="Change language"
      className={cn(
        "relative inline-grid grid-cols-2 rounded-full border border-border bg-muted p-1 text-sm font-semibold",
        isPending && "opacity-60",
      )}
    >
      {/* Sliding indicator — positioned with logical `start` so it works in RTL. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-card shadow-sm ring-1 ring-border/60 transition-all duration-300 ease-out motion-reduce:transition-none",
          activeIndex === 0 ? "start-1" : "start-1/2",
        )}
      />

      {options.map((opt) => {
        const active = opt.locale === locale;
        return (
          <button
            key={opt.locale}
            type="button"
            lang={opt.locale}
            onClick={() => switchTo(opt.locale)}
            disabled={active || isPending}
            aria-pressed={active}
            aria-label={opt.label}
            title={opt.label}
            className={cn(
              "relative z-10 min-h-11 min-w-11 rounded-full px-3 py-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] sm:px-4",
              active
                ? "text-brand-blue"
                : "cursor-pointer text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
}
