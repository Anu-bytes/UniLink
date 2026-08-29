"use client";

import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

import { ACCOUNT_ROLES, personalInfoSchema } from "@/lib/onboarding-schema";
import { Input } from "@/components/ui/input";
import { useWizard } from "../wizard-context";
import { StepShell, Field, OptionCards, useStepForm } from "./step-primitives";
import { CountryCombobox } from "./country-select";

export function StepPersonalInfo() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(personalInfoSchema, {
    accountRole: data.accountRole,
    firstName: data.firstName,
    lastName: data.lastName,
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
      question={t("personalInfo.heading")}
      help={t("personalInfo.help")}
      submitLabel={t("continue")}
      illustration={<UserRound className="size-10" />}
    >
      <Field
        label={t("personalInfo.accountRoleLabel")}
        error={form.errors.accountRole}
      >
        <OptionCards
          columns={2}
          options={ACCOUNT_ROLES.map((role) => ({
            value: role,
            label: t(`personalInfo.accountRole.${role}`),
          }))}
          value={form.values.accountRole as (typeof ACCOUNT_ROLES)[number] | undefined}
          onChange={(role) => form.setValue("accountRole", role)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t("personalInfo.firstNameLabel")}
          error={form.errors.firstName}
        >
          <Input
            autoComplete="given-name"
            placeholder={t("personalInfo.firstNamePlaceholder")}
            value={(form.values.firstName as string) ?? ""}
            onChange={(e) => form.setValue("firstName", e.target.value)}
          />
        </Field>

        <Field
          label={t("personalInfo.lastNameLabel")}
          error={form.errors.lastName}
        >
          <Input
            autoComplete="family-name"
            placeholder={t("personalInfo.lastNamePlaceholder")}
            value={(form.values.lastName as string) ?? ""}
            onChange={(e) => form.setValue("lastName", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label={t("personalInfo.countryLabel")}
        error={form.errors.nationality}
      >
        <CountryCombobox
          value={form.values.nationality as string | undefined}
          onChange={(code) => form.setValue("nationality", code)}
          placeholder={t("personalInfo.countryPlaceholder")}
          clearLabel={t("common.clear")}
        />
      </Field>
    </StepShell>
  );
}
