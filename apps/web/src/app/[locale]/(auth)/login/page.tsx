import { getLocale, getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { LoginForm } from "@/components/login-form";
import { LoginStats } from "@/components/login-stats";
import { getLandingCatalog, withDisplayOffsets } from "@/lib/catalog";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("Auth.login");
  const locale = await getLocale();
  const catalog = await getLandingCatalog(locale);
  const [universityCount, programCount, studentCount] = withDisplayOffsets(
    catalog.stats,
  );
  // raw() yields the key name rather than an array when a message is missing.
  // Guard the shape so a translation gap blanks the labels instead of 500ing
  // the whole sign-in page; next-intl still logs MISSING_MESSAGE either way.
  const rawStatLabels = t.raw("statLabels");
  const statLabels = Array.isArray(rawStatLabels)
    ? (rawStatLabels as string[])
    : [];
  const statValues = [universityCount, studentCount, programCount];

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-card shadow-xl ring-1 ring-border/50 duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 motion-reduce:animate-none md:grid md:grid-cols-2">
      {/* Brand showcase panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-dark p-10 text-white md:flex">
        <div className="absolute -end-16 -top-16 size-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -start-12 size-72 rounded-full bg-white/5" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            <span className="size-2 rounded-full bg-emerald-400" />
            {t("badge")}
          </span>
          <h1 className="mt-8 text-3xl font-bold leading-tight">
            {t("headline")}
          </h1>
          <p className="mt-3 max-w-xs text-white/80">{t("subtitle")}</p>
        </div>

        <LoginStats values={statValues} labels={statLabels} />
      </div>

      {/* Form panel */}
      <div className="p-8 sm:p-10">
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue md:hidden">
          <GraduationCap className="size-6" />
        </div>

        <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-6 space-y-5">
          <SocialAuthButtons googleLabel={t("google")} callbackUrl={callbackUrl} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {t("orContinueWith")}
            </span>
            <Separator className="flex-1" />
          </div>

          <LoginForm
            callbackUrl={callbackUrl}
            labels={{
              emailLabel: t("emailLabel"),
              emailPlaceholder: t("emailPlaceholder"),
              passwordLabel: t("passwordLabel"),
              passwordPlaceholder: t("passwordPlaceholder"),
              forgotPassword: t("forgotPassword"),
              submit: t("submit"),
              showPassword: t("showPassword"),
              hidePassword: t("hidePassword"),
            }}
          />

          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/onboarding"
              className="font-medium text-brand-blue hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
