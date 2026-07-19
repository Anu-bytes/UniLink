import { ChevronDown } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FeaturedUniversities } from "@/components/featured-universities";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { StatsCounters } from "@/components/stats-counters";
import { Reveal } from "@/components/reveal";
import { getLandingCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

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
      className={`inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-[8px] bg-[#1E6DEB] px-5 py-3 text-center text-base font-semibold leading-6 text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] hover:shadow-[0_16px_30px_-14px_rgba(30,109,235,0.95)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 md:min-h-14 md:w-auto md:px-7 md:text-[18px] motion-reduce:transform-none ${className}`}
    >
      {children}
    </Link>
  );
}

export default async function HomePage() {
  const t = await getTranslations("Home.landing");
  const locale = await getLocale();
  const catalog = await getLandingCatalog(locale);

  const faqs = t.raw("faq.items") as { q: string; a?: string }[];
  const getStartedCards = t.raw("getStarted.cards") as {
    title: string;
    cta: string;
  }[];
  const getStartedHrefs = ["/onboarding", "/partners", "/partners"];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 md:px-6 md:pb-10 md:pt-6">
          <div className="grid min-w-0 items-center gap-8 overflow-hidden rounded-[24px] bg-[#EEF3FF] px-5 py-8 md:gap-10 md:rounded-[40px] md:px-12 md:py-12 lg:grid-cols-2 lg:px-16 lg:py-10">
            <Reveal className="min-w-0 text-center lg:text-start">
              <h1 className="text-[clamp(2rem,7vw,3.125rem)] font-bold leading-[1.12] text-[#363B51]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#292E3E] md:mt-6 md:text-[20px] md:leading-8 lg:mx-0">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <PrimaryButton href="/onboarding">
                  {t("hero.cta")}
                </PrimaryButton>
              </div>
            </Reveal>
            <Reveal
              delay={120}
              className="flex min-w-0 items-center justify-center lg:justify-end [&>*]:max-w-[26rem] lg:[&>*]:max-w-[30.125rem]"
            >
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

      {/* FASTEST & EASIEST + STATS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <Reveal
            as="h2"
            className="mx-auto max-w-3xl text-balance text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#363B51]"
          >
            {t("fastest.title")}
          </Reveal>

          <div className="mt-10 md:mt-14">
            <StatsCounters values={catalog.stats} />
          </div>

          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-7 text-[#292E3E] md:mt-14 md:text-[18px] md:leading-8">
              {t("fastest.body")}
            </p>

            <div className="mt-8 flex justify-center">
              <PrimaryButton href="/onboarding">
                {t("fastest.cta")}
              </PrimaryButton>
            </div>
          </Reveal>

          <Reveal className="mt-12 flex justify-center md:mt-16">
            <ImagePlaceholder w={895} h={499} label="Feature image 895×499" />
          </Reveal>
        </div>
      </section>

      {catalog.testimonials.length > 0 ? (
        <section className="bg-[#F5F8FF]">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <Reveal>
              <h2 className="text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#363B51]">
                {t("testimonials.title")}
              </h2>
              <p className="mt-3 text-center text-base leading-7 text-[#292E3E] md:text-[18px]">
                {t("testimonials.subtitle")}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8">
              {catalog.testimonials.map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={i * 90}>
                  <figure className="hover-lift flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm md:p-8">
                    <blockquote className="text-base leading-7 text-[#292E3E] md:text-[18px] md:leading-8">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 pt-6">
                      <ImagePlaceholder
                        w={48}
                        h={48}
                        rounded="rounded-full"
                        label=""
                      />
                      <span className="text-[16px] font-semibold text-[#363B51]">
                        {testimonial.studentName}
                        {testimonial.location
                          ? `, ${testimonial.location}`
                          : ""}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* TRUSTED PARTNERS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {t("partners.eyebrow")}
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#363B51]">
              {t("partners.title")}
            </h2>
          </Reveal>

          <div className="mt-10">
            {catalog.universities.length > 0 ? (
              <FeaturedUniversities
                universities={catalog.universities}
                allLabel={t("partners.allCities")}
                filterLabel={t("partners.filterLabel")}
              />
            ) : (
              <p className="rounded-2xl bg-[#F5F8FF] px-6 py-10 text-center text-base text-[#5a6072]">
                {t("partners.empty")}
              </p>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/universities"
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-[8px] border border-[#0064E1] bg-white px-5 py-3 text-center text-base font-semibold leading-6 text-[#1E6DEB] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E6DEB]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 md:min-h-14 md:w-auto md:px-7 md:text-[18px] motion-reduce:transform-none"
            >
              {t("partners.exploreMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS CTA BAND */}
      <section className="bg-[#1E6DEB]">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center md:px-6 md:py-16">
          <h2 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold leading-tight text-white">
            {t("programsBand.title")}
          </h2>
          <Link
            href="/programs"
            className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-[8px] bg-white px-5 py-3 text-center text-base font-semibold leading-6 text-[#1E6DEB] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 md:min-h-14 md:w-auto md:px-7 md:text-[18px] motion-reduce:transform-none"
          >
            {t("programsBand.cta")}
          </Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {t("faq.eyebrow")}
            </p>
            <h2 className="mt-3 text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#363B51]">
              {t("faq.title")}
            </h2>
          </Reveal>

          <Reveal className="mt-10 divide-y divide-slate-200 border-y border-slate-200 md:mt-12">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-3 md:py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold leading-6 text-[#363B51] transition-colors hover:text-[#1E6DEB] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] md:text-[18px]">
                  <span>{f.q}</span>
                  <ChevronDown className="size-5 shrink-0 text-[#1E6DEB] transition-transform duration-300 group-open:rotate-180" aria-hidden />
                </summary>
                {f.a ? (
                  <p className="mt-2 pb-2 text-base leading-7 text-[#292E3E] md:mt-3">
                    {f.a}
                  </p>
                ) : null}
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* GET STARTED */}
      <section className="bg-[#F5F8FF]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <Reveal
            as="h2"
            className="text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#363B51]"
          >
            {t("getStarted.title")}
          </Reveal>

          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {getStartedCards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 90}
                className={
                  i === getStartedCards.length - 1
                    ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc(50%-1rem)] lg:col-span-1 lg:max-w-none"
                    : undefined
                }
              >
                <div className="hover-lift flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm md:p-8">
                  <ImagePlaceholder
                    w={120}
                    h={120}
                    rounded="rounded-2xl"
                    label="icon"
                  />
                  <h3 className="mt-6 text-[22px] font-bold text-[#363B51]">
                    {card.title}
                  </h3>
                  {/* mt-auto pins the CTA to the card bottom so buttons stay
                      aligned across cards even when a title wraps. */}
                  <div className="mt-auto pt-6">
                    <PrimaryButton
                      href={getStartedHrefs[i] ?? "/onboarding"}
                      className="px-6"
                    >
                      {card.cta}
                    </PrimaryButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
