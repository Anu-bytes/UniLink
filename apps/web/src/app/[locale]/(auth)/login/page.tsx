import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const t = await getTranslations("Auth.login");
  const statsT = await getTranslations("Home.stats");
  const stats = (
    statsT.raw("items") as { value: string; label: string }[]
  ).slice(0, 3);

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

        <dl className="relative mt-10 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white/10 p-3 text-center"
            >
              <dt className="text-lg font-bold">{s.value}</dt>
              <dd className="mt-0.5 text-[11px] leading-tight text-white/70">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Form panel */}
      <div className="p-8 sm:p-10">
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue md:hidden">
          <GraduationCap className="size-6" />
        </div>

        <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-6 space-y-5">
          <SocialAuthButtons googleLabel={t("google")} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {t("orContinueWith")}
            </span>
            <Separator className="flex-1" />
          </div>

          <LoginForm
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
