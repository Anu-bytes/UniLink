import { FileText, Heart, Search, TrendingUp, UserRoundPen } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { FacultyCard } from "@/components/app/faculty-card";
import { UniversityLogo } from "@/components/university-logo";
import { getRecommendedFaculties } from "@/lib/faculty-search";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getApplications, getMatchProfile } from "@/lib/program-search";

export const dynamic = "force-dynamic";

export default async function AppHomePage() {
  const t = await getTranslations("AppHome");
  const tApplications = await getTranslations("Applications");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);
  const userId = session.user.id;

  const [savedCount, applications, recommended, profile] = await Promise.all([
    prisma.savedFaculty.count({ where: { userId } }),
    getApplications(locale, userId),
    getRecommendedFaculties(locale, userId, 4),
    getMatchProfile(userId),
  ]);

  const strongMatches = recommended.filter(
    (program) => (program.match?.score ?? 0) >= 75,
  ).length;

  const firstName = session.user.name?.split(" ")[0];

  const stats = [
    { icon: Heart, label: t("stats.saved"), value: savedCount, href: "/app/saved" },
    {
      icon: FileText,
      label: t("stats.applications"),
      value: applications.length,
      href: "/app/applications",
    },
    {
      icon: TrendingUp,
      label: t("stats.matches"),
      value: strongMatches,
      href: "/app/search",
    },
  ];

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
            {firstName
              ? t("greeting", { name: firstName })
              : t("greetingAnonymous")}
          </h1>
          <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>
        </div>
        <Link
          href="/app/search"
          className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
        >
          <Search className="size-4" aria-hidden />
          {t("startSearching")}
        </Link>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
              <stat.icon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-3xl font-bold text-[#1F2A44]">{stat.value}</p>
            <p className="mt-1 text-sm text-[#5a6072]">{stat.label}</p>
          </Link>
        ))}
      </div>

      {!profile ? (
        <section className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border-2 border-[#1E6DEB]/25 bg-[#F7F9FE] p-5">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white"
          >
            <UserRoundPen className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[#1F2A44]">{t("profileCardTitle")}</h2>
            <p className="mt-1 text-sm text-[#5a6072]">{t("profileCardBody")}</p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex min-h-11 items-center rounded-lg bg-[#1E6DEB] px-5 text-sm font-bold text-white hover:bg-[#1859c4]"
          >
            {t("profileCardCta")}
          </Link>
        </section>
      ) : null}

      {recommended.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#1F2A44]">
            {t("stats.matches")}
          </h2>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommended.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#1F2A44]">
            {t("recentApplications")}
          </h2>
          {applications.length > 0 ? (
            <Link
              href="/app/applications"
              className="text-sm font-semibold text-[#1E6DEB] hover:underline"
            >
              {t("seeAll")}
            </Link>
          ) : null}
        </div>

        {applications.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {applications.slice(0, 5).map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <UniversityLogo
                  name={application.program.university.name}
                  logoUrl={application.program.university.logoUrl}
                  className="size-9"
                  textClassName="text-xs"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1F2A44]">
                    {application.program.name}
                  </p>
                  <p className="truncate text-xs text-[#5a6072]">
                    {application.program.university.name} ·{" "}
                    {formatDate(locale, application.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#5a6072]">
                  {tApplications(`status.${application.status}`)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-[#F5F8FF] px-6 py-10 text-center text-sm text-[#5a6072]">
            {t("noApplications")}
          </p>
        )}
      </section>
    </div>
  );
}
