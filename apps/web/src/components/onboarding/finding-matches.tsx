"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHECK_KEYS = [
  "filtering",
  "grades",
  "english",
  "intake",
  "ranking",
] as const;

/**
 * Post-submit transition shown while the account is created and the user is
 * signed in. Reveals the eligibility checklist one line at a time, then enables
 * the "View my matches" button once `ready` flips true.
 */
export function FindingMatches({
  ready,
  onView,
}: {
  ready: boolean;
  onView: () => void;
}) {
  const t = useTranslations("Onboarding.matches");
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= CHECK_KEYS.length) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), 500);
    return () => clearTimeout(timer);
  }, [revealed]);

  return (
    <div className="flex flex-col items-center py-6 text-center duration-500 animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
      <div className="relative mb-6 flex size-16 items-center justify-center">
        <span className="absolute size-16 animate-ping rounded-full bg-brand-blue/15 motion-reduce:hidden" />
        <Loader2 className="size-12 animate-spin text-brand-blue" />
      </div>

      <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("subtitle")}</p>

      <ul className="mt-8 w-full max-w-sm space-y-4 text-start">
        {CHECK_KEYS.map((key, i) => {
          const active = i < revealed;
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-3 transition-all duration-300 motion-reduce:transition-none",
                active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-brand-blue text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {active ? (
                  <Check className="size-4 duration-300 animate-in zoom-in-50" />
                ) : (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
              </span>
              <span className="font-medium">{t(`checks.${key}`)}</span>
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        onClick={onView}
        disabled={!ready}
        className={cn(
          "group mt-10 w-full max-w-sm bg-gradient-to-r from-brand-blue to-[#7c3aed] py-6 text-base font-semibold text-white transition-all hover:opacity-95 hover:shadow-lg hover:shadow-brand-blue/25 active:scale-[0.99] disabled:opacity-70 motion-reduce:transition-none",
          ready && "duration-500 animate-in fade-in-0 slide-in-from-bottom-2",
        )}
      >
        {ready ? t("cta") : t("preparing")}
      </Button>
    </div>
  );
}
