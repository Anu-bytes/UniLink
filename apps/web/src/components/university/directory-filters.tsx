"use client";

import { Building2, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { UNIVERSITY_TYPES } from "@/lib/program-filters";

type CityOption = { value: string; label: string };

/**
 * Search + type + city filters for the public university directory. State
 * lives in the URL so a filtered view is shareable and server-rendered.
 */
export function UniversityDirectoryFiltersBar({
  cities,
  initial,
}: {
  cities: CityOption[];
  initial: { q: string; type: string; city: string };
}) {
  const t = useTranslations("UniversityDirectory");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q);
  const [type, setType] = useState(initial.type);
  const [city, setCity] = useState(initial.city);

  function apply(next: { q?: string; type?: string; city?: string }) {
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

  const hasFilters = Boolean(q.trim() || type || city);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        apply({});
      }}
      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] md:p-5"
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
          className="h-[3.25rem] w-full rounded-xl bg-[#F5F7FB] ps-12 pe-4 text-[15px] text-[#1F2A44] outline-none transition-colors placeholder:text-[#98A0B4] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/30"
        />
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
        <div>
          <label
            htmlFor="university-type"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5a6072]"
          >
            <Building2 className="size-3.5 text-[#1E6DEB]" aria-hidden />
            {t("typeLabel")}
          </label>
          <select
            id="university-type"
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              apply({ type: event.target.value });
            }}
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
          >
            <option value="">{t("allTypes")}</option>
            {UNIVERSITY_TYPES.map((value) => (
              <option key={value} value={value}>
                {tCatalog(`universityTypes.${value}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="university-city"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5a6072]"
          >
            <MapPin className="size-3.5 text-[#1E6DEB]" aria-hidden />
            {t("cityLabel")}
          </label>
          <select
            id="university-city"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              apply({ city: event.target.value });
            }}
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
          >
            <option value="">{t("allCities")}</option>
            {cities.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-1.5 self-end rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {t("searchLabel")}
        </button>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setType("");
              setCity("");
              apply({ q: "", type: "", city: "" });
            }}
            className="inline-flex h-11 items-center justify-center gap-1 self-end rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:text-[#1E6DEB]"
          >
            <X className="size-4" aria-hidden />
            {t("clear")}
          </button>
        ) : (
          <span aria-hidden className="hidden lg:block" />
        )}
      </div>
    </form>
  );
}
