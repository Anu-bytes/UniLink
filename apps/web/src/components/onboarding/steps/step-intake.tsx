"use client";

import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";

import {
  intakeSchema,
  INTAKE_SEASONS,
  INTAKE_YEARS,
} from "@/lib/onboarding-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";

export function StepIntake() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(intakeSchema, {
    intakeSeason: data.intakeSeason,
    intakeYear: data.intakeYear,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  const seasonItems = Object.fromEntries(
    INTAKE_SEASONS.map((v) => [v, t(`options.intakeSeason.${v}`)]),
  );
  const yearItems = Object.fromEntries(
    INTAKE_YEARS.map((y) => [String(y), String(y)]),
  );

  return (
    <StepShell
      onSubmit={submit}
      question={t("intake.heading")}
      help={t("intake.help")}
      submitLabel={t("continue")}
      illustration={<CalendarDays className="size-10" />}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
          <CalendarDays className="size-5" />
        </div>
        <div>
          <p className="font-semibold">{t("intake.dateTitle")}</p>
          <p className="text-sm text-muted-foreground">
            {t("intake.dateSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("intake.seasonLabel")} error={form.errors.intakeSeason}>
          <Select
            items={seasonItems}
            value={(form.values.intakeSeason as string) ?? null}
            onValueChange={(v) => form.setValue("intakeSeason", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("intake.seasonPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {INTAKE_SEASONS.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`options.intakeSeason.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("intake.yearLabel")} error={form.errors.intakeYear}>
          <Select
            items={yearItems}
            value={
              form.values.intakeYear != null
                ? String(form.values.intakeYear)
                : null
            }
            onValueChange={(v) => form.setValue("intakeYear", Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("intake.yearPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {INTAKE_YEARS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </StepShell>
  );
}
