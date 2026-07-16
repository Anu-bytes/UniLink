"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";

import { studyLevelSchema, STUDY_LEVELS } from "@/lib/onboarding-schema";
import { useWizard } from "../wizard-context";
import { StepShell, Field, OptionCards, useStepForm } from "./step-primitives";

export function StepStudyLevel() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(studyLevelSchema, { studyLevel: data.studyLevel });

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
      question={t("studyLevel.heading")}
      help={t("studyLevel.help")}
      submitLabel={t("continue")}
      illustration={<GraduationCap className="size-10" />}
    >
      <Field error={form.errors.studyLevel}>
        <OptionCards
          value={form.values.studyLevel as (typeof STUDY_LEVELS)[number]}
          onChange={(v) => form.setValue("studyLevel", v)}
          options={STUDY_LEVELS.map((value) => {
            const comingSoon = value !== "BACHELOR";
            return {
              value,
              label: t(`options.studyLevel.${value}`),
              disabled: comingSoon,
              badge: comingSoon ? t("soon") : undefined,
            };
          })}
        />
      </Field>
    </StepShell>
  );
}
