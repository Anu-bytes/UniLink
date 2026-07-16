import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { StepsSlider, type Step } from "@/components/steps-slider";

export default async function StudentsPage() {
  const t = await getTranslations("Students.landing");

  const rawSteps = t.raw("steps") as {
    tab: string;
    heading: string;
    description: string;
    bullets: string[];
    cta: string;
  }[];
  const stepHrefs = ["/onboarding", "/programs", "/onboarding"];
  const steps: Step[] = rawSteps.map((s, i) => ({
    tab: s.tab,
    heading: s.heading,
    description: s.description,
    bullets: s.bullets,
    cta: { label: s.cta, href: stepHrefs[i] ?? "/onboarding" },
  }));

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-6 pb-10">
          <div className="grid items-center gap-10 rounded-[40px] bg-[#EEF3FF] px-8 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-10">
            <div className="text-center lg:text-start">
              <h1 className="text-[36px] font-bold leading-tight text-[#363B51] sm:text-[50px]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[20px] leading-8 text-[#292E3E] lg:mx-0">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/onboarding"
                  className="inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-7 text-[18px] font-semibold text-white transition-colors hover:bg-[#1859c4]"
                >
                  {t("hero.cta")}
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <ImagePlaceholder
                w={482}
                h={471}
                className="bg-slate-300/50"
                rounded="rounded-none rounded-bl-[100px]"
                label="Hero image 482×471"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS SLIDER */}
      <StepsSlider
        title={t("stepsTitle")}
        steps={steps}
        stepLabel={t("stepLabel")}
      />

      {/* CTA BAND */}
      <section className="bg-[#1E6DEB]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-[28px] font-bold text-white sm:text-[36px]">
            {t("band.title")}
          </h2>
          <Link
            href="/onboarding"
            className="inline-flex h-14 items-center justify-center rounded-[8px] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-colors hover:bg-white/90"
          >
            {t("band.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
