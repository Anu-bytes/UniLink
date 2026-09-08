"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  BilingualField,
  Field,
  FormActions,
  FormSection,
  ImageField,
  NumberInput,
  TextArea,
  TextInput,
  Toggle,
  useToast,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { TestimonialPreview } from "./testimonial-preview";
import type { TestimonialRow } from "./types";

type FormState = {
  studentName: string;
  quote: string;
  quoteAr: string;
  location: string;
  locationAr: string;
  avatarUrl: string | null;
  sortOrder: string;
  isPublished: boolean;
};

// sortOrder lives in state as a string so a cleared input is not silently
// turned into 0 between keystrokes; it is parsed once, on submit.
function toState(testimonial: TestimonialRow | null): FormState {
  if (!testimonial) {
    return {
      studentName: "",
      quote: "",
      quoteAr: "",
      location: "",
      locationAr: "",
      avatarUrl: null,
      sortOrder: "",
      isPublished: false,
    };
  }

  return {
    studentName: testimonial.studentName,
    quote: testimonial.quote,
    quoteAr: testimonial.quoteAr ?? "",
    location: testimonial.location ?? "",
    locationAr: testimonial.locationAr ?? "",
    avatarUrl: testimonial.avatarUrl,
    sortOrder: String(testimonial.sortOrder),
    isPublished: testimonial.isPublished,
  };
}

function toInteger(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Create and edit are the same eight fields, so they are one component. The
 * preview beside them is not decoration: a testimonial is published straight
 * onto the home page, and the strip truncates nothing, so an editor needs to
 * see the card they are actually shipping.
 */
export function TestimonialForm({
  testimonial = null,
}: {
  /** Absent in create mode. */
  testimonial?: TestimonialRow | null;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<FormState>(() => toState(testimonial));
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<FormState>(() => toState(testimonial));
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
  const complete = form.studentName.trim() !== "" && form.quote.trim() !== "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !complete) return;
    if (testimonial && !dirty) return;

    const sortOrder = toInteger(form.sortOrder);
    const payload = {
      studentName: form.studentName,
      quote: form.quote,
      quoteAr: form.quoteAr,
      location: form.location,
      locationAr: form.locationAr,
      avatarUrl: form.avatarUrl,
      isPublished: form.isPublished,
      // An empty box means "leave the position alone": on create the API puts
      // the testimonial last in the strip, and on update an absent key does
      // not touch the column. Sending null would fail validation instead.
      ...(sortOrder === null ? {} : { sortOrder }),
    };

    setPending(true);
    setFailure(null);
    const result = testimonial
      ? await adminWrite<TestimonialRow>(
          `/api/admin/testimonials/${testimonial.id}`,
          "PATCH",
          payload,
        )
      : await adminWrite<TestimonialRow>(
          "/api/admin/testimonials",
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

    if (!testimonial) {
      toast({ title: t("testimonials.toasts.created") });
      router.push(`/admin/testimonials/${result.data.id}`);
      return;
    }

    setBaseline(form);
    toast({ title: t("testimonials.toasts.saved") });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid items-start gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <FormSection
          title={t("testimonials.sections.student")}
          description={t("testimonials.sections.studentHint")}
        >
          <Field
            label={t("testimonials.fields.studentName")}
            htmlFor={`${fieldId}-studentName`}
            required
            error={errorFor("studentName")}
            hint={t("testimonials.hints.studentName")}
          >
            <TextInput
              id={`${fieldId}-studentName`}
              dir="auto"
              value={form.studentName}
              onChange={(event) => set("studentName", event.target.value)}
              aria-invalid={errorFor("studentName") ? true : undefined}
              autoFocus={testimonial === null}
            />
          </Field>

          <BilingualField
            label={t("testimonials.fields.location")}
            hint={t("testimonials.hints.location")}
            en={{
              value: form.location,
              onChange: (event) => set("location", event.target.value),
              "aria-invalid": errorFor("location") ? true : undefined,
            }}
            ar={{
              value: form.locationAr,
              onChange: (event) => set("locationAr", event.target.value),
            }}
          />

          <ImageField
            value={form.avatarUrl}
            onChange={(url) => set("avatarUrl", url)}
            folder="testimonials"
            aspect="square"
            label={t("testimonials.fields.avatar")}
            hint={t("testimonials.hints.avatar")}
          />
          {errorFor("avatarUrl") ? (
            <p className="text-[12.5px] font-medium text-[#C81F15]">
              {errorFor("avatarUrl")}
            </p>
          ) : null}
        </FormSection>

        <FormSection
          title={t("testimonials.sections.quote")}
          description={t("testimonials.sections.quoteHint")}
        >
          <Field
            label={t("testimonials.fields.quote")}
            htmlFor={`${fieldId}-quote`}
            required
            error={errorFor("quote")}
          >
            <TextArea
              id={`${fieldId}-quote`}
              dir="ltr"
              value={form.quote}
              onChange={(event) => set("quote", event.target.value)}
              aria-invalid={errorFor("quote") ? true : undefined}
            />
          </Field>

          <Field
            label={t("testimonials.fields.quoteAr")}
            htmlFor={`${fieldId}-quoteAr`}
            error={errorFor("quoteAr")}
            hint={t("testimonials.hints.quoteAr")}
          >
            <TextArea
              id={`${fieldId}-quoteAr`}
              dir="rtl"
              value={form.quoteAr}
              onChange={(event) => set("quoteAr", event.target.value)}
              aria-invalid={errorFor("quoteAr") ? true : undefined}
            />
          </Field>
        </FormSection>

        <FormSection title={t("testimonials.sections.display")}>
          <Field
            label={t("testimonials.fields.sortOrder")}
            htmlFor={`${fieldId}-sortOrder`}
            error={errorFor("sortOrder")}
            hint={t("testimonials.hints.sortOrder")}
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

          <Toggle
            checked={form.isPublished}
            onChange={(checked) => set("isPublished", checked)}
            label={t("testimonials.fields.published")}
            description={t("testimonials.hints.published")}
          />
        </FormSection>

        <FormActions>
          <Link href="/admin/testimonials" className={SECONDARY_BUTTON}>
            {t("common.cancel")}
          </Link>
          <button
            type="submit"
            disabled={pending || !complete || (testimonial !== null && !dirty)}
            className={PRIMARY_BUTTON}
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {pending
              ? t("common.saving")
              : testimonial
                ? t("common.save")
                : t("common.create")}
          </button>
        </FormActions>
      </div>

      <aside className="xl:sticky xl:top-6">
        <FormSection
          title={t("testimonials.preview.title")}
          description={t("testimonials.preview.hint")}
        >
          {/* The page ground the home page carousel sits on, so the card's own
              border and shadow read the way they will in production. */}
          <div className="rounded-xl bg-[#F7F8FA] p-4">
            <TestimonialPreview
              studentName={form.studentName}
              quote={form.quote}
              quoteAr={form.quoteAr}
              location={form.location}
              locationAr={form.locationAr}
              avatarUrl={form.avatarUrl}
            />
          </div>
        </FormSection>
      </aside>
    </form>
  );
}
