import {
  Activity,
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

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { FeaturedUniversities } from "@/components/featured-universities";
import { HeroStats } from "@/components/hero-stats";
import { HeroSearch } from "@/components/hero-search";
import { HeroWords } from "@/components/hero-words";
import { HowItWorks } from "@/components/how-it-works";
import { MotionSection } from "@/components/motion-section";
import { Reveal } from "@/components/reveal";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { UniversityLogoMarquee } from "@/components/university-logo-marquee";
import { getLandingCatalog, getUniversitySearchIndex, withDisplayOffsets } from "@/lib/catalog";

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
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);
  const [catalog, searchIndex] = await Promise.all([
    getLandingCatalog(locale),
    getUniversitySearchIndex(locale),
  ]);

  const heroWords = t.raw("hero.words") as string[];
  const counterLabels = tc.raw("items") as string[];
  const displayStats = withDisplayOffsets(catalog.stats);
  const heroValues = heroStatOrder.map((i) => displayStats[i] ?? 0);
  const heroLabels = heroStatOrder.map((i) => counterLabels[i] ?? "");

  const faqs = t.raw("faq.items") as { q: string; a?: string }[];
  const howSteps = t.raw("howItWorks.steps") as string[];
  const studentItems = t.raw("features.student.items") as string[];
  const representFeatures = t.raw("represent.features") as string[];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#2D3748]">
      {/* HERO. Desktop: the graduate photo fills the section and a white veil
          keeps the copy side clean (the copy stays on that side in Arabic too:
          mirroring the photo would reverse its lettering). Phones: copy first,
          then the photo cropped around the graduate. Each block rises in
          softly, one after another (--i). */}
      <MotionSection className="relative isolate overflow-hidden bg-gradient-to-b from-[#EEF4FD] to-white lg:bg-white">
        {/* Brand glows behind the copy: UniLink blue and red, echoing the
            blue bar and red triangle in the photo. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <span className="ul-drift absolute -left-28 -top-24 size-[26rem] rounded-full bg-[#1E6DEB]/[0.16] blur-3xl [animation-duration:22s]" />
          <span className="ul-drift absolute left-[24%] top-[18%] size-72 rounded-full bg-[#F82C1F]/[0.13] blur-3xl [animation-delay:-8s] [animation-duration:26s]" />
          <span className="ul-drift absolute bottom-[-5rem] left-[6%] size-72 rounded-full bg-[#1E6DEB]/[0.12] blur-3xl [animation-delay:-14s] [animation-duration:30s]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl items-start px-4 pt-5 md:px-6 md:pt-7 lg:min-h-[min(38rem,calc(100svh-5rem))] lg:pb-12 lg:pt-11">
          <div className="mx-auto w-full max-w-[38rem] text-center lg:ml-0 lg:mr-auto lg:max-w-[40rem] lg:text-start">
            <span
              className="ul-hero-rise inline-flex rounded-full border border-[#CFE0FB] shadow-sm"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[#1E3A8A] sm:px-3.5 sm:text-[13px]">
                <span className="size-1.5 shrink-0 rounded-full bg-[#F82C1F]" />
                <GraduationCap className="hidden size-4 text-[#1E6DEB] sm:block" aria-hidden />
                {t("hero.badge")}
              </span>
            </span>

            <div className="mt-5">
              <HeroWords words={heroWords} />
            </div>

            <h1
              className="ul-hero-rise mt-3 text-[clamp(1.45rem,2.8vw,2.2rem)] font-bold leading-tight text-[#16233F]"
              style={{ "--i": 6 } as React.CSSProperties}
            >
              {t("hero.journeyTitle")}
            </h1>
            <p
              className="ul-hero-rise mx-auto mt-3 max-w-xl text-base leading-7 text-[#4A5568] md:text-[17px] lg:mx-0"
              style={{ "--i": 7 } as React.CSSProperties}
            >
              {t("hero.journeySubtitle")}
            </p>

            <div
              className="ul-hero-rise relative z-20 mt-7 text-start"
              style={{ "--i": 8 } as React.CSSProperties}
            >
              <HeroSearch isAuthenticated={isAuthenticated} />
            </div>

            <div
              className="ul-hero-rise mt-8 rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-start shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-md sm:px-6"
              style={{ "--i": 9 } as React.CSSProperties}
            >
              <HeroStats values={heroValues} labels={heroLabels} variant="inline" />
            </div>
          </div>
        </div>

        {/* Phones/tablets: a photo block under the copy. Desktop: the backdrop. */}
        <div className="relative mt-8 h-80 sm:h-[26rem] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <Image
            src="/images/hero-graduate.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[74%_center] lg:object-[68%_center] xl:object-[60%_center]"
          />
          {/* Phones: fade the photo in from the copy above. */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F5F8FE] to-transparent lg:hidden" />
          {/* Desktop: a white veil over the copy side (physical left in both
              directions, matching where the photo is already pale). */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden w-[64%] bg-gradient-to-r from-[#F2F7FF] from-30% via-[#F2F7FF]/75 to-transparent lg:block"
          />
          {/* Soft hand-off into the logo strip below. */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white" />
        </div>
      </MotionSection>

      {/* LOGO STRIP: every university with a logo, each linking to its profile */}
      <UniversityLogoMarquee
        universities={searchIndex}
        title={t("logoStrip.title", { count: searchIndex.length })}
        viewLabel={(name) => t("logoStrip.viewProfile", { name })}
      />


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
            {isAuthenticated ? (
              <PrimaryButton href="/universities">
                {t("partners.knowMore")}
              </PrimaryButton>
            ) : (
              <PrimaryButton href="/universities">
                {t("partners.exploreMore")}
              </PrimaryButton>
            )}
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
                  // Same no-op-for-layout fix as HeroPhotoCarousel: `fill`
                  // renders without width/height attributes, which trips
                  // the "explicit dimensions" audit once this scrolls into
                  // view and lazy-loads. position:absolute means its own
                  // aspect-ratio never affects the actual box size here.
                  className="aspect-[16/10] object-cover"
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
                  className="aspect-[16/10] object-cover"
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
                    className="aspect-[520/360] object-cover"
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
                      className="ul-spotlight flex items-center gap-3 rounded-2xl bg-white/90 p-3 text-start shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
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
