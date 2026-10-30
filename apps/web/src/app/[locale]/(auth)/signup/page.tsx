import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

export default async function SignupPage() {
  const t = await getTranslations("Auth.signup");

  const termsContent = t.rich("terms", {
    terms: (chunks) => (
      <Link
        href="/terms"
        target="_blank"
        className="font-medium text-brand-blue hover:underline"
      >
        {chunks}
      </Link>
    ),
    privacy: (chunks) => (
      <Link
        href="/privacy"
        target="_blank"
        className="font-medium text-brand-blue hover:underline"
      >
        {chunks}
      </Link>
    ),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
          <GraduationCap className="size-6" />
        </div>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <SignupForm
          labels={{
            google: t("google"),
            orContinueWith: t("orContinueWith"),
            termsRequired: t("termsRequired"),
            emailLabel: t("emailLabel"),
            emailPlaceholder: t("emailPlaceholder"),
            passwordLabel: t("passwordLabel"),
            passwordPlaceholder: t("passwordPlaceholder"),
            submit: t("submit"),
            requirements: {
              minLength: t("requirements.minLength"),
              lowercase: t("requirements.lowercase"),
              uppercase: t("requirements.uppercase"),
              number: t("requirements.number"),
            },
          }}
          termsContent={termsContent}
        />

        <p className="text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-brand-blue hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
