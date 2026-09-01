import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/reveal";
import { StepsSlider, type Step } from "@/components/steps-slider";
import { getLandingCatalog } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { getPrimaryCta } from "@/lib/primary-cta";

export default async function StudentsPage() {
  const t = await getTranslations("Students.landing");
  const locale = await getLocale();
  const heroCta = await getPrimaryCta(t("hero.cta"));
  const bandCta = await getPrimaryCta(t("band.cta"));

  // The "Search" step used to advertise a hardcoded, badly outdated count
  // ("150,000+ programs across 1,500+ universities worldwide", copied from
  // a study-abroad template, not this platform). Pulling the live catalog
  // count instead means it's always accurate and never needs a manual
  // update again.
  const catalog = await getLandingCatalog(locale);
  const [universityCount, programCount] = catalog.stats;

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
    description:
      i === 1
        ? t("steps.1.description", {
            programs: formatNumber(locale, programCount),
            universities: formatNumber(locale, universityCount),
          })
        : s.description,
    bullets: s.bullets,
    cta: { label: s.cta, href: stepHrefs[i] ?? "/onboarding" },
  }));

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
          <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[40px] bg-[#EEF3FF] px-6 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="ul-dots pointer-events-none absolute -inset-8 -z-10 opacity-30"
            />
            <Reveal className="text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0FB] bg-white/90 px-4 py-1.5 text-[13px] font-semibold text-[#1E6DEB] shadow-sm">
                <span className="ul-blink-warm inline-flex size-2.5 rounded-full bg-[#f82c1f]" />
                {t("hero.badge")}
              </span>
              <h1 className="mt-4 text-[clamp(2rem,5vw,3.125rem)] font-bold leading-[1.15] text-[#16233F]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#4A5568] md:text-lg lg:mx-0">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href={heroCta.href}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#1E6DEB] px-8 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4]"
                >
                  {heroCta.label}
                  <ArrowRight
                    className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120} className="flex items-center justify-center lg:justify-end">
              <ImagePlaceholder
                w={482}
                h={471}
                className="bg-slate-300/50"
                rounded="rounded-none rounded-bl-[100px]"
                label="Hero image 482×471"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 STEPS SLIDER */}
      <StepsSlider title={t("stepsTitle")} steps={steps} stepLabel={t("stepLabel")} />

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E6DEB] to-[#12224A]">
        <div
          aria-hidden
          className="ul-dots pointer-events-none absolute -inset-8 opacity-20"
        />
        <Reveal
          as="div"
          className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-20"
        >
          <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white">
            {t("band.title")}
          </h2>
          <Link
            href={bandCta.href}
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-[17px] font-bold text-[#1E6DEB] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
          >
            {bandCta.label}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
