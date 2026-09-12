import { GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { AcademicsEditor } from "@/components/app/academics-editor";
import { AccountEditor } from "@/components/app/account-editor";
import { PreferencesSection } from "@/components/app/preferences-section";
import { isStorageConfigured } from "@/lib/supabase-storage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const t = await getTranslations("AppProfile");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });

  if (!user) redirect(`/${locale}/login`);

  const profile = user.studentProfile;

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
        <AccountEditor
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
          }}
          storageReady={isStorageConfigured()}
          complete={complete}
          total={completionChecks.length}
        />

        {profile ? (
          <>
            <AcademicsEditor
              initial={{
                studyLevel: profile.studyLevel,
                highSchoolSystem: profile.highSchoolSystem,
                highSchoolSystemOther: profile.highSchoolSystemOther,
                graduationYear: profile.graduationYear,
                gradeValue: profile.gradeValue,
                nationality: profile.nationality,
                bio: profile.bio,
              }}
            />

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
