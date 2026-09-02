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
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { previewSlug } from "./slug";
import { PRIMARY_BUTTON } from "./styles";
import { UNIVERSITY_TYPES } from "./types";
import type { UniversityDetail } from "./types";

type DetailsState = {
  name: string;
  nameAr: string;
  slug: string;
  type: string;
  country: string;
  countryAr: string;
  city: string;
  cityAr: string;
  addressLine: string;
  addressLineAr: string;
  latitude: string;
  longitude: string;
  establishedYear: string;
  websiteUrl: string;
  phone: string;
  email: string;
  description: string;
  descriptionAr: string;
  aboutRich: string;
  aboutRichAr: string;
  isFeatured: boolean;
  isRecommended: boolean;
  isTrending: boolean;
  published: boolean;
};

// Numbers live in state as strings so a half-typed "-3." is not thrown away
// between keystrokes; they are parsed once, on submit.
function toState(university: UniversityDetail): DetailsState {
  return {
    name: university.name,
    nameAr: university.nameAr ?? "",
    slug: university.slug,
    type: university.type,
    country: university.country,
    countryAr: university.countryAr ?? "",
    city: university.city,
    cityAr: university.cityAr ?? "",
    addressLine: university.addressLine ?? "",
    addressLineAr: university.addressLineAr ?? "",
    latitude: university.latitude === null ? "" : String(university.latitude),
    longitude: university.longitude === null ? "" : String(university.longitude),
    establishedYear:
      university.establishedYear === null ? "" : String(university.establishedYear),
    websiteUrl: university.websiteUrl ?? "",
    phone: university.phone ?? "",
    email: university.email ?? "",
    description: university.description ?? "",
    descriptionAr: university.descriptionAr ?? "",
    aboutRich: university.aboutRich ?? "",
    aboutRichAr: university.aboutRichAr ?? "",
    isFeatured: university.isFeatured,
    isRecommended: university.isRecommended,
    isTrending: university.isTrending,
    published: university.publishedAt !== null,
  };
}

