"use client";

import { Building2, Lock, MapPin, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { UNIVERSITY_TYPES } from "@/lib/program-filters";
import { cn } from "@/lib/utils";

type CityOption = { value: string; label: string };

const FREE_SEARCH_LIMIT = 5;
const STORAGE_KEY = "unilink.anonUniversitySearchCount";

/** Reads the signed-out visitor's used-up search count for this browser.
 * Guarded: localStorage can throw in private-browsing/blocked-storage
 * contexts, and a missing/corrupt value should just read as "none used". */
function readSearchCount(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeSearchCount(count: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // Best-effort only: worst case a private-browsing visitor never gets
    // gated, which is fine, this is a soft nudge, not an access control.
  }
}

/**
 * Search + type + city filters for the public university directory. State
 * lives in the URL so a filtered view is shareable and server-rendered.
 *
 * Signed-out visitors get FREE_SEARCH_LIMIT free searches per browser (a
 * localStorage counter, not a hard limit — it's a nudge toward registering,
 * not access control), after which further searches are blocked in favor of
 * a register/login prompt. Signed-in users never hit this.
 */
export function UniversityDirectoryFiltersBar({
  cities,
  initial,
  isAuthenticated,
}: {
  cities: CityOption[];
  initial: { q: string; type: string; city: string };
  isAuthenticated: boolean;
}) {
  const t = useTranslations("UniversityDirectory");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q);
  const [type, setType] = useState(initial.type);
  const [city, setCity] = useState(initial.city);
  const [limitReached, setLimitReached] = useState(false);

  // Read the real count after mount so server and client agree on the first
  // render (localStorage doesn't exist during SSR).
  useEffect(() => {
    if (isAuthenticated) return;
    if (readSearchCount() >= FREE_SEARCH_LIMIT) setLimitReached(true);
  }, [isAuthenticated]);

  function runSearch(next: { q?: string; type?: string; city?: string }) {
    const params = new URLSearchParams();
    const merged = { q, type, city, ...next };
    if (merged.q.trim()) params.set("q", merged.q.trim());
    if (merged.type) params.set("type", merged.type);
    if (merged.city) params.set("city", merged.city);

    const query = params.toString();
    startTransition(() => {
      router.replace(`/universities${query ? `?${query}` : ""}`, { scroll: false });
    });
  }

  /** Every real search attempt goes through here so signed-out visitors get
   * gated consistently, whether it came from the text field, a filter
   * dropdown, or the submit button. */
  function apply(next: { q?: string; type?: string; city?: string }) {
    if (!isAuthenticated) {
      const used = readSearchCount();
      if (used >= FREE_SEARCH_LIMIT) {
        setLimitReached(true);
        return;
      }
      writeSearchCount(used + 1);
      if (used + 1 >= FREE_SEARCH_LIMIT) setLimitReached(true);
    }
    runSearch(next);
  }

  /** Resetting the filters isn't a search, so it doesn't cost one and always
   * goes through even past the limit. */
  function clearAll() {
    setQ("");
    setType("");
    setCity("");
    runSearch({ q: "", type: "", city: "" });
  }

  const hasFilters = Boolean(q.trim() || type || city);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] md:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          apply({});
        }}
        data-pending={isPending || undefined}
      >
        <label htmlFor="university-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-[#98A0B4]"
            aria-hidden
          />
          <input
            id="university-search"
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 w-full rounded-xl bg-[#F5F7FB] ps-12 pe-14 text-[15px] text-[#1F2A44] outline-none transition-colors placeholder:text-[#98A0B4] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/30 md:h-[3.25rem] lg:pe-4"
          />
          {/* Phones submit from inside the field, so the filters below can
              sit on one row instead of stacking a full-width button. */}
          <button
            type="submit"
            aria-label={t("searchLabel")}
            className="absolute end-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg bg-[#1E6DEB] text-white transition-colors hover:bg-[#1859c4] lg:hidden"
          >
            <Search className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2 lg:mt-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:gap-3 lg:border-t lg:border-slate-100 lg:pt-4">
          <div className="min-w-0">
            <label
              htmlFor="university-type"
              className="sr-only lg:not-sr-only lg:mb-1.5 lg:flex lg:items-center lg:gap-1.5 lg:text-xs lg:font-bold lg:uppercase lg:tracking-wide lg:text-[#5a6072]"
            >
              <Building2 className="size-3.5 text-[#1E6DEB]" aria-hidden />
              {t("typeLabel")}
            </label>
            <div className="relative">
              <Building2
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB] lg:hidden"
                aria-hidden
              />
              <select
                id="university-type"
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  apply({ type: event.target.value });
                }}
                className={cn(
                  "h-11 w-full truncate rounded-xl border ps-9 pe-2 text-sm font-semibold outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25 lg:rounded-lg lg:px-3 lg:font-medium",
                  type
                    ? "border-[#1E6DEB]/40 bg-[#EEF4FF] text-[#1E3A8A]"
                    : "border-slate-200 bg-white text-[#1F2A44]",
                )}
              >
                <option value="">{t("allTypes")}</option>
                {UNIVERSITY_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {tCatalog(`universityTypes.${value}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="university-city"
              className="sr-only lg:not-sr-only lg:mb-1.5 lg:flex lg:items-center lg:gap-1.5 lg:text-xs lg:font-bold lg:uppercase lg:tracking-wide lg:text-[#5a6072]"
            >
              <MapPin className="size-3.5 text-[#1E6DEB]" aria-hidden />
              {t("cityLabel")}
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#1E6DEB] lg:hidden"
                aria-hidden
              />
              <select
                id="university-city"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  apply({ city: event.target.value });
                }}
                className={cn(
                  "h-11 w-full truncate rounded-xl border ps-9 pe-2 text-sm font-semibold outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25 lg:rounded-lg lg:px-3 lg:font-medium",
                  city
                    ? "border-[#1E6DEB]/40 bg-[#EEF4FF] text-[#1E3A8A]"
                    : "border-slate-200 bg-white text-[#1F2A44]",
                )}
              >
                <option value="">{t("allCities")}</option>
                {cities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="hidden h-11 items-center justify-center gap-1.5 self-end rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] lg:inline-flex"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {t("searchLabel")}
          </button>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="col-span-2 inline-flex h-9 items-center justify-center gap-1 self-end rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:text-[#1E6DEB] lg:col-span-1 lg:h-11"
            >
              <X className="size-4" aria-hidden />
              {t("clear")}
            </button>
          ) : (
            <span aria-hidden className="hidden lg:block" />
          )}
        </div>
      </form>

      {limitReached ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#1E6DEB]/20 bg-[#EEF3FF] px-4 py-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1E6DEB]">
            <Lock className="size-4" aria-hidden />
          </span>
          <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F2A44]">
            {t("searchLimitReached", { count: FREE_SEARCH_LIMIT })}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#1E6DEB] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
            >
              <Sparkles className="size-3.5" aria-hidden />
              {t("searchLimitRegister")}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#1E6DEB]/30 px-4 text-sm font-bold text-[#1E6DEB] transition-colors hover:bg-white"
            >
              {t("searchLimitLogin")}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
