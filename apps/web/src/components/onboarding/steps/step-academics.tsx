"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";

import {
  academicsSchema,
  HIGH_SCHOOL_SYSTEMS,
  GRADUATION_YEARS,
} from "@/lib/onboarding-schema";
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
    highSchoolSystem: data.highSchoolSystem,
    highSchoolSystemOther: data.highSchoolSystemOther,
    graduationYear: data.graduationYear,
    gradeValue: data.gradeValue,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  const systemItems = Object.fromEntries(
    HIGH_SCHOOL_SYSTEMS.map((v) => [v, t(`options.highSchoolSystem.${v}`)]),
  );
  const yearItems = Object.fromEntries(
    GRADUATION_YEARS.map((y) => [String(y), String(y)]),
  );

  const isOther = form.values.highSchoolSystem === "OTHER";

  return (
    <StepShell
      onSubmit={submit}
      question={t("academics.heading")}
      help={t("academics.help")}
      submitLabel={t("continue")}
      illustration={<GraduationCap className="size-10" />}
    >
      <Field
        label={t("academics.systemLabel")}
        error={form.errors.highSchoolSystem}
      >
        <Select
          items={systemItems}
          value={(form.values.highSchoolSystem as string) ?? null}
          onValueChange={(v) => form.setValue("highSchoolSystem", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("academics.systemPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {HIGH_SCHOOL_SYSTEMS.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`options.highSchoolSystem.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {isOther ? (
        <Field
          label={t("academics.otherLabel")}
          error={form.errors.highSchoolSystemOther}
        >
          <Input
            placeholder={t("academics.otherPlaceholder")}
            value={(form.values.highSchoolSystemOther as string) ?? ""}
            onChange={(e) =>
              form.setValue("highSchoolSystemOther", e.target.value)
            }
          />
        </Field>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t("academics.graduationYearLabel")}
          error={form.errors.graduationYear}
        >
          <Select
            items={yearItems}
            value={
              form.values.graduationYear != null
                ? String(form.values.graduationYear)
                : null
            }
            onValueChange={(v) => form.setValue("graduationYear", Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("academics.graduationYearPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {GRADUATION_YEARS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("academics.gradeLabel")} error={form.errors.gradeValue}>
          <Input
            placeholder={t("academics.gradePlaceholder")}
            value={(form.values.gradeValue as string) ?? ""}
            onChange={(e) => form.setValue("gradeValue", e.target.value)}
          />
        </Field>
      </div>
    </StepShell>
  );
}
