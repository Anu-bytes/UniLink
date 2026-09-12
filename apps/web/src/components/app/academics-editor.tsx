"use client";

import { Check, GraduationCap, Loader2, Pencil, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileCard, ProfileField } from "@/components/app/profile-card";
import { COUNTRIES } from "@/lib/countries";
import { formatNumber } from "@/lib/format";
import {
  academicsEditSchema,
  HIGH_SCHOOL_SYSTEMS,
  STUDY_LEVELS,
  type AcademicsEditData,
} from "@/lib/onboarding-schema";

const currentYear = new Date().getFullYear();
// A wider window than the onboarding wizard's rolling 3 years: a profile
// being edited may belong to someone who graduated a while ago.
const EDIT_GRADUATION_YEARS: readonly number[] = Array.from(
  { length: 16 },
  (_, i) => currentYear - 10 + i,
);

export function AcademicsEditor({ initial }: { initial: AcademicsEditData }) {
  const t = useTranslations("AppProfile");
  const tCatalog = useTranslations("Catalog");
  const tOnboarding = useTranslations("Onboarding");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<AcademicsEditData>(initial);
  const [saved, setSaved] = useState<AcademicsEditData>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const country = COUNTRIES.find((entry) => entry.code === saved.nationality);

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

  async function save() {
    setError(null);

    const parsed = academicsEditSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("academicsError"));
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/profile/academics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload: { error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? t("academicsError"));
        return;
      }

      setSaved(parsed.data);
      setEditing(false);
      // Match scores (study level, grade, etc.) depend on these values.
      router.refresh();
    } catch (saveError) {
      console.error("Unable to save academic details", saveError);
      setError(t("academicsError"));
    } finally {
      setBusy(false);
    }
  }

  const action = editing ? (
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
  );

  return (
    <ProfileCard
      icon={GraduationCap}
      title={t("academics")}
      description={t("academicsHint")}
      action={action}
    >
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#C81F15]"
        >
          {error}
        </p>
      ) : null}

      {editing ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("studyLevel")}
              </span>
              <select
                value={draft.studyLevel}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    studyLevel: event.target
                      .value as AcademicsEditData["studyLevel"],
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {STUDY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {tOnboarding(`options.studyLevel.${level}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("nationality")}
              </span>
              <select
                value={draft.nationality}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    nationality: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {COUNTRIES.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {isArabic ? entry.nameAr : entry.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("highSchoolSystem")}
              </span>
              <select
                value={draft.highSchoolSystem}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    highSchoolSystem: event.target
                      .value as AcademicsEditData["highSchoolSystem"],
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {HIGH_SCHOOL_SYSTEMS.map((system) => (
                  <option key={system} value={system}>
                    {tCatalog(`systems.${system}`)}
                  </option>
                ))}
              </select>
            </label>

            {draft.highSchoolSystem === "OTHER" ? (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                  {t("highSchoolSystemOther")}
                </span>
                <input
                  type="text"
                  value={draft.highSchoolSystemOther ?? ""}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      highSchoolSystemOther: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("graduationYear")}
              </span>
              <select
                value={draft.graduationYear}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    graduationYear: Number(event.target.value),
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              >
                {EDIT_GRADUATION_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("grade")}
              </span>
              <input
                type="text"
                value={draft.gradeValue}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    gradeValue: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
              {t("bio")}
            </span>
            <textarea
              value={draft.bio ?? ""}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  bio: event.target.value,
                }))
              }
              placeholder={t("bioPlaceholder")}
              maxLength={500}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus-visible:border-[#1E6DEB]"
            />
          </label>
        </div>
      ) : (
        <dl className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            label={t("studyLevel")}
            value={tOnboarding(`options.studyLevel.${saved.studyLevel}`)}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("nationality")}
            value={country ? (isArabic ? country.nameAr : country.name) : null}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("highSchoolSystem")}
            value={
              saved.highSchoolSystem === "OTHER" && saved.highSchoolSystemOther
                ? saved.highSchoolSystemOther
                : tCatalog(`systems.${saved.highSchoolSystem}`)
            }
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("graduationYear")}
            value={formatNumber(locale, saved.graduationYear)}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("grade")}
            value={saved.gradeValue}
            emptyLabel={t("notSet")}
          />
          <ProfileField
            label={t("bio")}
            value={saved.bio}
            emptyLabel={t("notSet")}
            className="sm:col-span-2"
          />
        </dl>
      )}
    </ProfileCard>
  );
}
