import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { UniversityDetailData } from "@/lib/catalog";
import { EmptySection, Paragraphs } from "@/components/university/prose";

export async function TabAbout({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");
  const body = university.aboutRich ?? university.description;

  if (!body && university.features.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div className="space-y-10">
      {body ? (
        <section>
          <h2 className="text-center text-xl font-bold text-[#1F2A44] md:text-2xl">
            {t("aboutHeading", { name: university.name })}
          </h2>
          <div className="mx-auto mt-6 max-w-4xl">
            <Paragraphs text={body} />
          </div>
        </section>
      ) : null}

      {university.features.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
            {t("featuresHeading", { name: university.name })}
          </h2>
          <ul className="mt-6 space-y-4">
            {university.features.map((feature) => (
              <li key={feature.id} className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-[#1E6DEB]"
                  aria-hidden
                />
                <p className="text-base leading-8 text-[#5a6072]">
                  <strong className="font-bold text-[#1F2A44]">
                    {feature.title}
                  </strong>
                  {feature.body ? `: ${feature.body}` : null}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
