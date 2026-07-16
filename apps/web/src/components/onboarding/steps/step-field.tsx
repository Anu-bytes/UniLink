"use client";

import { useLocale, useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

import { fieldSchema } from "@/lib/onboarding-schema";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";
import { SearchMultiSelect } from "./search-multi-select";

export function StepField() {
  const t = useTranslations("Onboarding");
  const locale = useLocale();
  const { data, setData, next } = useWizard();
  const form = useStepForm(fieldSchema, {
    fieldsOfStudy: data.fieldsOfStudy ?? [],
  });

  const options = FIELDS_OF_STUDY.map((f) => ({
    value: f.value,
    label: locale === "ar" ? f.ar : f.en,
  }));

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
      question={t("field.heading")}
      help={t("field.help")}
      submitLabel={t("continue")}
      illustration={<BookOpen className="size-10" />}
    >
      <Field error={form.errors.fieldsOfStudy}>
        <SearchMultiSelect
          value={(form.values.fieldsOfStudy as string[]) ?? []}
          onChange={(vals) => form.setValue("fieldsOfStudy", vals)}
          options={options}
          placeholder={t("field.placeholder")}
          max={3}
          emptyLabel={t("field.empty")}
          counterLabel={(selected, max) =>
            t("field.counter", { selected, max })
          }
        />
      </Field>
    </StepShell>
  );
}
