import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { SignupForm } from "@/components/signup-form";

export default async function SignupPage() {
  const t = await getTranslations("Auth.signup");

  const termsContent = t.rich("terms", {
    terms: (chunks) => (
      <Link
        href="/terms"
        className="font-medium text-brand-blue hover:underline"
      >
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
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
          <GraduationCap className="size-6" />
        </div>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <SocialAuthButtons googleLabel={t("google")} />

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            {t("orContinueWith")}
          </span>
          <Separator className="flex-1" />
        </div>

        <SignupForm
          labels={{
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
