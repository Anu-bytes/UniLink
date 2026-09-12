"use client";

import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

import { Link } from "@/i18n/navigation";
import { accountSchema, googleWizardAccountSchema } from "@/lib/onboarding-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { PasswordRequirements } from "@/components/password-requirements";
import { useWizard } from "../wizard-context";
import { Field, useStepForm } from "./step-primitives";

const googleAccountSchema = googleWizardAccountSchema.pick({
  phone: true,
  acceptTerms: true,
});

export function AccountStep({
  onFinish,
  onGoogleFinish,
  signedInEmail,
  error,
}: {
  onFinish: (account: {
    email: string;
    phone: string;
    password: string;
  }) => void;
  /** Called instead of `onFinish` once `signedInEmail` is set — there is no
   * password to collect since Google already signed the visitor in. */
  onGoogleFinish: (account: { phone: string; acceptTerms: boolean }) => void;
  /** Set once the visitor has a session — they clicked "Continue with
   * Google" on this step and are back from the OAuth redirect. */
  signedInEmail: string | null;
  error: string | null;
}) {
  const t = useTranslations("Onboarding.account");
  const locale = useLocale();
  const { data, setData } = useWizard();

  const form = useStepForm(accountSchema, {
    email: data.email,
    phone: data.phone,
    password: data.password,
    acceptTerms: data.acceptTerms === true ? true : undefined,
  });
  const googleForm = useStepForm(googleAccountSchema, {
    phone: data.phone,
    acceptTerms: data.acceptTerms === true ? true : undefined,
  });

  const email = (form.values.email as string) ?? "";
  const phone = (form.values.phone as string) ?? "";
  const password = (form.values.password as string) ?? "";
  const acceptTerms = Boolean(form.values.acceptTerms);

  const googlePhone = (googleForm.values.phone as string) ?? "";
  const googleAcceptTerms = Boolean(googleForm.values.acceptTerms);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    // Persist email and phone so a refresh keeps them (password not stored).
    setData({ email: valid.email, phone: valid.phone });
    onFinish({
      email: valid.email,
      phone: valid.phone,
      password: valid.password,
    });
  }

  function submitGoogle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = googleForm.validate();
    if (!valid) return;
    setData({ phone: valid.phone, acceptTerms: valid.acceptTerms });
    onGoogleFinish(valid);
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

  if (signedInEmail) {
    return (
      <form
        onSubmit={submitGoogle}
        className="mx-auto max-w-md space-y-5"
        noValidate
      >
        <p className="text-center text-sm text-muted-foreground">
          {t("help")}
        </p>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-input bg-muted/40 px-4 py-3">
          <p className="min-w-0 truncate text-sm font-medium" dir="ltr">
            {t("continuingAs", { email: signedInEmail })}
          </p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: `/${locale}/onboarding` })}
            className="shrink-0 text-sm font-medium text-brand-blue hover:underline"
          >
            {t("notYou")}
          </button>
        </div>

        <Field label={t("phoneLabel")} error={googleForm.errors.phone}>
          <Input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            placeholder={t("phonePlaceholder")}
            value={googlePhone}
            onChange={(e) => googleForm.setValue("phone", e.target.value)}
          />
        </Field>

        <div className="space-y-1.5">
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={googleAcceptTerms}
              onCheckedChange={(v) =>
                googleForm.setValue("acceptTerms", v === true)
              }
              className="mt-0.5"
            />
            <span>{terms}</span>
          </label>
          {googleForm.errors.acceptTerms ? (
            <p className="text-sm text-destructive" role="alert">
              {googleForm.errors.acceptTerms}
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

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-5" noValidate>
      <p className="text-center text-sm text-muted-foreground">{t("help")}</p>

      <SocialAuthButtons
        googleLabel={t("google")}
        callbackUrl={`/${locale}/onboarding`}
      />

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

      <Field label={t("phoneLabel")} error={form.errors.phone}>
        <Input
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
          placeholder={t("phonePlaceholder")}
          value={phone}
          onChange={(e) => form.setValue("phone", e.target.value)}
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
