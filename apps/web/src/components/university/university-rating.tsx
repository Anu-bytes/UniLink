"use client";

import { Check, Lock, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { summarize, type RatingSummary } from "@/lib/rating-summary";
import { cn } from "@/lib/utils";

const LEVELS = [1, 2, 3, 4, 5] as const;

/** Each level's own colour: the star you hover tells you what it means. */
const LEVEL_COLOR: Record<number, string> = {
  1: "#EF4444",
  2: "#F97316",
  3: "#F5A524",
  4: "#84CC16",
  5: "#22C55E",
};
const GOLD = "#F5A524";

/**
 * The university's rating out of 5 on its profile: the average and how the
 * ratings split, plus the visitor's own five-star picker. Every star is
 * labelled with what it stands for (Poor ... Excellent) and previews that
 * meaning as you hover or focus it. Rating needs an account, so a guest's
 * click goes to log in and comes back here.
 */
export function UniversityRating({
  universityId,
  isAuthenticated,
  callbackUrl,
  initialSummary,
  className,
}: {
  universityId: string;
  isAuthenticated: boolean;
  callbackUrl: string;
  initialSummary: RatingSummary;
  className?: string;
}) {
  const t = useTranslations("UniversityRating");
  const locale = useLocale();
  const router = useRouter();

  const [summary, setSummary] = useState(initialSummary);
  const [hover, setHover] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [burst, setBurst] = useState<{ level: number; key: number } | null>(null);
  const [justRated, setJustRated] = useState(false);
  // Bars and the star fill grow from zero once the card is on screen.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const mine = summary.mine;
  const active = hover ?? mine;
  const fillPercent = shown && summary.average ? (summary.average / 5) * 100 : 0;
  const maxBar = Math.max(1, ...summary.distribution);

  async function send(stars: number | null) {
    const previous = summary;
    // Optimistic: move the visitor's vote at once, settle with the server's.
    const distribution = [...summary.distribution] as RatingSummary["distribution"];
    if (mine) distribution[mine - 1] = Math.max(0, distribution[mine - 1] - 1);
    if (stars) distribution[stars - 1] += 1;
    setSummary(summarize(distribution, stars));
    setPending(true);
    try {
      const response = await fetch("/api/university-ratings", {
        method: stars ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stars ? { universityId, stars } : { universityId }),
      });
      if (!response.ok) throw new Error(await response.text());
      setSummary((await response.json()) as RatingSummary);
    } catch (error) {
      console.error("Unable to save the rating", error);
      setSummary(previous);
      setJustRated(false);
    } finally {
      setPending(false);
    }
  }

  function rate(level: number) {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    if (pending || level === mine) return;
    // A fresh key restarts the burst animation even on the same star.
    setBurst((previous) => ({ level, key: (previous?.key ?? 0) + 1 }));
    setJustRated(true);
    void send(level);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const rtl = locale.startsWith("ar");
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key !== forward && event.key !== back) return;
    event.preventDefault();
    const current = hover ?? mine ?? 0;
    const next = Math.min(5, Math.max(1, current + (event.key === forward ? 1 : -1)));
    setHover(next);
    const target = event.currentTarget.querySelector<HTMLButtonElement>(`[data-level="${next}"]`);
    target?.focus();
  }

  return (
    <section
      aria-labelledby="rating-heading"
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      )}
    >
      <div className="grid gap-5 p-4 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-6">
        {/* Summary: the average, its stars and the number of ratings. */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:justify-center sm:gap-2">
          <h2 id="rating-heading" className="sr-only">
            {t("heading")}
          </h2>
          <p className="flex items-baseline gap-1 text-[#1F2A44]">
            <span className="text-5xl leading-none font-extrabold tabular-nums">
              {summary.average != null ? formatNumber(locale, summary.average) : "–"}
            </span>
            <span className="text-base font-semibold text-[#98A0B4]">/ {formatNumber(locale, 5)}</span>
          </p>
          <div>
            <div
              className="relative inline-flex"
              role="img"
              aria-label={
                summary.average != null
                  ? t("averageLabel", { average: formatNumber(locale, summary.average) })
                  : t("noRatings")
              }
            >
              <div className="flex gap-0.5 text-slate-200">
                {LEVELS.map((level) => (
                  <Star key={level} className="size-5 fill-current" aria-hidden />
                ))}
              </div>
              <div
                className="absolute inset-y-0 start-0 overflow-hidden transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                style={{ width: `${fillPercent}%` }}
              >
                <div className="flex w-max gap-0.5" style={{ color: GOLD }}>
                  {LEVELS.map((level) => (
                    <Star key={level} className="size-5 shrink-0 fill-current" aria-hidden />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-1 text-sm text-[#5a6072]">
              {summary.count > 0
                ? t("ratingCount", { count: summary.count, value: formatNumber(locale, summary.count) })
                : t("beFirst")}
            </p>
          </div>
        </div>

        {/* How the ratings split, five stars down to one. */}
        <ul className="flex flex-col justify-center gap-1.5" aria-label={t("breakdown")}>
          {[...LEVELS].reverse().map((level, row) => {
            const n = summary.distribution[level - 1];
            return (
              <li key={level} className="flex items-center gap-2.5 text-xs font-semibold text-[#5a6072]">
                <span className="flex w-7 shrink-0 items-center gap-0.5 tabular-nums">
                  {formatNumber(locale, level)}
                  <Star className="size-3 fill-current" style={{ color: GOLD }} aria-hidden />
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="absolute inset-y-0 start-0 rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                    style={{
                      width: shown ? `${(n / maxBar) * 100}%` : "0%",
                      backgroundColor: LEVEL_COLOR[level],
                      transitionDelay: `${row * 80}ms`,
                    }}
                  />
                </span>
                <span className="w-7 shrink-0 text-end tabular-nums">{formatNumber(locale, n)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The visitor's own rating. */}
      <div className="border-t border-slate-100 bg-[#FAFBFE] px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-bold text-[#1F2A44]">
            {mine ? t("yourRating") : t("rateTitle")}
          </p>
          {!isAuthenticated ? (
            <p className="flex items-center gap-1 text-xs font-semibold text-[#5a6072]">
              <Lock className="size-3.5" aria-hidden />
              {t("loginToRate")}
            </p>
          ) : mine && !pending ? (
            <button
              type="button"
              onClick={() => {
                setJustRated(false);
                void send(null);
              }}
              className="text-xs font-semibold text-[#5a6072] underline-offset-2 hover:text-[#F82C1F] hover:underline"
            >
              {t("remove")}
            </button>
          ) : null}
        </div>

        <div
          role="radiogroup"
          aria-label={t("rateTitle")}
          onKeyDown={onKeyDown}
          onMouseLeave={() => setHover(null)}
          className="mt-3 grid grid-cols-5 gap-1 sm:max-w-md sm:gap-2"
        >
          {LEVELS.map((level) => {
            const lit = active != null && level <= active;
            const color = active != null ? LEVEL_COLOR[active] : undefined;
            const chosen = mine === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={chosen}
                data-level={level}
                tabIndex={chosen || (!mine && level === 1) ? 0 : -1}
                disabled={pending}
                aria-label={t("starLabel", { level, meaning: t(`levels.${level}.title`) })}
                onClick={() => rate(level)}
                onMouseEnter={() => setHover(level)}
                onFocus={() => setHover(level)}
                onBlur={() => setHover(null)}
                className="group flex flex-col items-center gap-1 rounded-xl py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/40 disabled:cursor-wait"
              >
                <span className="relative flex size-11 items-center justify-center sm:size-12">
                  {burst?.level === level ? (
                    <span
                      key={burst.key}
                      aria-hidden
                      onAnimationEnd={() => setBurst(null)}
                      className="ul-star-burst absolute inset-0 rounded-full"
                      style={{ boxShadow: `0 0 0 2px ${LEVEL_COLOR[level]}` }}
                    />
                  ) : null}
                  <Star
                    key={chosen && justRated ? `pop-${burst?.key}` : "still"}
                    aria-hidden
                    className={cn(
                      "size-9 transition-[color,transform] duration-200 group-hover:scale-110 sm:size-10",
                      lit ? "fill-current" : "fill-transparent text-slate-300",
                      chosen && justRated && "ul-star-pop",
                    )}
                    style={{ color: lit ? color : undefined }}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-tight font-semibold transition-colors sm:text-xs",
                    active === level ? "" : "text-[#98A0B4]",
                  )}
                  style={{ color: active === level ? LEVEL_COLOR[level] : undefined }}
                >
                  {t(`levels.${level}.title`)}
                </span>
              </button>
            );
          })}
        </div>

        {/* What the highlighted star means, or the thank-you once rated. */}
        <p aria-live="polite" className="mt-2 min-h-5 text-sm">
          {hover != null ? (
            <span key={`h-${hover}`} className="ul-rating-caption inline-flex items-center gap-1.5 font-semibold" style={{ color: LEVEL_COLOR[hover] }}>
              {t(`levels.${hover}.title`)}
              <span className="font-normal text-[#5a6072]">· {t(`levels.${hover}.description`)}</span>
            </span>
          ) : mine && justRated && !pending ? (
            <span key="thanks" className="ul-rating-caption inline-flex items-center gap-1.5 font-semibold text-[#1F7A4D]">
              <Check className="size-4" aria-hidden />
              {t("thanks", { level: formatNumber(locale, mine) })}
            </span>
          ) : mine ? (
            <span className="text-[#5a6072]">
              {t("youRated", { level: formatNumber(locale, mine), meaning: t(`levels.${mine}.title`) })}
            </span>
          ) : (
            <span className="text-[#98A0B4]">{t("hint")}</span>
          )}
        </p>
      </div>
    </section>
  );
}
