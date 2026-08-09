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
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FeaturedUniversities } from "@/components/featured-universities";
import { HeroStats } from "@/components/hero-stats";
import { HowItWorks } from "@/components/how-it-works";
import { MotionSection } from "@/components/motion-section";
import { Reveal } from "@/components/reveal";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getLandingCatalog } from "@/lib/catalog";
import { getPrimaryCta } from "@/lib/primary-cta";

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
// [universities(0), programs(1), students(2), scholarships(4)]
const heroStatOrder = [0, 1, 2, 4];

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
  const primaryCta = await getPrimaryCta(t("hero.cta"));

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
      <MotionSection className="ul-mesh relative isolate overflow-hidden">
        {/* decorative backdrop: a single soft blob behind the image + dot grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="ul-drift absolute -right-24 -top-16 size-80 rounded-full bg-[#F5A623]/18 blur-3xl [animation-delay:-7s] [animation-duration:21s]" />
          <span className="ul-dots absolute -inset-8" />
          {/* soft hand-off into the white section below */}
          <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <Reveal className="min-w-0 text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0FB] bg-white/90 px-4 py-1.5 text-[13px] font-semibold text-[#1E6DEB] shadow-sm">
                <span className="relative flex size-2.5">
                  <span className="ul-blink-warm inline-flex size-2.5 rounded-full bg-[#f82c1f]" />
                </span>
                {t("hero.badge")}
              </span>

              <h1 className="mt-4 text-[clamp(2rem,6vw,3rem)] font-bold leading-[1.15] text-[#16233F]">
                {t("hero.titleLead")}{" "}
                <span className="ul-text-shine text-[#1E6DEB]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#4A5568] md:mt-5 md:text-[18px] md:leading-8 lg:mx-0">
                {t("hero.subtitle")}
              </p>

              <div className="mt-7">
                <HeroStats values={heroValues} labels={heroLabels} />
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href={primaryCta.href}
                  className="group relative inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#1E6DEB] to-[#3B86F7] px-8 py-4 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-14px_rgba(30,109,235,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 motion-reduce:transform-none sm:w-auto"
                >
                  {/* pulse ring, outside the clip so it can scale past the edge */}
                  <span
                    aria-hidden
                    className="ul-cta-ring pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#3B86F7]"
                  />
                  {/* shine passing over the button, clipped to its own layer */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                  >
                    <span className="ul-sheen absolute inset-y-0 -left-1/4 w-1/4 bg-gradient-to-r from-transparent via-white/35 to-transparent [animation-duration:6s]" />
                  </span>
                  <Search className="size-5 shrink-0" aria-hidden />
                  {/* The hero keeps its own wording in both states; only the
                      destination changes, to registration or straight to
                      search once the student has an account. */}
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
              <div className="ul-float-slow relative w-full max-w-[33rem] px-4 pb-6 pt-2">
                {/* layered gradient accent behind the photo for depth */}
                <div
                  aria-hidden
                  className="absolute inset-x-2 inset-y-4 -z-10 rotate-[4deg] rounded-[40px] bg-gradient-to-br from-[#1E6DEB]/40 via-[#3B86F7]/22 to-[#F5A623]/25 blur-[2px]"
                />
                {/* dotted pattern accent */}
                <div
                  aria-hidden
                  className="absolute -top-2 end-0 -z-10 hidden size-28 rounded-full bg-[radial-gradient(rgba(30,109,235,0.28)_1.5px,transparent_1.5px)] [background-size:12px_12px] lg:block"
                />

                {/* white card mount around the photo */}
                <div className="relative rounded-[30px] bg-white p-2.5 shadow-[0_40px_80px_-32px_rgba(15,23,42,0.5)] ring-1 ring-black/5">
                  {/* halo turning behind the card */}
                  <div
                    aria-hidden
                    className="ul-ring-glow pointer-events-none absolute -inset-4 -z-10 rounded-[44px] opacity-70 blur-2xl"
                  />
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-slate-100">
                    <Image
                      src="/images/hero-booth-v2.png"
                      alt="UniLink"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33rem"
                      className="object-cover"
                      priority
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C1A34]/25 via-transparent to-transparent"
                    />
                    {/* light sweeping across the card */}
                    <span
                      aria-hidden
                      className="ul-sheen pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                    />
                  </div>
                </div>

                {/* rating badge */}
                <div className="absolute -bottom-1 start-0 flex items-center gap-2.5 rounded-2xl border border-black/5 bg-white px-3.5 py-2.5 shadow-xl">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-md">
                    <GraduationCap className="size-5" aria-hidden />
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-[#F5A623] text-[#F5A623]"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </MotionSection>

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
                  src="/images/why-student.png"
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
                  src="/images/decision-family-v2.png"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF2FE] to-[#F7FAFF]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[32rem]">
                {/* decorative frame behind the photo, offset off the corner and
                    gently floating on its own */}
                <div
                  aria-hidden
                  className="ul-float-slow absolute inset-0 translate-x-5 translate-y-5 rounded-[26px] border-[3px] border-[#1E6DEB]/45 bg-[#1E6DEB]/5 rtl:-translate-x-5"
                />
                {/* static framed photo */}
                <div className="relative z-10 aspect-[520/360] overflow-hidden rounded-[24px] bg-white shadow-[0_30px_70px_-34px_rgba(15,23,42,0.5)] ring-1 ring-black/5">
                  <Image
                    src="/images/represent-platform.png"
                    alt={t("represent.title")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 32rem"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="min-w-0 text-center lg:text-start">
              <h2 className="text-[clamp(1.6rem,4.5vw,2.25rem)] font-bold leading-tight text-[#16233F]">
                {t("represent.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#4A5568] lg:mx-0">
                {t("represent.body")}
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {representFeatures.map((feature, i) => {
                  const Icon = representIcons[i] ?? BarChart3;
                  return (
                    <li
                      key={feature}
                      className="flex items-center gap-3 rounded-2xl bg-white/90 p-3 text-start shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1E6DEB]/10 text-[#1E6DEB]">
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-[13px] font-semibold leading-5 text-[#2D3748]">
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
