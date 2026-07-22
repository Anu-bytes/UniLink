import { BookOpen, ExternalLink, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { SimplePageHero } from "@/components/simple-page-hero";
import { getPublishedUniversities } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage() {
  const t = await getTranslations("Universities");
  const locale = await getLocale();
  const universities = await getPublishedUniversities(locale);

  return (
    <>
      <SimplePageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {universities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <article
                key={university.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {university.coverImageUrl ? (
                  <div
                    role="img"
                    aria-label={university.name}
                    className="aspect-[338/226] w-full bg-slate-200 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
                    }}
                  />
                ) : (
                  <ImagePlaceholder
                    w={420}
                    h={260}
                    className="max-w-none"
                    rounded="rounded-none"
                    label=""
                  />
                )}
                <div className="p-5 md:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1E6DEB]">
                    {t(`types.${university.type}`)}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#363B51]">
                    {university.name}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#5a6072]">
                    <MapPin className="size-4 shrink-0 text-[#1E6DEB]" />
                    {university.city}, {university.country}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#5a6072]">
                    <BookOpen className="size-4 shrink-0 text-[#1E6DEB]" />
                    {t("programCount", { count: university.programCount })}
                  </p>
                  {university.description ? (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#5a6072]">
                      {university.description}
                    </p>
                  ) : null}
                  {university.websiteUrl ? (
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#1E6DEB] px-4 py-2 text-sm font-semibold text-[#1E6DEB] hover:bg-[#1E6DEB]/5"
                    >
                      {t("visitWebsite")}
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                </div>
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
