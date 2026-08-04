import { GraduationCap, Mail, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { AvatarUploader } from "@/components/app/avatar-uploader";
import { PreferencesSection } from "@/components/app/preferences-section";
import {
  CompletenessBar,
  ProfileCard,
  ProfileField,
} from "@/components/app/profile-card";
import { isStorageConfigured } from "@/lib/supabase-storage";
import { COUNTRIES } from "@/lib/countries";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const t = await getTranslations("AppProfile");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);
  const isArabic = locale.startsWith("ar");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });

  if (!user) redirect(`/${locale}/login`);

  const profile = user.studentProfile;

  const country = profile
    ? COUNTRIES.find((entry) => entry.code === profile.nationality)
    : undefined;

  // Everything the match scorer reads, plus the contact details. Drives the
  // completeness meter so a vague set of results has a visible explanation.
  const completionChecks = [
    Boolean(user.name),
    Boolean(user.phone),
    Boolean(user.image),
    Boolean(profile),
    Boolean(profile?.gradeValue),
    Boolean(profile?.fieldsOfStudy.length),
    Boolean(profile && profile.englishTest !== "NONE"),
  ];
  const complete = completionChecks.filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-32 md:px-6 md:py-8">
      <header>
        <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>
      </header>

      <div className="mt-6 space-y-4">
        <ProfileCard icon={UserRound} title={t("account")}>
          <AvatarUploader
            user={{ name: user.name, email: user.email, image: user.image }}
            storageReady={isStorageConfigured()}
          >
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-[#1F2A44]">
                {user.name ?? t("noName")}
              </p>
              <p
                dir="ltr"
                className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-[#5a6072] rtl:justify-end"
              >
                <Mail className="size-3.5 shrink-0" aria-hidden />
                {user.email}
              </p>
            </div>
          </AvatarUploader>

          <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <ProfileField
              label={t("phone")}
              value={user.phone}
              emptyLabel={t("notSet")}
              ltr
            />
            <ProfileField
              label={t("nationality")}
              value={
                country ? (isArabic ? country.nameAr : country.name) : null
              }
              emptyLabel={t("notSet")}
            />
          </dl>

          <div className="mt-6 rounded-xl bg-[#F7F9FE] p-4">
            <CompletenessBar
              complete={complete}
              total={completionChecks.length}
              label={t("completeness")}
              hint={t("completenessHint")}
            />
          </div>
        </ProfileCard>

        {profile ? (
          <>
            <ProfileCard
              icon={GraduationCap}
              title={t("academics")}
              description={t("academicsHint")}
            >
              <dl className="grid gap-5 sm:grid-cols-2">
                <ProfileField
                  label={t("highSchoolSystem")}
                  value={
                    profile.highSchoolSystem === "OTHER" &&
                    profile.highSchoolSystemOther
                      ? profile.highSchoolSystemOther
                      : tCatalog(`systems.${profile.highSchoolSystem}`)
                  }
                  emptyLabel={t("notSet")}
                />
                <ProfileField
                  label={t("graduationYear")}
                  value={formatNumber(locale, profile.graduationYear)}
                  emptyLabel={t("notSet")}
                />
                <ProfileField
                  label={t("grade")}
                  value={profile.gradeValue}
                  emptyLabel={t("notSet")}
                />
              </dl>
            </ProfileCard>

            <PreferencesSection
              initial={{
                fieldsOfStudy: profile.fieldsOfStudy,
                budgetBand: profile.budgetBand,
                intakeSeason: profile.intakeSeason,
                intakeYear: profile.intakeYear,
                englishTest: profile.englishTest,
                englishScore: profile.englishScore,
              }}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F7F9FE] px-6 py-14 text-center">
            <span
              aria-hidden
              className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#1E6DEB] shadow-sm"
            >
              <GraduationCap className="size-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-[#1F2A44]">
              {t("noProfileTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
              {t("noProfileBody")}
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
            >
              {t("completeProfile")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
