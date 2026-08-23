import { getTranslations } from "next-intl/server";

import {
  ForgotPasswordForm,
  type ForgotPasswordLabels,
} from "@/components/forgot-password-form";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("Auth.forgotPassword");

  // Passed down as plain strings rather than reading the catalogue in the
  // client component, matching how LoginForm is wired.
  const labels: ForgotPasswordLabels = {
    emailStepTitle: t("emailStepTitle"),
    emailStepSubtitle: t("emailStepSubtitle"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    sendCode: t("sendCode"),
    codeStepTitle: t("codeStepTitle"),
    codeStepSubtitle: t("codeStepSubtitle"),
    codeLabel: t("codeLabel"),
    verify: t("verify"),
    resend: t("resend"),
    resendIn: t("resendIn"),
    changeEmail: t("changeEmail"),
    passwordStepTitle: t("passwordStepTitle"),
    passwordStepSubtitle: t("passwordStepSubtitle"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    confirmLabel: t("confirmLabel"),
    confirmPlaceholder: t("confirmPlaceholder"),
    showPassword: t("showPassword"),
    hidePassword: t("hidePassword"),
    savePassword: t("savePassword"),
    mismatch: t("mismatch"),
    requirements: {
      minLength: t("requirements.minLength"),
      lowercase: t("requirements.lowercase"),
      uppercase: t("requirements.uppercase"),
      number: t("requirements.number"),
    },
    doneTitle: t("doneTitle"),
    doneSubtitle: t("doneSubtitle"),
    goToLogin: t("goToLogin"),
    backToLogin: t("backToLogin"),
    genericError: t("genericError"),
  };

  return <ForgotPasswordForm labels={labels} />;
}
