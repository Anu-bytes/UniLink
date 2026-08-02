"use client";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { FIELDS_OF_STUDY } from "@/lib/fields";
import { INTAKE_SEASONS, INTAKE_YEARS, STUDY_LEVELS } from "@/lib/onboarding-schema";
import {
  PROGRAM_TAGS,
  UNIVERSITY_TYPES,
  type SearchFilters,
} from "@/lib/program-filters";
import { cn } from "@/lib/utils";
import type { FilterOptions } from "@/components/app/filter-bar";

/** Full filter drawer opened from "Filters & Eligibility". */
export function FiltersPanel({
  filters,
  options,
  onClose,
  onApply,
}: {
  filters: SearchFilters;
  options: FilterOptions;
  onClose: () => void;
  onApply: (next: SearchFilters) => void;
}) {
  const t = useTranslations("Search.filters");
  const tCatalog = useTranslations("Catalog");
  const isArabic = useLocale().startsWith("ar");
  const [draft, setDraft] = useState<SearchFilters>(filters);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function toggle<K extends "fields" | "levels" | "cities" | "universities" | "universityTypes" | "tags">(
    key: K,
    value: string,
  ) {
    setDraft((previous) => {
      const current = new Set((previous[key] as string[] | undefined) ?? []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return {
        ...previous,
        [key]: current.size > 0 ? [...current] : undefined,
      } as SearchFilters;
    });
  }

  const isOn = (key: keyof SearchFilters, value: string) =>
    ((draft[key] as string[] | undefined) ?? []).includes(value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <h2 className="text-lg font-bold text-[#1F2A44]">{t("title")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex size-10 items-center justify-center rounded-lg text-[#5a6072] hover:bg-slate-50"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto p-5">
          <Group title={t("level")}>
            <div className="flex flex-wrap gap-2">
              {STUDY_LEVELS.map((level) => (
                <Chip
                  key={level}
                  active={isOn("levels", level)}
                  onClick={() => toggle("levels", level)}
                >
                  {tCatalog(`levels.${level}`)}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title={t("field")}>
            <div className="flex flex-wrap gap-2">
              {FIELDS_OF_STUDY.map((field) => (
                <Chip
                  key={field.value}
                  active={isOn("fields", field.value)}
                  onClick={() => toggle("fields", field.value)}
                >
                  {isArabic ? field.ar : field.en}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title={t("universityType")}>
            <div className="flex flex-wrap gap-2">
              {UNIVERSITY_TYPES.map((type) => (
                <Chip
                  key={type}
                  active={isOn("universityTypes", type)}
                  onClick={() => toggle("universityTypes", type)}
                >
                  {tCatalog(`universityTypes.${type}`)}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title={t("city")}>
            <div className="flex flex-wrap gap-2">
              {options.cities.map((city) => (
                <Chip
                  key={city.value}
                  active={isOn("cities", city.value)}
                  onClick={() => toggle("cities", city.value)}
                >
                  {city.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title={t("tuition")}>
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <span className="mb-1 block text-xs font-semibold text-[#5a6072]">
                  {t("min")}
                </span>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={draft.minTuition ?? ""}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      minTuition: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                />
              </label>
              <label className="flex-1">
                <span className="mb-1 block text-xs font-semibold text-[#5a6072]">
                  {t("max")}
                </span>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={draft.maxTuition ?? ""}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      maxTuition: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                />
              </label>
            </div>
          </Group>

          <Group title={t("intakeYear")}>
            <div className="flex flex-wrap gap-3">
              <select
                value={draft.intakeYear ?? ""}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    intakeYear: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
                aria-label={t("intakeYear")}
                className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                <option value="">{t("anyYear")}</option>
                {INTAKE_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={draft.intakeSeason ?? ""}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    intakeSeason: (event.target.value ||
                      undefined) as SearchFilters["intakeSeason"],
                  }))
                }
                aria-label={t("intakeSeason")}
                className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                <option value="">{t("anySeason")}</option>
                {INTAKE_SEASONS.map((season) => (
                  <option key={season} value={season}>
                    {tCatalog(`seasons.${season}`)}
                  </option>
                ))}
              </select>
            </div>
          </Group>

          <Group title={t("perks")}>
            <div className="flex flex-wrap gap-2">
              {PROGRAM_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  active={isOn("tags", tag)}
                  onClick={() => toggle("tags", tag)}
                >
                  {tCatalog(`tags.${tag}`)}
                </Chip>
              ))}
            </div>
          </Group>
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={() => setDraft({ q: filters.q, sort: filters.sort, page: 1 })}
            className="h-12 flex-1 rounded-lg border border-slate-200 text-sm font-semibold text-[#5a6072] hover:bg-slate-50"
          >
            {t("clear")}
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-12 flex-[2] rounded-lg bg-[#1E6DEB] text-sm font-bold text-white hover:bg-[#1859c4]"
          >
            {t("apply")}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-[#1F2A44]">{title}</h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
        active
          ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
          : "border-slate-200 text-[#5a6072] hover:bg-slate-50",
      )}
    >
      {children}
    </button>
  );
}
