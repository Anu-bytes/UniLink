"use client";

import { Search, X } from "lucide-react";
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
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      data-pending={isPending || undefined}
    >
      <div className="min-w-56 flex-1">
        <label
          htmlFor="university-search"
          className="mb-1 block text-sm font-semibold text-[#1F2A44]"
        >
          {t("searchLabel")}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98A0B4]"
            aria-hidden
          />
          <input
            id="university-search"
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-lg border border-slate-200 ps-9 pe-3 text-sm text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="university-type"
          className="mb-1 block text-sm font-semibold text-[#1F2A44]"
        >
          {t("typeLabel")}
        </label>
        <select
          id="university-type"
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            apply({ type: event.target.value });
          }}
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
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
          className="mb-1 block text-sm font-semibold text-[#1F2A44]"
        >
          {t("cityLabel")}
        </label>
        <select
          id="university-city"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            apply({ city: event.target.value });
          }}
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
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
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1E6DEB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
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
          className="inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:text-[#1E6DEB]"
        >
          <X className="size-4" aria-hidden />
          {t("clear")}
        </button>
      ) : null}
    </form>
  );
}
