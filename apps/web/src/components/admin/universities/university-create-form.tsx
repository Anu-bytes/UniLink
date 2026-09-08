"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
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

import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { UNIVERSITY_TYPES } from "./types";
import type { UniversityDetail } from "./types";

type CreateState = {
  name: string;
  nameAr: string;
  slug: string;
  type: string;
  country: string;
  countryAr: string;
  city: string;
  cityAr: string;
  description: string;
  descriptionAr: string;
};

const EMPTY: CreateState = {
  name: "",
  nameAr: "",
  slug: "",
  type: "",
  country: "",
  countryAr: "",
  city: "",
  cityAr: "",
  description: "",
  descriptionAr: "",
};

/**
 * Only the columns the API insists on, plus the pair of blurbs. Everything
 * else — media, coordinates, the long-form copy, the four child collections —
 * is edited on the record's own page once it exists, so creating a university
 * stays a ten-second job.
 */
export function UniversityCreateForm() {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<CreateState>(EMPTY);
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

  const slugPreview = previewSlug(form.slug || form.name);
  const complete =
    form.name.trim() !== "" &&
    form.type !== "" &&
    form.country.trim() !== "" &&
    form.city.trim() !== "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete) return;

    setPending(true);
    setFailure(null);
    const result = await adminWrite<UniversityDetail>(
      "/api/admin/universities",
      "POST",
      { ...form, slug: form.slug || null },
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

    toast({ title: t("universities.toasts.created") });
    router.push(`/admin/universities/${result.data.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormSection
        title={t("universities.sections.identity")}
        description={t("universities.sections.identityHint")}
      >
        <BilingualField
          label={t("universities.fields.name")}
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
          label={t("universities.fields.slug")}
          htmlFor={`${fieldId}-slug`}
          error={errorFor("slug")}
          hint={
            slugPreview
              ? `/universities/${slugPreview}`
              : t("universities.hints.slug")
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

        <Field
          label={t("universities.fields.type")}
          htmlFor={`${fieldId}-type`}
          required
          error={errorFor("type")}
        >
          <SelectInput
            id={`${fieldId}-type`}
            value={form.type}
            onChange={(event) => set("type", event.target.value)}
            aria-invalid={errorFor("type") ? true : undefined}
            placeholder={t("universities.fields.typePlaceholder")}
            options={UNIVERSITY_TYPES.map((type) => ({
              value: type,
              label: tCatalog(`universityTypes.${type}`),
            }))}
          />
        </Field>
      </FormSection>

      <FormSection title={t("universities.sections.location")}>
        <BilingualField
          label={t("universities.fields.country")}
          required
          en={{
            value: form.country,
            onChange: (event) => set("country", event.target.value),
            "aria-invalid": errorFor("country") ? true : undefined,
          }}
          ar={{
            value: form.countryAr,
            onChange: (event) => set("countryAr", event.target.value),
          }}
        />
        <BilingualField
          label={t("universities.fields.city")}
          required
          en={{
            value: form.city,
            onChange: (event) => set("city", event.target.value),
            "aria-invalid": errorFor("city") ? true : undefined,
          }}
          ar={{
            value: form.cityAr,
            onChange: (event) => set("cityAr", event.target.value),
          }}
        />
      </FormSection>

      <FormSection
        title={t("universities.sections.description")}
        description={t("universities.sections.descriptionHint")}
      >
        <Field
          label={t("universities.fields.description")}
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
          label={t("universities.fields.descriptionAr")}
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
        <Link href="/admin/universities" className={SECONDARY_BUTTON}>
          {t("common.cancel")}
        </Link>
        <button type="submit" disabled={pending || !complete} className={PRIMARY_BUTTON}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.create")}
        </button>
      </FormActions>
    </form>
  );
}
