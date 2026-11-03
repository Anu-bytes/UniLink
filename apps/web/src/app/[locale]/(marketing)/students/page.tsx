import { ArrowRight, Banknote, Heart, MapPin, Search, Target } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { StepsSlider, type Step } from "@/components/steps-slider";
import { getLandingCatalog, withDisplayOffsets } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { getPrimaryCta } from "@/lib/primary-cta";

// Real screenshots for the 3 steps, in order: Sign Up, Search Programs,
// Apply. Dimensions are the actual cropped file sizes (see the images in
// public/images) — next/image needs them to reserve layout space.
const STEP_IMAGES: ({ src: string; width: number; height: number } | null)[] = [
  { src: "/images/signup-step-preview.png", width: 1040, height: 801 },
  { src: "/images/search-step-preview.png", width: 1040, height: 561 },
  { src: "/images/applications-step-preview.png", width: 1040, height: 454 },
];

// Icons for the "Why UniLink" cards, in the order of Students.landing.why.items.
const WHY_ICONS = [Banknote, Target, MapPin, Heart];

// The hero numbers, as indexes into catalog.stats / Home.counters.items:
// universities, programs, students, governorates covered.
const STAT_ORDER = [0, 1, 2, 3];

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

  // Same figures as the homepage hero, so the two pages never disagree.
  const tc = await getTranslations("Home.counters");
  const counterLabels = tc.raw("items") as string[];
  const displayStats = withDisplayOffsets(catalog.stats);
  // A zero ("0+ scholarships") reads as empty, so it is left out, as on the homepage.
  const stats = STAT_ORDER.filter((i) => (displayStats[i] ?? 0) > 0).map((i) => ({
    label: counterLabels[i] ?? "",
    value: `${formatNumber(locale, displayStats[i] ?? 0)}+`,
  }));
  const whyItems = t.raw("why.items") as { title: string; body: string }[];

  const rawSteps = t.raw("steps") as {
    tab: string;
    heading: string;
    description: string;
    bullets: string[];
    cta: string;
  }[];
  const stepHrefs = ["/onboarding", "/programs", "/onboarding"];
  // Applications aren't built yet (same "Coming Soon" the in-app sidebar
  // already shows for that nav item) — the step still belongs in the story
  // of how the product works, just badged rather than hidden or, worse,
  // promising something that isn't there yet.
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
    comingSoon: i === 2,
    image: STEP_IMAGES[i]
      ? { ...STEP_IMAGES[i]!, alt: s.heading }
      : undefined,
  }));

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO: the message first, then the photo full width (it is a wide
          group shot, so text over it would cover faces), with the live
          catalogue numbers resting on its bottom edge. */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="ul-dots pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.06]" />
        <Reveal className="relative mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 md:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0FB] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#1E6DEB] shadow-sm">
            <span className="ul-blink-warm inline-flex size-2.5 rounded-full bg-[#F5A524]" />
            {t("hero.badge")}
          </span>
          <h1 className="mt-5 text-[clamp(2.1rem,5.2vw,3.5rem)] font-bold leading-[1.15] text-[#16233F]">
            {t("hero.titleLead")}{" "}
            <span className="text-[#1E6DEB]">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4A5568] md:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={heroCta.href}
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1E6DEB] px-8 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] sm:w-auto"
            >
              {heroCta.label}
              <ArrowRight
                className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/universities"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-[17px] font-bold text-[#16233F] transition-colors duration-200 hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB] sm:w-auto"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative mx-auto mt-10 max-w-6xl px-4 pb-14 sm:px-6 md:mt-14 md:pb-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(22,35,63,0.45)] sm:aspect-[16/8] md:rounded-[36px] lg:aspect-[1983/793]">
            <Image
              src="/images/students-hero.webp"
              alt={t("hero.photoAlt")}
              fill
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover object-[50%_35%]"
              priority
            />
          </div>
          <dl className="relative mx-3 -mt-10 grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-20px_rgba(22,35,63,0.35)] ring-1 ring-slate-200/70 sm:mx-10 md:-mt-12 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 py-5 text-center md:py-6 ${index % 2 === 1 ? "border-s border-slate-100" : ""} ${index > 1 ? "border-t border-slate-100 md:border-t-0" : ""} ${index === 2 ? "md:border-s" : ""}`}
              >
                <dd className="text-2xl font-bold text-[#16233F] md:text-3xl">{stat.value}</dd>
                <dt className="mt-1 text-sm font-semibold text-[#5a6072]">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* WHY: the features a student actually gets, each one live today. */}
      <section className="bg-[#F8FAFC] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-[#1E6DEB]">{t("why.eyebrow")}</p>
            <h2 className="mt-2 text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-tight text-[#16233F]">
              {t("why.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4A5568]">{t("why.subtitle")}</p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, index) => {
              const Icon = WHY_ICONS[index] ?? Search;
              return (
                <Reveal as="li" key={item.title} delay={index * 90}>
                  <div className="hover-lift h-full rounded-2xl border border-[#E7EDF5] bg-white p-6 shadow-sm transition-colors duration-300 hover:border-[#1E6DEB]/30">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]">
                      <Icon className="size-[22px]" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-bold leading-snug text-[#16233F]">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#4A5568]">{item.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3 STEPS SLIDER */}
      <StepsSlider
        title={t("stepsTitle")}
        steps={steps}
        stepLabel={t("stepLabel")}
        comingSoonLabel={t("comingSoon")}
      />

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E6DEB] to-[#12224A]">
        <div
          aria-hidden
          className="ul-dots pointer-events-none absolute -inset-8 opacity-20"
        />
        <Reveal
          as="div"
          className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:py-14"
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
