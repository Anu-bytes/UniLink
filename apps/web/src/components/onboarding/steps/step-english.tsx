"use client";

import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";

import { englishSchema, ENGLISH_TESTS } from "@/lib/onboarding-schema";
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

export function StepEnglish() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(englishSchema, {
    englishTest: data.englishTest,
    englishScore: data.englishScore,
  });

  const test = form.values.englishTest as string | undefined;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  const testItems = Object.fromEntries(
    ENGLISH_TESTS.map((v) => [v, t(`options.englishTest.${v}`)]),
  );

  return (
    <StepShell
      onSubmit={submit}
      question={t("english.heading")}
      help={t("english.help")}
      submitLabel={t("continue")}
      illustration={<Languages className="size-10" />}
    >
      <Field label={t("english.testLabel")} error={form.errors.englishTest}>
        <Select
          items={testItems}
          value={test ?? null}
          onValueChange={(v) => {
            form.setValue("englishTest", v);
            if (v === "NONE") form.setValue("englishScore", undefined);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("common.select")} />
          </SelectTrigger>
          <SelectContent>
            {ENGLISH_TESTS.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`options.englishTest.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {test && test !== "NONE" ? (
        <Field label={t("english.scoreLabel")} error={form.errors.englishScore}>
          <Input
            type="number"
            step="any"
            inputMode="decimal"
            placeholder={t("english.scorePlaceholder")}
            value={
              (form.values.englishScore as string | number | undefined) ?? ""
            }
            onChange={(e) => form.setValue("englishScore", e.target.value)}
          />
        </Field>
      ) : null}
    </StepShell>
  );
}
