import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { COUNTRIES } from "@/lib/countries";
import { FIELDS_OF_STUDY } from "@/lib/fields";
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

  const fieldLabels =
    profile?.fieldsOfStudy.map((value) => {
      const field = FIELDS_OF_STUDY.find((entry) => entry.value === value);
      if (!field) return value;
      return isArabic ? field.ar : field.en;
    }) ?? [];

  const country = profile
    ? COUNTRIES.find((entry) => entry.code === profile.nationality)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="text-lg font-bold text-[#1F2A44]">{t("account")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={t("name")} value={user.name ?? "—"} />
          <Field label={t("email")} value={user.email} ltr />
          <Field label={t("phone")} value={user.phone ?? "—"} ltr />
        </dl>
      </section>

      {profile ? (
        <>
          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold text-[#1F2A44]">{t("academics")}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label={t("highSchoolSystem")}
                value={
                  profile.highSchoolSystem === "OTHER" &&
                  profile.highSchoolSystemOther
                    ? profile.highSchoolSystemOther
                    : tCatalog(`systems.${profile.highSchoolSystem}`)
                }
              />
              <Field
                label={t("graduationYear")}
                value={formatNumber(locale, profile.graduationYear)}
              />
              <Field label={t("grade")} value={profile.gradeValue} />
              <Field
                label={t("nationality")}
                value={
                  country
                    ? isArabic
                      ? country.nameAr
                      : country.name
                    : profile.nationality
                }
              />
            </dl>
          </section>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold text-[#1F2A44]">
              {t("preferences")}
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-[#5a6072]">
                  {t("fieldsOfStudy")}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {fieldLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-semibold text-[#1E3A8A]"
                    >
                      {label}
                    </span>
                  ))}
                </dd>
              </div>
              <Field
                label={t("budget")}
                value={t(`budgetBands.${profile.budgetBand}`)}
              />
              <Field
                label={t("intake")}
                value={`${tCatalog(`seasons.${profile.intakeSeason}`)} ${formatNumber(locale, profile.intakeYear)}`}
              />
              <Field
                label={t("english")}
                value={
                  profile.englishTest === "NONE"
                    ? t("englishNone")
                    : `${tCatalog(`englishTests.${profile.englishTest}`)}${
                        profile.englishScore != null
                          ? ` · ${formatNumber(locale, profile.englishScore)}`
                          : ""
                      }`
                }
              />
            </dl>
          </section>
        </>
      ) : (
        <section className="mt-4 rounded-xl bg-[#F5F8FF] px-6 py-14 text-center">
          <UserRound className="mx-auto size-8 text-[#98A0B4]" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-[#1F2A44]">
            {t("noProfileTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("noProfileBody")}
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
          >
            {t("completeProfile")}
          </Link>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string | null;
  ltr?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm font-semibold text-[#5a6072]">{label}</dt>
      <dd
        dir={ltr ? "ltr" : undefined}
        className="mt-1 break-words text-base font-semibold text-[#1F2A44]"
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
