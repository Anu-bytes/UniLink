"use client";

import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  Field,
  FormActions,
  FormSection,
  NumberInput,
  SelectInput,
  TextInput,
  Toggle,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { formatMoney } from "@/lib/format";

import { adminWrite } from "./request";
import { PRIMARY_BUTTON } from "./styles";
import { TUITION_PERIODS } from "./types";
import type { ProgramFees } from "./types";

type FeesState = {
  tuitionFee: string;
  tuitionPeriod: string;
  currency: string;
  applicationFee: string;
  applicationFeeWaived: boolean;
};

// Amounts live in state as strings so a half-typed "98." is not thrown away
// between keystrokes; they are parsed once, on submit.
function toState(fees: ProgramFees): FeesState {
  return {
    tuitionFee: fees.tuitionFee === null ? "" : String(fees.tuitionFee),
    tuitionPeriod: fees.tuitionPeriod,
    currency: fees.currency,
    applicationFee: fees.applicationFee === null ? "" : String(fees.applicationFee),
    applicationFeeWaived: fees.applicationFeeWaived,
  };
}

/** Empty clears the column; anything unparseable is left to the API to reject. */
function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Intl throws a RangeError on an ill-formed currency code, and this box is
 * being typed into a character at a time — so the preview waits until three
 * letters are there rather than crashing the tab on "EG".
 */
function isCurrencyCode(value: string) {
  return /^[A-Za-z]{3}$/.test(value.trim());
}

export function ProgramFeesPanel({
  programId,
  fees,
}: {
  programId: string;
  fees: ProgramFees;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [form, setForm] = useState<FeesState>(() => toState(fees));
  // The saved snapshot, not the props: after a save the server round-trip has
  // not landed yet, so `dirty` has to compare against what was just accepted.
  const [baseline, setBaseline] = useState<FeesState>(() => toState(fees));
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<{
    field: string | null;
    message: string;
  } | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);

  function set<K extends keyof FeesState>(key: K, value: FeesState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: string) {
    return failure?.field === field ? failure.message : null;
  }

  const currency = form.currency.trim().toUpperCase();
  const tuitionAmount = isCurrencyCode(currency)
    ? formatMoney(locale, toNumber(form.tuitionFee), currency)
    : null;
  const applicationAmount = isCurrencyCode(currency)
    ? formatMoney(locale, toNumber(form.applicationFee), currency)
    : null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !dirty) return;

    setPending(true);
    setFailure(null);
    const result = await adminWrite(`/api/admin/programs/${programId}`, "PATCH", {
      tuitionFee: toNumber(form.tuitionFee),
      tuitionPeriod: form.tuitionPeriod,
      currency: form.currency,
      applicationFee: toNumber(form.applicationFee),
      applicationFeeWaived: form.applicationFeeWaived,
    });
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
        title={t("programs.fees.title")}
        description={t("programs.fees.description")}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label={t("programs.fields.tuitionFee")}
            htmlFor={`${fieldId}-tuitionFee`}
            error={errorFor("tuitionFee")}
          >
            <NumberInput
              id={`${fieldId}-tuitionFee`}
              dir="ltr"
              min={0}
              step="0.01"
              value={form.tuitionFee}
              onChange={(event) => set("tuitionFee", event.target.value)}
              aria-invalid={errorFor("tuitionFee") ? true : undefined}
            />
          </Field>

          <Field
            label={t("programs.fields.tuitionPeriod")}
            htmlFor={`${fieldId}-tuitionPeriod`}
            error={errorFor("tuitionPeriod")}
          >
            <SelectInput
              id={`${fieldId}-tuitionPeriod`}
              value={form.tuitionPeriod}
              onChange={(event) => set("tuitionPeriod", event.target.value)}
              aria-invalid={errorFor("tuitionPeriod") ? true : undefined}
              options={TUITION_PERIODS.map((period) => ({
                value: period,
                label: tCatalog(`tuitionPeriods.${period}`),
              }))}
            />
          </Field>

          <Field
            label={t("programs.fields.currency")}
            htmlFor={`${fieldId}-currency`}
            error={errorFor("currency")}
            hint={t("programs.hints.currency")}
          >
            <TextInput
              id={`${fieldId}-currency`}
              dir="ltr"
              maxLength={3}
              value={form.currency}
              onChange={(event) => set("currency", event.target.value.toUpperCase())}
              aria-invalid={errorFor("currency") ? true : undefined}
              className="uppercase"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("programs.fields.applicationFee")}
            htmlFor={`${fieldId}-applicationFee`}
            error={errorFor("applicationFee")}
            hint={t("programs.hints.applicationFee")}
          >
            <NumberInput
              id={`${fieldId}-applicationFee`}
              dir="ltr"
              min={0}
              step="0.01"
              value={form.applicationFee}
              onChange={(event) => set("applicationFee", event.target.value)}
              aria-invalid={errorFor("applicationFee") ? true : undefined}
            />
          </Field>

          <div className="flex items-end pb-1">
            <Toggle
              checked={form.applicationFeeWaived}
              onChange={(checked) => set("applicationFeeWaived", checked)}
              label={t("programs.fields.applicationFeeWaived")}
              description={t("programs.hints.applicationFeeWaived")}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title={t("programs.fees.previewTitle")}
        description={t("programs.fees.previewDescription")}
      >
        <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200/80">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
            <dt className="text-[13px] text-[#64748B]">
              {t("programs.fees.tuitionLabel")}
            </dt>
            <dd className="text-[15px] font-semibold tabular-nums text-[#0F172A]">
              {tuitionAmount ? (
                <>
                  {tuitionAmount}
                  <span className="text-[13px] font-normal text-[#64748B]">
                    {tCatalog(`tuitionPeriods.${form.tuitionPeriod}`)}
                  </span>
                </>
              ) : (
                <span className="text-[13px] font-normal text-slate-400">
                  {t("common.notSet")}
                </span>
              )}
            </dd>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
            <dt className="text-[13px] text-[#64748B]">
              {t("programs.fees.applicationLabel")}
            </dt>
            <dd className="text-[15px] font-semibold tabular-nums text-[#0F172A]">
              {form.applicationFeeWaived ? (
                <span className="text-[13px] font-semibold text-[#0F7B45]">
                  {t("programs.fees.waived")}
                </span>
              ) : applicationAmount ? (
                applicationAmount
              ) : (
                <span className="text-[13px] font-normal text-slate-400">
                  {t("common.notSet")}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </FormSection>

      <FormActions>
        <button type="submit" disabled={pending || !dirty} className={PRIMARY_BUTTON}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </FormActions>
    </form>
  );
}
