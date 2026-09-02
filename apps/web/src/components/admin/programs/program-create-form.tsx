"use client";

import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  BilingualField,
  Field,
  FormActions,
  FormSection,
  SelectInput,
  TextArea,
  TextInput,
  useToast,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";

import { fieldOfStudyOptions } from "./field-options";
import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { STUDY_LEVELS } from "./types";
import type { FacultyOption, ProgramDetail, UniversityOption } from "./types";

type CreateState = {
  universityId: string;
  facultyId: string;
  name: string;
  nameAr: string;
  slug: string;
  studyLevel: string;
  fieldOfStudy: string;
  description: string;
  descriptionAr: string;
};

/**
 * Only the columns the API insists on, plus the pair of blurbs. Fees, duration,
 * tags, intakes and English requirements are edited on the record's own tabs
 * once it exists, so filing a new program stays a short job.
 */
export function ProgramCreateForm({
  universities,
  faculties,
  defaultUniversityId,
  defaultFacultyId,
}: {
  universities: UniversityOption[];
  /**
   * Every faculty, each carrying its university. The select narrows to the
   * chosen university in the browser: the API rejects a faculty belonging to
   * another one, so an unfiltered list would offer choices that cannot be
   * saved, and a round trip per university change buys nothing at this size.
   */
  faculties: FacultyOption[];
  defaultUniversityId: string;
  defaultFacultyId: string;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<CreateState>({
    universityId: defaultUniversityId,
    facultyId: defaultFacultyId,
    name: "",
    nameAr: "",
    slug: "",
    studyLevel: "",
    fieldOfStudy: "",
    description: "",
    descriptionAr: "",
  });
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<{
    field: string | null;
    message: string;
  } | null>(null);

  function set<K extends keyof CreateState>(key: K, value: CreateState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: string) {
    return failure?.field === field ? failure.message : null;
  }

  const facultyOptions = faculties
    .filter((faculty) => faculty.universityId === form.universityId)
    .map((faculty) => ({
      value: faculty.id,
      label: locale === "ar" ? (faculty.nameAr ?? faculty.name) : faculty.name,
    }));

  const slugPreview = previewSlug(form.slug || form.name);
  const complete =
    form.universityId !== "" &&
    form.name.trim() !== "" &&
    form.studyLevel !== "" &&
    form.fieldOfStudy !== "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete) return;

    setPending(true);
    setFailure(null);
    const result = await adminWrite<ProgramDetail>("/api/admin/programs", "POST", {
      universityId: form.universityId,
      facultyId: form.facultyId || null,
      name: form.name,
      nameAr: form.nameAr,
      // An empty box means "derive it from the name", which is what the API
      // does with a null; sending "" would fail validation instead.
      slug: form.slug || null,
      studyLevel: form.studyLevel,
      fieldOfStudy: form.fieldOfStudy,
      description: form.description,
      descriptionAr: form.descriptionAr,
    });
    setPending(false);

    if (!result.ok) {
      const message = result.message ?? t("common.saveFailed");
      setFailure({ field: result.field, message });
      toast({ title: t("common.saveFailed"), description: message, tone: "error" });
      return;
    }

    toast({ title: t("programs.toasts.created") });
    router.push(`/admin/programs/${result.data.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormSection
        title={t("programs.sections.placement")}
        description={t("programs.sections.placementHint")}
      >
        <Field
          label={t("programs.fields.university")}
          htmlFor={`${fieldId}-university`}
          required
          error={errorFor("universityId")}
        >
          <SelectInput
            id={`${fieldId}-university`}
            value={form.universityId}
            onChange={(event) => {
              // The faculty in state belongs to the university being replaced,
              // and the API would reject it against the new one.
              setForm((current) => ({
                ...current,
                universityId: event.target.value,
                facultyId: "",
              }));
            }}
            aria-invalid={errorFor("universityId") ? true : undefined}
            placeholder={t("programs.fields.universityPlaceholder")}
            options={universities.map((university) => ({
              value: university.id,
              label:
                locale === "ar" ? (university.nameAr ?? university.name) : university.name,
            }))}
          />
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
            disabled={form.universityId === ""}
            onChange={(event) => set("facultyId", event.target.value)}
            aria-invalid={errorFor("facultyId") ? true : undefined}
            placeholder={
              form.universityId === ""
                ? t("programs.fields.facultyLocked")
                : t("programs.fields.facultyPlaceholder")
            }
            options={facultyOptions}
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
            autoFocus: true,
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
              {t("programs.hints.slug")}
            </>
          }
        >
          <TextInput
            id={`${fieldId}-slug`}
            dir="ltr"
            value={form.slug}
            onChange={(event) => set("slug", event.target.value)}
            placeholder={previewSlug(form.name)}
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
              placeholder={t("programs.fields.studyLevelPlaceholder")}
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
            hint={t("programs.hints.fieldOfStudy")}
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

      <FormActions>
        <Link href="/admin/programs" className={SECONDARY_BUTTON}>
          {t("common.cancel")}
        </Link>
        <button
          type="submit"
          disabled={pending || !complete}
          className={PRIMARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.create")}
        </button>
      </FormActions>
    </form>
  );
}
