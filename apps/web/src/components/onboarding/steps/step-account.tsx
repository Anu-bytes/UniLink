"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { accountSchema } from "@/lib/onboarding-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { PasswordRequirements } from "@/components/password-requirements";
import { useWizard } from "../wizard-context";
import { Field, useStepForm } from "./step-primitives";

export function AccountStep({
  onFinish,
  error,
}: {
  onFinish: (account: { email: string; password: string }) => void;
  error: string | null;
}) {
  const t = useTranslations("Onboarding.account");
  const { data, setData } = useWizard();
  const form = useStepForm(accountSchema, {
    email: data.email,
    password: data.password,
    acceptTerms: data.acceptTerms === true ? true : undefined,
  });

  const email = (form.values.email as string) ?? "";
  const password = (form.values.password as string) ?? "";
  const acceptTerms = Boolean(form.values.acceptTerms);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    // Persist email so a refresh keeps it (password intentionally not stored).
    setData({ email: valid.email });
    onFinish({ email: valid.email, password: valid.password });
  }

  const terms = t.rich("terms", {
    terms: (chunks) => (
      <Link href="/terms" className="font-medium text-brand-blue hover:underline">
        {chunks}
      </Link>
    ),
    privacy: (chunks) => (
      <Link
        href="/privacy"
        className="font-medium text-brand-blue hover:underline"
      >
        {chunks}
      </Link>
    ),
  });

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-5" noValidate>
      <p className="text-center text-sm text-muted-foreground">{t("help")}</p>

      <SocialAuthButtons googleLabel={t("google")} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {t("orContinueWith")}
        </span>
        <Separator className="flex-1" />
      </div>

      <Field label={t("emailLabel")} error={form.errors.email}>
        <Input
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => form.setValue("email", e.target.value)}
        />
      </Field>

      <div className="space-y-1.5">
        <Label>{t("passwordLabel")}</Label>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => form.setValue("password", e.target.value)}
        />
        <PasswordRequirements
          password={password}
          labels={{
            minLength: t("requirements.minLength"),
            lowercase: t("requirements.lowercase"),
            uppercase: t("requirements.uppercase"),
            number: t("requirements.number"),
          }}
        />
        {form.errors.password ? (
          <p className="text-sm text-destructive" role="alert">
            {form.errors.password}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={acceptTerms}
            onCheckedChange={(v) => form.setValue("acceptTerms", v === true)}
            className="mt-0.5"
          />
          <span>{terms}</span>
        </label>
        {form.errors.acceptTerms ? (
          <p className="text-sm text-destructive" role="alert">
            {form.errors.acceptTerms}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-brand-blue to-[#7c3aed] py-6 text-base font-semibold text-white hover:opacity-95"
      >
        {t("submit")}
      </Button>
    </form>
  );
}
