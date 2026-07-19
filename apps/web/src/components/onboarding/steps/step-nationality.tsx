"use client";

import { useTranslations } from "next-intl";
import { Flag } from "lucide-react";

import { nationalitySchema } from "@/lib/onboarding-schema";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";
import { CountryCombobox } from "./country-select";

export function StepNationality() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(nationalitySchema, {
    nationality: data.nationality,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  return (
    <StepShell
      onSubmit={submit}
      question={t("nationality.heading")}
      help={t("nationality.help")}
      submitLabel={t("continue")}
      illustration={<Flag className="size-10" />}
      orbits={["🇪🇬", "🇮🇳", "🇰🇷", "🇳🇬", "🇵🇰", "🇨🇳", "🇵🇭", "🇹🇷"]}
    >
      <Field label={t("nationality.label")} error={form.errors.nationality}>
        <CountryCombobox
          value={form.values.nationality as string | undefined}
          onChange={(code) => form.setValue("nationality", code)}
          placeholder={t("nationality.placeholder")}
          clearLabel={t("common.clear")}
        />
      </Field>
    </StepShell>
  );
}
