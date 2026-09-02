"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
  type SelectOption,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import type { ScholarshipDetail } from "./types";

/** The column default, so a new scholarship starts where nearly all of them land. */
const DEFAULT_CURRENCY = "EGP";

type FormState = {
  universityId: string;
  title: string;
  titleAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  fundingAmount: string;
  currency: string;
  applicationDeadline: string;
  isPublished: boolean;
};

/**
 * `<input type="date">` wants yyyy-mm-dd. UTC, like formatDate: the server
 * runs in UTC while the browser uses the visitor's zone, and reading the local
 * parts here would show a deadline a day out either side of midnight.
 */
function toDateInput(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "";
}

// The numeric fields live in state as strings so a cleared input is not
// silently turned into 0 between keystrokes; they are parsed once, on submit.
function toState(scholarship: ScholarshipDetail | null): FormState {
  if (!scholarship) {
    return {
      universityId: "",
      title: "",
      titleAr: "",
      slug: "",
      description: "",
      descriptionAr: "",
      fundingAmount: "",
      currency: DEFAULT_CURRENCY,
      applicationDeadline: "",
      isPublished: false,
    };
  }

  return {
    universityId: scholarship.universityId ?? "",
    title: scholarship.title,
    titleAr: scholarship.titleAr ?? "",
    slug: scholarship.slug,
    description: scholarship.description ?? "",
    descriptionAr: scholarship.descriptionAr ?? "",
    fundingAmount:
      scholarship.fundingAmount === null ? "" : String(scholarship.fundingAmount),
    currency: scholarship.currency,
    applicationDeadline: toDateInput(scholarship.applicationDeadline),
    isPublished: scholarship.isPublished,
  };
}

function toAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Create and edit are the same ten fields, so they are one component. A
 * scholarship owns no child collections to postpone until after the first
 * save, unlike a university.
 */
