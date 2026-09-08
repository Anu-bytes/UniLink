"use client";

import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  BilingualField,
  Field,
  FormActions,
  FormSection,
  NumberInput,
  SelectInput,
  TextArea,
  TextInput,
  Toggle,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { fieldOfStudyOptions } from "./field-options";
import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON } from "./styles";
import { PROGRAM_TAGS, STUDY_LEVELS } from "./types";
import type { FacultyOption, ProgramDetail, ProgramTagValue } from "./types";

type DetailsState = {
  facultyId: string;
  name: string;
  nameAr: string;
  slug: string;
  studyLevel: string;
  fieldOfStudy: string;
  description: string;
  descriptionAr: string;
  durationMonths: string;
  durationLabel: string;
  durationLabelAr: string;
  minGradePercent: string;
  coopAvailable: boolean;
  tags: ProgramTagValue[];
  isPublished: boolean;
};

// Numbers live in state as strings so a half-typed "4." is not thrown away
// between keystrokes; they are parsed once, on submit.
function toState(program: ProgramDetail): DetailsState {
  return {
    facultyId: program.facultyId ?? "",
    name: program.name,
    nameAr: program.nameAr ?? "",
    slug: program.slug,
    studyLevel: program.studyLevel,
    fieldOfStudy: program.fieldOfStudy,
    description: program.description ?? "",
    descriptionAr: program.descriptionAr ?? "",
    durationMonths:
      program.durationMonths === null ? "" : String(program.durationMonths),
    durationLabel: program.durationLabel ?? "",
    durationLabelAr: program.durationLabelAr ?? "",
    minGradePercent:
      program.minGradePercent === null ? "" : String(program.minGradePercent),
    coopAvailable: program.coopAvailable,
    tags: [...program.tags],
    isPublished: program.isPublished,
  };
}

