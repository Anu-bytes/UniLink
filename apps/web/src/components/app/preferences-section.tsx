"use client";

import { Check, Loader2, Pencil, SlidersHorizontal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileCard, ProfileField } from "@/components/app/profile-card";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatNumber } from "@/lib/format";
import {
  BUDGET_BANDS,
  ENGLISH_SCORE_RANGES,
  ENGLISH_TESTS,
  INTAKE_SEASONS,
  INTAKE_YEARS,
  preferencesSchema,
  type PreferencesData,
} from "@/lib/onboarding-schema";
import { cn } from "@/lib/utils";

const MAX_FIELDS = 3;

export function PreferencesSection({ initial }: { initial: PreferencesData }) {
  const t = useTranslations("AppProfile");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PreferencesData>(initial);
  const [saved, setSaved] = useState<PreferencesData>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldLabel = (value: string) => {
    const field = FIELDS_OF_STUDY.find((entry) => entry.value === value);
    if (!field) return value;
    return isArabic ? field.ar : field.en;
  };

  function startEditing() {
    setDraft(saved);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDraft(saved);
    setError(null);
    setEditing(false);
  }

  function toggleField(value: string) {
    setDraft((previous) => {
      const chosen = new Set(previous.fieldsOfStudy);
      if (chosen.has(value)) {
        // Guarded so the section can never be saved empty.
        if (chosen.size === 1) return previous;
        chosen.delete(value);
      } else {
        if (chosen.size >= MAX_FIELDS) return previous;
        chosen.add(value);
      }
      return { ...previous, fieldsOfStudy: [...chosen] };
    });
  }

  async function save() {
    setError(null);

    // Same schema the route runs, so most mistakes never leave the browser.
    const parsed = preferencesSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("preferencesError"));
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload: { error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? t("preferencesError"));
        return;
      }

      setSaved(parsed.data);
      setEditing(false);
      // Match scores depend on these values, so refresh the server data.
      router.refresh();
    } catch (saveError) {
      console.error("Unable to save preferences", saveError);
      setError(t("preferencesError"));
    } finally {
      setBusy(false);
    }
  }

  const scoreRange =
    draft.englishTest === "NONE" ? null : ENGLISH_SCORE_RANGES[draft.englishTest];

  const action = (
    <>
      {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancel}
              disabled={busy}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:bg-slate-50 disabled:opacity-60"
            >
              <X className="size-4" aria-hidden />
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-4 text-sm font-bold text-white hover:bg-[#1859c4] disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Check className="size-4" aria-hidden />
              )}
              {t("save")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF]"
          >
            <Pencil className="size-4" aria-hidden />
            {t("edit")}
          </button>
      )}
    </>
  );

  return (
    <ProfileCard
      icon={SlidersHorizontal}
      title={t("preferences")}
      description={t("preferencesHint")}
      action={action}
    >
      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#C81F15]"
        >
          {error}
        </p>
      ) : null}

      {editing ? (
        <div className="mt-5 space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-[#5a6072]">
              {t("fieldsOfStudy")}
            </legend>
            <p className="mt-1 text-xs text-[#98A0B4]">
              {t("fieldsHint", { max: formatNumber(locale, MAX_FIELDS) })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FIELDS_OF_STUDY.map((field) => {
                const active = draft.fieldsOfStudy.includes(field.value);
                const atLimit =
                  !active && draft.fieldsOfStudy.length >= MAX_FIELDS;
                return (
                  <button
                    key={field.value}
                    type="button"
                    onClick={() => toggleField(field.value)}
                    aria-pressed={active}
                    disabled={atLimit}
                    className={cn(
                      "min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors",
                      active
                        ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
                        : "border-slate-200 text-[#5a6072] hover:bg-slate-50",
                      atLimit && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {isArabic ? field.ar : field.en}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("budget")}
              </span>
              <select
                value={draft.budgetBand}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    budgetBand: event.target
                      .value as PreferencesData["budgetBand"],
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {BUDGET_BANDS.map((band) => (
                  <option key={band} value={band}>
                    {t(`budgetBands.${band}`)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                  {t("intake")}
                </span>
                <select
                  value={draft.intakeSeason}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      intakeSeason: event.target
                        .value as PreferencesData["intakeSeason"],
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                >
                  {INTAKE_SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {tCatalog(`seasons.${season}`)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-transparent">
                  .
                </span>
                <select
                  value={draft.intakeYear}
                  aria-label={t("intake")}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      intakeYear: Number(event.target.value),
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                >
                  {INTAKE_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("english")}
              </span>
              <select
                value={draft.englishTest}
                onChange={(event) => {
                  const englishTest = event.target
                    .value as PreferencesData["englishTest"];
                  setDraft((previous) => ({
                    ...previous,
                    englishTest,
                    englishScore:
                      englishTest === "NONE" ? null : previous.englishScore,
                  }));
                }}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {ENGLISH_TESTS.map((test) => (
                  <option key={test} value={test}>
                    {tCatalog(`englishTests.${test}`)}
                  </option>
                ))}
              </select>
            </label>

            {scoreRange ? (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                  {t("englishScore", {
                    min: formatNumber(locale, scoreRange.min),
                    max: formatNumber(locale, scoreRange.max),
                  })}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min={scoreRange.min}
                  max={scoreRange.max}
                  value={draft.englishScore ?? ""}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      englishScore:
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                />
              </label>
            ) : null}
          </div>
        </div>
      ) : (
        <dl className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("fieldsOfStudy")}
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {saved.fieldsOfStudy.map((value) => (
                <span
                  key={value}
                  className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-semibold text-[#1E3A8A]"
                >
                  {fieldLabel(value)}
                </span>
              ))}
            </dd>
          </div>

          <ProfileField
            label={t("budget")}
            value={t(`budgetBands.${saved.budgetBand}`)}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("intake")}
            value={`${tCatalog(`seasons.${saved.intakeSeason}`)} ${formatNumber(locale, saved.intakeYear)}`}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("english")}
            value={
              saved.englishTest === "NONE"
                ? t("englishNone")
                : `${tCatalog(`englishTests.${saved.englishTest}`)}${
                    saved.englishScore != null
                      ? ` · ${formatNumber(locale, saved.englishScore)}`
                      : ""
                  }`
            }
            emptyLabel={t("notSet")}
          />
        </dl>
      )}
    </ProfileCard>
  );
}