/** Empty clears the column; anything unparseable is left to the API to reject. */
function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function UniversityDetailsForm({
  university,
}: {
  university: UniversityDetail;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<DetailsState>(() => toState(university));
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<DetailsState>(() => toState(university));
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<{
    field: string | null;
    message: string;
  } | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);

  function set<K extends keyof DetailsState>(key: K, value: DetailsState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: string) {
    return failure?.field === field ? failure.message : null;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !dirty) return;

    setPending(true);
    setFailure(null);
    const result = await adminWrite<UniversityDetail>(
      `/api/admin/universities/${university.id}`,
      "PATCH",
      {
        name: form.name,
        nameAr: form.nameAr,
        slug: form.slug,
        type: form.type,
        country: form.country,
        countryAr: form.countryAr,
        city: form.city,
        cityAr: form.cityAr,
        addressLine: form.addressLine,
        addressLineAr: form.addressLineAr,
        latitude: toNumber(form.latitude),
        longitude: toNumber(form.longitude),
        establishedYear: toNumber(form.establishedYear),
        websiteUrl: form.websiteUrl,
        phone: form.phone,
        email: form.email,
        description: form.description,
        descriptionAr: form.descriptionAr,
        aboutRich: form.aboutRich,
        aboutRichAr: form.aboutRichAr,
        isFeatured: form.isFeatured,
        isRecommended: form.isRecommended,
        isTrending: form.isTrending,
        published: form.published,
      },
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

    setBaseline(form);
    toast({ title: t("universities.toasts.saved") });
    router.refresh();
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
          }}
          ar={{
            value: form.nameAr,
            onChange: (event) => set("nameAr", event.target.value),
          }}
        />
        {errorFor("name") ? (
          <p className="text-[12.5px] font-medium text-[#C81F15]">{errorFor("name")}</p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("universities.fields.slug")}
            htmlFor={`${fieldId}-slug`}
            required
            error={errorFor("slug")}
            hint={`/universities/${previewSlug(form.slug) || form.slug}`}
          >
            <TextInput
              id={`${fieldId}-slug`}
              dir="ltr"
              value={form.slug}
              onChange={(event) => set("slug", event.target.value)}
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
              options={UNIVERSITY_TYPES.map((type) => ({
                value: type,
                label: tCatalog(`universityTypes.${type}`),
              }))}
            />
          </Field>
        </div>
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
        <BilingualField
          label={t("universities.fields.addressLine")}
          en={{
            value: form.addressLine,
            onChange: (event) => set("addressLine", event.target.value),
          }}
          ar={{
            value: form.addressLineAr,
            onChange: (event) => set("addressLineAr", event.target.value),
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("universities.fields.latitude")}
            htmlFor={`${fieldId}-latitude`}
            error={errorFor("latitude")}
            hint={t("universities.hints.latitude")}
          >
            <NumberInput
              id={`${fieldId}-latitude`}
              dir="ltr"
              step="any"
              value={form.latitude}
              onChange={(event) => set("latitude", event.target.value)}
              aria-invalid={errorFor("latitude") ? true : undefined}
            />
          </Field>
          <Field
            label={t("universities.fields.longitude")}
            htmlFor={`${fieldId}-longitude`}
            error={errorFor("longitude")}
            hint={t("universities.hints.longitude")}
          >
            <NumberInput
              id={`${fieldId}-longitude`}
              dir="ltr"
              step="any"
              value={form.longitude}
              onChange={(event) => set("longitude", event.target.value)}
              aria-invalid={errorFor("longitude") ? true : undefined}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title={t("universities.sections.contact")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("universities.fields.website")}
            htmlFor={`${fieldId}-website`}
            error={errorFor("websiteUrl")}
          >
            <TextInput
              id={`${fieldId}-website`}
              type="url"
              dir="ltr"
              inputMode="url"
              placeholder="https://"
              value={form.websiteUrl}
              onChange={(event) => set("websiteUrl", event.target.value)}
              aria-invalid={errorFor("websiteUrl") ? true : undefined}
            />
          </Field>
          <Field
            label={t("universities.fields.establishedYear")}
            htmlFor={`${fieldId}-established`}
            error={errorFor("establishedYear")}
          >
            <NumberInput
              id={`${fieldId}-established`}
              dir="ltr"
              step="1"
              value={form.establishedYear}
              onChange={(event) => set("establishedYear", event.target.value)}
              aria-invalid={errorFor("establishedYear") ? true : undefined}
            />
          </Field>
          <Field
            label={t("universities.fields.phone")}
            htmlFor={`${fieldId}-phone`}
            error={errorFor("phone")}
          >
            <TextInput
              id={`${fieldId}-phone`}
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(event) => set("phone", event.target.value)}
              aria-invalid={errorFor("phone") ? true : undefined}
            />
          </Field>
          <Field
            label={t("universities.fields.email")}
            htmlFor={`${fieldId}-email`}
            error={errorFor("email")}
          >
            <TextInput
              id={`${fieldId}-email`}
              type="email"
              dir="ltr"
              inputMode="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              aria-invalid={errorFor("email") ? true : undefined}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title={t("universities.sections.description")}
        description={t("universities.sections.descriptionHint")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
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
          <Field
            label={t("universities.fields.aboutRich")}
            htmlFor={`${fieldId}-aboutRich`}
            error={errorFor("aboutRich")}
            hint={t("universities.hints.aboutRich")}
          >
            <TextArea
              id={`${fieldId}-aboutRich`}
              dir="ltr"
              rows={10}
              value={form.aboutRich}
              onChange={(event) => set("aboutRich", event.target.value)}
            />
          </Field>
          <Field
            label={t("universities.fields.aboutRichAr")}
            htmlFor={`${fieldId}-aboutRichAr`}
            error={errorFor("aboutRichAr")}
            hint={t("universities.hints.aboutRich")}
          >
            <TextArea
              id={`${fieldId}-aboutRichAr`}
              dir="rtl"
              rows={10}
              value={form.aboutRichAr}
              onChange={(event) => set("aboutRichAr", event.target.value)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title={t("universities.sections.visibility")}
        description={t("universities.sections.visibilityHint")}
      >
        <Toggle
          checked={form.published}
          onChange={(checked) => set("published", checked)}
          label={t("common.published")}
          description={t("universities.hints.published")}
        />
        <Toggle
          checked={form.isFeatured}
          onChange={(checked) => set("isFeatured", checked)}
          label={t("universities.fields.featured")}
          description={t("universities.hints.featured")}
        />
        <Toggle
          checked={form.isRecommended}
          onChange={(checked) => set("isRecommended", checked)}
          label={t("universities.fields.recommended")}
          description={t("universities.hints.recommended")}
        />
        <Toggle
          checked={form.isTrending}
          onChange={(checked) => set("isTrending", checked)}
          label={t("universities.fields.trending")}
          description={t("universities.hints.trending")}
        />
      </FormSection>

      <FormActions>
        {dirty ? (
          <p className="me-auto text-[12.5px] text-[#B77714]">
            {t("common.unsavedChanges")}
          </p>
        ) : null}
        <button type="submit" disabled={pending || !dirty} className={PRIMARY_BUTTON}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </FormActions>
    </form>
  );
}
