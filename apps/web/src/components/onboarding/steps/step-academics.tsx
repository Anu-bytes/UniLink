"use client";

import { useTranslations } from "next-intl";
import { GaugeCircle } from "lucide-react";

import { academicsSchema, GRADING_SCHEMES } from "@/lib/onboarding-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";

export function StepAcademics() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(academicsSchema, {
    gradingScheme: data.gradingScheme,
    gradeValue: data.gradeValue,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  const schemeItems = Object.fromEntries(
    GRADING_SCHEMES.map((v) => [v, t(`options.gradingScheme.${v}`)]),
  );

  return (
    <StepShell
      onSubmit={submit}
      question={t("academics.heading")}
      help={t("academics.help")}
      submitLabel={t("continue")}
      illustration={<GaugeCircle className="size-10" />}
    >
      <Field label={t("academics.schemeLabel")} error={form.errors.gradingScheme}>
        <Select
          items={schemeItems}
          value={(form.values.gradingScheme as string) ?? null}
          onValueChange={(v) => form.setValue("gradingScheme", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("common.select")} />
          </SelectTrigger>
          <SelectContent>
            {GRADING_SCHEMES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`options.gradingScheme.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label={t("academics.gradeLabel")} error={form.errors.gradeValue}>
        <Input
          type="number"
          step="any"
          inputMode="decimal"
          placeholder={t("academics.gradePlaceholder")}
          value={(form.values.gradeValue as string | number | undefined) ?? ""}
          onChange={(e) => form.setValue("gradeValue", e.target.value)}
        />
      </Field>
    </StepShell>
  );
}
