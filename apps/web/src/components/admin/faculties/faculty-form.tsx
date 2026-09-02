"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  BilingualField,
  Field,
  FormActions,
  FormSection,
  ImageField,
  NumberInput,
  SelectInput,
  TextArea,
  TextInput,
  useToast,
  type SelectOption,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import type { FacultyCounts, FacultyDetail } from "./types";

type FormState = {
  universityId: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  imageUrl: string | null;
  sortOrder: string;
};

// sortOrder lives in state as a string so a cleared input is not silently
// turned into 0 between keystrokes; it is parsed once, on submit.
function toState(faculty: FacultyDetail | null, universityId: string): FormState {
  if (!faculty) {
    return {
      universityId,
      name: "",
      nameAr: "",
      slug: "",
      description: "",
      descriptionAr: "",
      imageUrl: null,
      sortOrder: "",
    };
  }

  return {
    universityId: faculty.universityId,
    name: faculty.name,
    nameAr: faculty.nameAr ?? "",
    slug: faculty.slug,
    description: faculty.description ?? "",
    descriptionAr: faculty.descriptionAr ?? "",
    imageUrl: faculty.imageUrl,
    sortOrder: String(faculty.sortOrder),
  };
}

function toInteger(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Create and edit are the same seven fields, so they are one component: a
 * faculty has no child collections of its own to postpone, unlike a university
 * whose create form deliberately stops short of them.
 */
export function FacultyForm({
  universities,
  faculty = null,
  counts = null,
  defaultUniversityId = "",
}: {
  /** Every university, already labelled for the active locale by the page. */
  universities: SelectOption[];
  /** Absent in create mode. */
  faculty?: FacultyDetail | null;
  /** What a move would repoint; only meaningful when editing. */
  counts?: FacultyCounts | null;
  /** Pre-selects the parent when the admin arrived from a university. */
  defaultUniversityId?: string;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<FormState>(() =>
    toState(faculty, defaultUniversityId),
  );
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<FormState>(() =>
    toState(faculty, defaultUniversityId),
  );
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<{
    field: string | null;
    message: string;
  } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: string) {
    return failure?.field === field ? failure.message : null;
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const complete = form.universityId !== "" && form.name.trim() !== "";
  const slugPreview = previewSlug(form.slug || form.name);
  const moving = faculty !== null && form.universityId !== faculty.universityId;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete) return;
    if (faculty && !dirty) return;

    const sortOrder = toInteger(form.sortOrder);
    const payload = {
      universityId: form.universityId,
      name: form.name,
      nameAr: form.nameAr,
      slug: form.slug,
      description: form.description,
      descriptionAr: form.descriptionAr,
      imageUrl: form.imageUrl,
      // An empty box means "leave the position alone": on create the API puts
      // the faculty last in its university, and on update an absent key does
      // not touch the column. Sending null would fail validation instead.
      ...(sortOrder === null ? {} : { sortOrder }),
    };

    setPending(true);
    setFailure(null);
    const result = faculty
      ? await adminWrite<FacultyDetail>(
          `/api/admin/faculties/${faculty.id}`,
          "PATCH",
          payload,
        )
      : await adminWrite<FacultyDetail>("/api/admin/faculties", "POST", payload);
    setPending(false);

    if (!result.ok) {
      const message = result.message ?? t("common.saveFailed");
      setFailure({ field: result.field, message });
      toast({
        title: t("common.saveFailed"),
        description: message,
        tone: "error",
      });
      return;
    }

    if (!faculty) {
      toast({ title: t("faculties.toasts.created") });
      router.push(`/admin/faculties/${result.data.id}`);
      return;
    }

    setBaseline(form);
    toast({ title: t("faculties.toasts.saved") });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormSection
        title={t("faculties.sections.identity")}
        description={t("faculties.sections.identityHint")}
      >
        <Field
          label={t("faculties.fields.university")}
          htmlFor={`${fieldId}-university`}
          required
          error={errorFor("universityId")}
        >
          <SelectInput
            id={`${fieldId}-university`}
            value={form.universityId}
            onChange={(event) => set("universityId", event.target.value)}
            aria-invalid={errorFor("universityId") ? true : undefined}
            placeholder={t("faculties.fields.universityPlaceholder")}
            options={universities}
          />
        </Field>

        {moving ? (
          <div className="flex gap-3 rounded-lg bg-[#FFF6E5] p-3.5 text-[13px] text-[#B77714]">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">{t("faculties.move.title")}</p>
              <p className="mt-1">{t("faculties.move.description")}</p>
              {counts ? (
                <p className="mt-1">
                  {t("faculties.move.impact", {
                    programs: formatNumber(locale, counts.programs),
                    scores: formatNumber(locale, counts.minimumScores),
                  })}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <BilingualField
          label={t("faculties.fields.name")}
          required
          en={{
            value: form.name,
            onChange: (event) => set("name", event.target.value),
            "aria-invalid": errorFor("name") ? true : undefined,
            autoFocus: faculty === null,
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
          label={t("faculties.fields.slug")}
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
              {t("faculties.hints.slug")}
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
      </FormSection>

      <FormSection
        title={t("faculties.sections.description")}
        description={t("faculties.sections.descriptionHint")}
      >
        <Field
          label={t("faculties.fields.description")}
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
          label={t("faculties.fields.descriptionAr")}
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

      <FormSection title={t("faculties.sections.media")}>
        <ImageField
          value={form.imageUrl}
          onChange={(url) => set("imageUrl", url)}
          folder="faculties"
          aspect="video"
          label={t("faculties.fields.image")}
          hint={t("faculties.hints.image")}
        />
        {errorFor("imageUrl") ? (
          <p className="text-[12.5px] font-medium text-[#C81F15]">
            {errorFor("imageUrl")}
          </p>
        ) : null}

        <Field
          label={t("faculties.fields.sortOrder")}
          htmlFor={`${fieldId}-sortOrder`}
          error={errorFor("sortOrder")}
          hint={t("faculties.hints.sortOrder")}
        >
          <NumberInput
            id={`${fieldId}-sortOrder`}
            min={0}
            max={9999}
            step={1}
            className="max-w-[8rem]"
            value={form.sortOrder}
            onChange={(event) => set("sortOrder", event.target.value)}
            aria-invalid={errorFor("sortOrder") ? true : undefined}
          />
        </Field>
      </FormSection>

      <FormActions>
        <Link href="/admin/faculties" className={SECONDARY_BUTTON}>
          {t("common.cancel")}
        </Link>
        <button
          type="submit"
          disabled={pending || !complete || (faculty !== null && !dirty)}
          className={PRIMARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending
            ? t("common.saving")
            : faculty
              ? t("common.save")
              : t("common.create")}
        </button>
      </FormActions>
    </form>
  );
}
