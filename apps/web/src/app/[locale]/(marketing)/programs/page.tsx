import { Banknote, BookOpen, Clock, GraduationCap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { SimplePageHero } from "@/components/simple-page-hero";
import { getPublishedPrograms } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const t = await getTranslations("Programs");
  const locale = await getLocale();
  const programs = await getPublishedPrograms(locale);

  return (
    <>
      <SimplePageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {programs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
              >
                <p className="text-sm font-semibold text-[#1E6DEB]">
                  {program.universityName}
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#363B51]">
                  {program.name}
                </h2>
                <dl className="mt-5 space-y-3 text-sm text-[#5a6072]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-[#1E6DEB]" />
                    <dt className="sr-only">{t("levelLabel")}</dt>
                    <dd>{t(`levels.${program.studyLevel}`)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-[#1E6DEB]" />
                    <dt className="sr-only">{t("fieldLabel")}</dt>
                    <dd>{program.fieldOfStudy}</dd>
                  </div>
                  {program.durationMonths ? (
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-[#1E6DEB]" />
                      <dt className="sr-only">{t("durationLabel")}</dt>
                      <dd>
                        {t("durationMonths", {
                          count: program.durationMonths,
                        })}
                      </dd>
                    </div>
                  ) : null}
                  {program.tuitionFee ? (
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4 text-[#1E6DEB]" />
                      <dt className="sr-only">{t("tuitionLabel")}</dt>
                      <dd>
                        {new Intl.NumberFormat(locale, {
                          style: "currency",
                          currency: program.currency,
                          maximumFractionDigits: 0,
                        }).format(Number(program.tuitionFee))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#F5F8FF] px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-[#363B51]">
              {t("emptyTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#5a6072]">
              {t("emptyBody")}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
