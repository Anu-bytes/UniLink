"use client";

import { useTranslations } from "next-intl";
import { UserRound, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCOUNT_ROLES, personalInfoSchema } from "@/lib/onboarding-schema";
import { Input } from "@/components/ui/input";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";
import { CountryCombobox } from "./country-select";

const ROLE_ICONS: Record<(typeof ACCOUNT_ROLES)[number], typeof UserRound> = {
  STUDENT: UserRound,
  PARENT: Users,
};

/**
 * Compact sliding-pill toggle for the 2-way student/parent pick — the
 * generic OptionCards grid (built for several options with a hint line each)
 * rendered these as two oversized cards for what is really a single binary
 * switch, out of proportion with the rest of the step.
 */
function RoleToggle({
  value,
  onChange,
}: {
  value: (typeof ACCOUNT_ROLES)[number] | undefined;
  onChange: (role: (typeof ACCOUNT_ROLES)[number]) => void;
}) {
  const t = useTranslations("Onboarding.personalInfo.accountRole");
  // Second option selected: same grid + sliding-pill technique as
  // SearchModeSwitch (see that component for why grid, not flex).
  const isSecond = value === ACCOUNT_ROLES[1];

  return (
    <div
      role="radiogroup"
      className="relative grid grid-cols-2 rounded-full border border-input bg-muted/40 p-1"
    >
      {value ? (
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-full bg-brand-blue shadow-sm transition-transform duration-300 ease-out",
            isSecond && "translate-x-full rtl:-translate-x-full",
          )}
        />
      ) : null}
      {ACCOUNT_ROLES.map((role) => {
        const Icon = ROLE_ICONS[role];
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(role)}
            className={cn(
              "relative z-10 flex h-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-300",
              selected ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {t(role)}
          </button>
        );
      })}
    </div>
  );
}

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
        <RoleToggle
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