/** Empty clears the column; anything unparseable is left to the API to reject. */
function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ProgramDetailsForm({
  program,
  universityLabel,
  faculties,
}: {
  program: ProgramDetail;
  /** Shown, not edited: PATCH has no `universityId`. */
  universityLabel: string;
  /** Only this university's faculties: the API rejects anyone else's. */
  faculties: FacultyOption[];
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<DetailsState>(() => toState(program));
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<DetailsState>(() => toState(program));
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<{
    field: string | null;
    message: string;
  } | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const slugPreview = previewSlug(form.slug);
  const complete =
    form.name.trim() !== "" && form.studyLevel !== "" && form.fieldOfStudy !== "";

  function set<K extends keyof DetailsState>(key: K, value: DetailsState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: string) {
    return failure?.field === field ? failure.message : null;
  }

  function toggleTag(tag: ProgramTagValue, checked: boolean) {
    setForm((current) => ({
      ...current,
      // Rebuilt from the canonical list rather than appended to, so the array
      // keeps a stable order and `dirty` does not fire on a reorder alone.
      tags: PROGRAM_TAGS.filter((candidate) =>
        candidate === tag ? checked : current.tags.includes(candidate),
      ),
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete || !dirty) return;

    setPending(true);
    setFailure(null);
    const result = await adminWrite<ProgramDetail>(
      `/api/admin/programs/${program.id}`,
      "PATCH",
      {
        facultyId: form.facultyId || null,
        name: form.name,
        nameAr: form.nameAr,
        slug: form.slug,
        studyLevel: form.studyLevel,
        fieldOfStudy: form.fieldOfStudy,
        description: form.description,
        descriptionAr: form.descriptionAr,
        durationMonths: toNumber(form.durationMonths),
        durationLabel: form.durationLabel,
        durationLabelAr: form.durationLabelAr,
        minGradePercent: toNumber(form.minGradePercent),
        coopAvailable: form.coopAvailable,
        tags: form.tags,
        isPublished: form.isPublished,
      },
    );
    setPending(false);

    if (!result.ok) {
      const message = result.message ?? t("common.saveFailed");
      setFailure({ field: result.field, message });
      toast({ title: t("common.saveFailed"), description: message, tone: "error" });
      return;
    }

    setBaseline(form);
    toast({ title: t("programs.toasts.saved") });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormSection
        title={t("programs.sections.placement")}
        description={t("programs.sections.placementHint")}
      >
        <Field label={t("programs.fields.university")} hint={t("programs.hints.university")}>
          <p className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-[14px] text-[#64748B]">
            {universityLabel}
          </p>
        </Field>

        <Field
          label={t("programs.fields.faculty")}
          htmlFor={`${fieldId}-faculty`}
          error={errorFor("facultyId")}
          hint={t("programs.hints.faculty")}
        >
          <SelectInput
            id={`${fieldId}-faculty`}
            value={form.facultyId}
            onChange={(event) => set("facultyId", event.target.value)}
            aria-invalid={errorFor("facultyId") ? true : undefined}
            placeholder={t("programs.fields.facultyPlaceholder")}
            options={faculties.map((faculty) => ({
              value: faculty.id,
              label: locale === "ar" ? (faculty.nameAr ?? faculty.name) : faculty.name,
            }))}
          />
        </Field>
      </FormSection>

      <FormSection
        title={t("programs.sections.identity")}
        description={t("programs.sections.identityHint")}
      >
        <BilingualField
          label={t("programs.fields.name")}
          required
          en={{
            value: form.name,
            onChange: (event) => set("name", event.target.value),
            "aria-invalid": errorFor("name") ? true : undefined,
          }}
          ar={{
            value: form.nameAr,
            onChange: (event) => set("nameAr", event.target.value),
          }}
        />
        {errorFor("name") ? (
          <p className="text-[12.5px] font-medium text-[#C81F15]">{errorFor("name")}</p>
        ) : null}

        <Field
          label={t("programs.fields.slug")}
          htmlFor={`${fieldId}-slug`}
          error={errorFor("slug")}
          hint={
            <>
              {slugPreview ? (
                <span dir="ltr" className="font-medium text-[#334155]">
                  {slugPreview}
                </span>
              ) : null}
              {slugPreview ? " · " : null}
              {t("programs.hints.slugEdit")}
            </>
          }
        >
          <TextInput
            id={`${fieldId}-slug`}
            dir="ltr"
            value={form.slug}
            onChange={(event) => set("slug", event.target.value)}
            aria-invalid={errorFor("slug") ? true : undefined}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("programs.fields.studyLevel")}
            htmlFor={`${fieldId}-level`}
            required
            error={errorFor("studyLevel")}
          >
            <SelectInput
              id={`${fieldId}-level`}
              value={form.studyLevel}
              onChange={(event) => set("studyLevel", event.target.value)}
              aria-invalid={errorFor("studyLevel") ? true : undefined}
              options={STUDY_LEVELS.map((level) => ({
                value: level,
                label: tCatalog(`levels.${level}`),
              }))}
            />
          </Field>

          <Field
            label={t("programs.fields.fieldOfStudy")}
            htmlFor={`${fieldId}-field`}
            required
            error={errorFor("fieldOfStudy")}
          >
            <SelectInput
              id={`${fieldId}-field`}
              value={form.fieldOfStudy}
              onChange={(event) => set("fieldOfStudy", event.target.value)}
              aria-invalid={errorFor("fieldOfStudy") ? true : undefined}
              placeholder={t("programs.fields.fieldOfStudyPlaceholder")}
              options={fieldOfStudyOptions(locale)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title={t("programs.sections.description")}
        description={t("programs.sections.descriptionHint")}
      >
        <Field
          label={t("programs.fields.description")}
          htmlFor={`${fieldId}-description`}
          error={errorFor("description")}
        >
          <TextArea
            id={`${fieldId}-description`}
            dir="ltr"
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
          />
        </Field>

        <Field
          label={t("programs.fields.descriptionAr")}
          htmlFor={`${fieldId}-descriptionAr`}
          error={errorFor("descriptionAr")}
        >
          <TextArea
            id={`${fieldId}-descriptionAr`}
            dir="rtl"
            value={form.descriptionAr}
            onChange={(event) => set("descriptionAr", event.target.value)}
          />
        </Field>
      </FormSection>

      <FormSection
        title={t("programs.sections.study")}
        description={t("programs.sections.studyHint")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("programs.fields.durationMonths")}
            htmlFor={`${fieldId}-durationMonths`}
            error={errorFor("durationMonths")}
            hint={t("programs.hints.durationMonths")}
          >
            <NumberInput
              id={`${fieldId}-durationMonths`}
              dir="ltr"
              min={1}
              max={180}
              step={1}
              className="max-w-[8rem]"
              value={form.durationMonths}
              onChange={(event) => set("durationMonths", event.target.value)}
              aria-invalid={errorFor("durationMonths") ? true : undefined}
            />
          </Field>

          <Field
            label={t("programs.fields.minGradePercent")}
            htmlFor={`${fieldId}-minGrade`}
            error={errorFor("minGradePercent")}
            hint={t("programs.hints.minGradePercent")}
          >
            <NumberInput
              id={`${fieldId}-minGrade`}
              dir="ltr"
              min={0}
              max={100}
              step="0.1"
              className="max-w-[8rem]"
              value={form.minGradePercent}
              onChange={(event) => set("minGradePercent", event.target.value)}
              aria-invalid={errorFor("minGradePercent") ? true : undefined}
            />
          </Field>
        </div>

        <BilingualField
          label={t("programs.fields.durationLabel")}
          hint={t("programs.hints.durationLabel")}
          en={{
            value: form.durationLabel,
            onChange: (event) => set("durationLabel", event.target.value),
          }}
          ar={{
            value: form.durationLabelAr,
            onChange: (event) => set("durationLabelAr", event.target.value),
          }}
        />

        <Toggle
          checked={form.coopAvailable}
          onChange={(checked) => set("coopAvailable", checked)}
          label={t("programs.fields.coopAvailable")}
          description={t("programs.hints.coopAvailable")}
        />
      </FormSection>

      <FormSection
        title={t("programs.sections.tags")}
        description={t("programs.sections.tagsHint")}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {PROGRAM_TAGS.map((tag) => {
            const checked = form.tags.includes(tag);
            return (
              <label
                key={tag}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                  checked
                    ? "border-[#1E6DEB] bg-[#EAF2FE] text-[#1E6DEB]"
                    : "border-slate-200 bg-white text-[#334155] hover:bg-slate-50",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => toggleTag(tag, event.target.checked)}
                  className="size-4 shrink-0 rounded border-slate-300 accent-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                />
                {tCatalog(`tags.${tag}`)}
              </label>
            );
          })}
        </div>
      </FormSection>

      <FormSection
        title={t("programs.sections.visibility")}
        description={t("programs.sections.visibilityHint")}
      >
        <Toggle
          checked={form.isPublished}
          onChange={(checked) => set("isPublished", checked)}
          label={t("programs.fields.published")}
          description={t("programs.hints.published")}
        />
      </FormSection>

      <FormActions>
        <button
          type="submit"
          disabled={pending || !complete || !dirty}
          className={PRIMARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </FormActions>
    </form>
  );
}
