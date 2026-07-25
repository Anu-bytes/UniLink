import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FeaturedUniversities } from "@/components/featured-universities";
import { HeroStats } from "@/components/hero-stats";
import { HowItWorks } from "@/components/how-it-works";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/reveal";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getLandingCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const representIcons: LucideIcon[] = [
  BarChart3,
  Building2,
  Megaphone,
  Activity,
  LayoutDashboard,
  Users,
];

// Hero stat order maps into catalog.stats / counters.items:
// [scholarships(4), students(2), programs(1), universities(0)]
const heroStatOrder = [4, 2, 1, 0];

function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#1E6DEB] px-6 py-3 text-center text-base font-semibold leading-6 text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 motion-reduce:transform-none ${className}`}
    >
      {children}
    </Link>
  );
}

export default async function HomePage() {
  const t = await getTranslations("Home.landing");
  const tc = await getTranslations("Home.counters");
  const locale = await getLocale();
  const catalog = await getLandingCatalog(locale);

  const counterLabels = tc.raw("items") as string[];
  const heroValues = heroStatOrder.map((i) => catalog.stats[i] ?? 0);
  const heroLabels = heroStatOrder.map((i) => counterLabels[i] ?? "");

  const faqs = t.raw("faq.items") as { q: string; a?: string }[];
  const howSteps = t.raw("howItWorks.steps") as string[];
  const studentItems = t.raw("features.student.items") as string[];
  const representFeatures = t.raw("represent.features") as string[];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#2D3748]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FE] to-white">
        {/* decorative drifting blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <span className="ul-blob absolute -left-24 -top-24 size-72 rounded-full bg-[#1E6DEB]/10 blur-3xl" />
          <span className="ul-blob absolute -right-16 top-24 size-80 rounded-full bg-[#7AA5F5]/20 blur-3xl [animation-delay:-6s]" />
          <span className="ul-blob absolute bottom-0 left-1/3 size-64 rounded-full bg-[#B9D0FA]/25 blur-3xl [animation-delay:-10s]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <Reveal className="min-w-0 text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0FB] bg-white/80 px-4 py-1.5 text-[13px] font-semibold text-[#1E6DEB] shadow-sm backdrop-blur-sm">
                <span className="relative flex size-2.5">
                  <span className="ul-blink-warm inline-flex size-2.5 rounded-full bg-[#f82c1f]" />
                </span>
                {t("hero.badge")}
              </span>

              <h1 className="mt-4 text-[clamp(2rem,6vw,3rem)] font-bold leading-[1.15] text-[#16233F]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#4A5568] md:mt-5 md:text-[18px] md:leading-8 lg:mx-0">
                {t("hero.subtitle")}
              </p>

              <div className="mt-7">
                <HeroStats values={heroValues} labels={heroLabels} />
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/onboarding"
                  className="group inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#1E6DEB] to-[#3B86F7] px-8 py-4 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-14px_rgba(30,109,235,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 motion-reduce:transform-none sm:w-auto"
                >
                  <GraduationCap className="size-5 shrink-0" aria-hidden />
                  {t("hero.cta")}
                  <ArrowRight
                    className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </Reveal>

            <Reveal
              delay={120}
              className="flex min-w-0 items-center justify-center lg:justify-end"
            >
              <ImagePlaceholder
                w={560}
                h={460}
                className="ul-float-slow w-full max-w-[34rem] bg-slate-300/50 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)]"
                rounded="rounded-[28px]"
                label="Hero image 560×460"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED UNIVERSITIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <Reveal
            as="h2"
            className="text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#16233F]"
          >
            {t("partners.featuredTitle")}
          </Reveal>

          <div className="mt-10">
            {catalog.universities.length > 0 ? (
              <FeaturedUniversities
                universities={catalog.universities}
                allLabel={t("partners.allCities")}
                filterLabel={t("partners.filterLabel")}
                programsLabel={t("partners.programsLabel")}
                viewDetailsLabel={t("partners.viewDetails")}
              />
            ) : (
              <p className="rounded-2xl bg-[#F5F8FF] px-6 py-10 text-center text-base text-[#5a6072]">
                {t("partners.empty")}
              </p>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <PrimaryButton href="/universities">
              {t("partners.exploreMore")}
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Reveal as="div">
        <HowItWorks title={t("howItWorks.title")} steps={howSteps} />
      </Reveal>

      {/* TWO FEATURE CARDS */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="hover-lift flex h-full flex-col-reverse overflow-hidden rounded-2xl border border-[#E7EDF5] bg-white shadow-sm transition-colors hover:border-[#1E6DEB]/40 sm:flex-row">
              <div className="min-w-0 flex-1 p-6 md:p-8">
                <h3 className="text-[20px] font-bold leading-7 text-[#16233F] md:text-[22px]">
                  {t("features.student.title")}
                </h3>
                <ul className="mt-4 space-y-3">
                  {studentItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1E6DEB]">
                        <Check className="size-3 text-white" strokeWidth={3.5} />
                      </span>
                      <span className="text-sm leading-6 text-[#4A5568] md:text-[15px]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Photo column (left in RTL) */}
              <div className="relative min-h-[13rem] w-full shrink-0 bg-slate-100 sm:min-h-0 sm:w-[42%]">
                <Image
                  src="/images/why-student.jpg"
                  alt={t("features.student.title")}
                  fill
                  sizes="(max-width: 640px) 100vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <div className="hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7EDF5] bg-white shadow-sm transition-colors hover:border-[#1E6DEB]/40 sm:flex-row">
              {/* Photo column (right in RTL) — fills to the border like the student card */}
              <div className="relative min-h-[13rem] w-full shrink-0 sm:min-h-0 sm:w-[42%]">
                <Image
                  src="/images/decision-family.png"
                  alt={t("features.decision.title")}
                  fill
                  sizes="(max-width: 640px) 100vw, 22vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-6 md:p-8">
                <h3 className="text-[20px] font-bold leading-7 text-[#16233F] md:text-[22px]">
                  {t("features.decision.title")}
                </h3>
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-7 text-[#4A5568] md:text-[15px]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1E6DEB]" />
                  <span>{t("features.decision.body")}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REPRESENT A UNIVERSITY */}
      <section className="bg-[#EEF4FE]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal className="flex justify-center lg:justify-start">
              <ImagePlaceholder
                w={520}
                h={360}
                rounded="rounded-[24px]"
                className="w-full max-w-[32rem] bg-slate-300/50"
                label=""
              />
            </Reveal>

            <Reveal delay={100} className="min-w-0 text-center lg:text-start">
              <h2 className="text-[clamp(1.6rem,4.5vw,2.25rem)] font-bold leading-tight text-[#16233F]">
                {t("represent.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#4A5568] lg:mx-0">
                {t("represent.body")}
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                {representFeatures.map((feature, i) => {
                  const Icon = representIcons[i] ?? BarChart3;
                  return (
                    <li
                      key={feature}
                      className="group flex flex-col items-center gap-2 text-center lg:items-start lg:text-start"
                    >
                      <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#1E6DEB] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#1E6DEB] group-hover:text-white group-hover:shadow-md">
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-xs leading-5 text-[#2D3748] md:text-[13px]">
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex justify-center lg:justify-start">
                <PrimaryButton href="/partners" className="w-full sm:w-auto">
                  {t("represent.primaryCta")}
                </PrimaryButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ + TESTIMONIALS */}
      <section id="faq" className="bg-white scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[5fr_7fr] lg:gap-12">
          {/* FAQ */}
          <Reveal className="min-w-0">
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {t("faq.eyebrow")}
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,4.5vw,2.25rem)] font-bold leading-tight text-[#16233F]">
              {t("faq.title")}
            </h2>

            <div className="mt-6 space-y-3">
              {faqs.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group rounded-xl border border-[#E7EDF5] bg-white px-4 shadow-sm transition-colors hover:border-[#1E6DEB]/40 open:border-[#1E6DEB]/30 open:bg-[#F7FAFF]"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold leading-6 text-[#16233F] transition-colors hover:text-[#1E6DEB] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] md:text-base">
                    <span>{f.q}</span>
                    <ChevronDown
                      className="size-5 shrink-0 text-[#1E6DEB] transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  {f.a ? (
                    <p className="pb-4 text-sm leading-7 text-[#4A5568]">{f.a}</p>
                  ) : null}
                </details>
              ))}
            </div>
          </Reveal>

          {/* TESTIMONIALS */}
          <Reveal delay={100} className="min-w-0">
            <h2 className="text-center text-[clamp(1.6rem,4.5vw,2.25rem)] font-bold leading-tight text-[#16233F] lg:text-start">
              {t("testimonials.title")}
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#5a6072] md:text-base lg:text-start">
              {t("testimonials.subtitle")}
            </p>

            <div className="mt-6">
              {catalog.testimonials.length > 0 ? (
                <TestimonialsCarousel
                  testimonials={catalog.testimonials}
                  prevLabel={t("testimonials.prev")}
                  nextLabel={t("testimonials.next")}
                  maxPerPage={2}
                />
              ) : (
                <p className="rounded-2xl bg-[#F5F8FF] px-6 py-10 text-center text-base text-[#5a6072]">
                  {t("testimonials.subtitle")}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