export function ScholarshipForm({
  universities,
  scholarship = null,
}: {
  /** Every university, already labelled for the active locale by the page. */
  universities: SelectOption[];
  /** Absent in create mode. */
  scholarship?: ScholarshipDetail | null;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<FormState>(() => toState(scholarship));
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<FormState>(() => toState(scholarship));
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
  const complete = form.title.trim() !== "";
  const slugPreview = previewSlug(form.slug || form.title);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete) return;
    if (scholarship && !dirty) return;

    const payload = {
      universityId: form.universityId,
      title: form.title,
      titleAr: form.titleAr,
      slug: form.slug,
      description: form.description,
      descriptionAr: form.descriptionAr,
      fundingAmount: toAmount(form.fundingAmount),
      applicationDeadline: form.applicationDeadline,
      isPublished: form.isPublished,
      // The column is not nullable and the API validates a three-letter code,
      // so an empty box leaves the stored currency alone rather than being
      // rejected.
      ...(form.currency.trim() ? { currency: form.currency.trim() } : {}),
    };

    setPending(true);
    setFailure(null);
    const result = scholarship
      ? await adminWrite<ScholarshipDetail>(
          `/api/admin/scholarships/${scholarship.id}`,
          "PATCH",
          payload,
        )
      : await adminWrite<ScholarshipDetail>(
          "/api/admin/scholarships",
          "POST",
          payload,
        );
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

    if (!scholarship) {
      toast({ title: t("scholarships.toasts.created") });
      router.push(`/admin/scholarships/${result.data.id}`);
      return;
    }

    // The server may have suffixed the slug to keep it unique, so the baseline
    // takes what came back rather than what was typed.
    const saved = { ...form, slug: result.data.slug };
    setForm(saved);
    setBaseline(saved);
    toast({ title: t("scholarships.toasts.saved") });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormSection
        title={t("scholarships.sections.identity")}
        description={t("scholarships.sections.identityHint")}
      >
        <BilingualField
          label={t("scholarships.fields.title")}
          required
          en={{
            value: form.title,
            onChange: (event) => set("title", event.target.value),
            "aria-invalid": errorFor("title") ? true : undefined,
            autoFocus: scholarship === null,
          }}
          ar={{
            value: form.titleAr,
            onChange: (event) => set("titleAr", event.target.value),
          }}
        />
        {errorFor("title") ? (
          <p className="text-[12.5px] font-medium text-[#C81F15]">
            {errorFor("title")}
          </p>
        ) : null}

        <Field
          label={t("scholarships.fields.slug")}
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
              {t("scholarships.hints.slug")}
            </>
          }
        >
          <TextInput
            id={`${fieldId}-slug`}
            dir="ltr"
            value={form.slug}
            onChange={(event) => set("slug", event.target.value)}
            placeholder={previewSlug(form.title)}
            aria-invalid={errorFor("slug") ? true : undefined}
          />
        </Field>

        <Field
          label={t("scholarships.fields.university")}
          htmlFor={`${fieldId}-university`}
          error={errorFor("universityId")}
          hint={t("scholarships.hints.university")}
        >
          <SelectInput
            id={`${fieldId}-university`}
            value={form.universityId}
            onChange={(event) => set("universityId", event.target.value)}
            aria-invalid={errorFor("universityId") ? true : undefined}
            // The empty option is a real answer here, not a prompt to choose:
            // a government or sponsor scholarship is tied to no university at
            // all, and the relation is nullable for exactly that reason.
            placeholder={t("scholarships.fields.noUniversity")}
            options={universities}
          />
        </Field>
      </FormSection>

      <FormSection
        title={t("scholarships.sections.description")}
        description={t("scholarships.sections.descriptionHint")}
      >
        <Field
          label={t("scholarships.fields.description")}
          htmlFor={`${fieldId}-description`}
          error={errorFor("description")}
        >
          <TextArea
            id={`${fieldId}-description`}
            dir="ltr"
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            aria-invalid={errorFor("description") ? true : undefined}
          />
        </Field>

        <Field
          label={t("scholarships.fields.descriptionAr")}
          htmlFor={`${fieldId}-descriptionAr`}
          error={errorFor("descriptionAr")}
        >
          <TextArea
            id={`${fieldId}-descriptionAr`}
            dir="rtl"
            value={form.descriptionAr}
            onChange={(event) => set("descriptionAr", event.target.value)}
            aria-invalid={errorFor("descriptionAr") ? true : undefined}
          />
        </Field>
      </FormSection>

      <FormSection
        title={t("scholarships.sections.funding")}
        description={t("scholarships.sections.fundingHint")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("scholarships.fields.fundingAmount")}
            htmlFor={`${fieldId}-fundingAmount`}
            error={errorFor("fundingAmount")}
            hint={t("scholarships.hints.fundingAmount")}
          >
            <NumberInput
              id={`${fieldId}-fundingAmount`}
              min={0}
              step="0.01"
              value={form.fundingAmount}
              onChange={(event) => set("fundingAmount", event.target.value)}
              aria-invalid={errorFor("fundingAmount") ? true : undefined}
            />
          </Field>

          <Field
            label={t("scholarships.fields.currency")}
            htmlFor={`${fieldId}-currency`}
            error={errorFor("currency")}
            hint={t("scholarships.hints.currency")}
          >
            <TextInput
              id={`${fieldId}-currency`}
              dir="ltr"
              maxLength={3}
              className="max-w-[8rem] uppercase"
              value={form.currency}
              onChange={(event) => set("currency", event.target.value)}
              aria-invalid={errorFor("currency") ? true : undefined}
            />
          </Field>
        </div>

        <Field
          label={t("scholarships.fields.deadline")}
          htmlFor={`${fieldId}-deadline`}
          error={errorFor("applicationDeadline")}
          hint={t("scholarships.hints.deadline")}
        >
          <TextInput
            id={`${fieldId}-deadline`}
            type="date"
            dir="ltr"
            className="max-w-[12rem]"
            value={form.applicationDeadline}
            onChange={(event) => set("applicationDeadline", event.target.value)}
            aria-invalid={errorFor("applicationDeadline") ? true : undefined}
          />
        </Field>
      </FormSection>

      <FormSection title={t("scholarships.sections.visibility")}>
        <Toggle
          checked={form.isPublished}
          onChange={(checked) => set("isPublished", checked)}
          label={t("scholarships.fields.published")}
          description={t("scholarships.hints.published")}
        />
      </FormSection>

      <FormActions>
        <Link href="/admin/scholarships" className={SECONDARY_BUTTON}>
          {t("common.cancel")}
        </Link>
        <button
          type="submit"
          disabled={pending || !complete || (scholarship !== null && !dirty)}
          className={PRIMARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending
            ? t("common.saving")
            : scholarship
              ? t("common.save")
              : t("common.create")}
        </button>
      </FormActions>
    </form>
  );
}
