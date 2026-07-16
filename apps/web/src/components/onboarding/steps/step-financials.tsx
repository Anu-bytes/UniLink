"use client";

import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";

import { financialsSchema, BUDGET_BANDS } from "@/lib/onboarding-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";

export function StepFinancials() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(financialsSchema, { budgetBand: data.budgetBand });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  const budgetItems = Object.fromEntries(
    BUDGET_BANDS.map((v) => [v, t(`options.budgetBand.${v}`)]),
  );

  return (
    <StepShell
      onSubmit={submit}
      question={t("financials.heading")}
      help={t("financials.help")}
      submitLabel={t("continue")}
      illustration={<Wallet className="size-10" />}
    >
      <Field label={t("financials.label")} error={form.errors.budgetBand}>
        <Select
          items={budgetItems}
          value={(form.values.budgetBand as string) ?? null}
          onValueChange={(v) => form.setValue("budgetBand", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("financials.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_BANDS.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`options.budgetBand.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </StepShell>
  );
}
