import { ChevronDown, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { StatsCounters } from "@/components/stats-counters";
import { Reveal } from "@/components/reveal";
import { PartnerCountryTabs } from "@/components/partner-country-tabs";

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
      className={`inline-flex min-h-12 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-5 py-3 text-center text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] hover:shadow-[0_16px_30px_-14px_rgba(30,109,235,0.95)] active:translate-y-0 sm:min-h-14 sm:px-7 sm:text-[18px] motion-reduce:transform-none ${className}`}
    >
      {children}
    </Link>
  );
}

export default async function HomePage() {
  const t = await getTranslations("Home.landing");

  const testimonials = t.raw("testimonials.items") as {
    quote: string;
    name: string;
  }[];
  const countries = t.raw("partners.countries") as string[];
  const institutions = t.raw("partners.institutions") as {
    name: string;
    location: string;
  }[];
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
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
          <div className="grid min-w-0 items-center gap-8 overflow-hidden rounded-[24px] bg-[#EEF3FF] px-5 py-8 sm:gap-10 sm:rounded-[40px] sm:px-12 sm:py-12 lg:grid-cols-2 lg:px-16 lg:py-10">
            <Reveal className="min-w-0 text-center lg:text-start">
              <h1 className="text-[32px] font-bold leading-tight text-[#363B51] sm:text-[50px]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#292E3E] sm:mt-6 sm:text-[20px] sm:leading-8 lg:mx-0">
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
              className="flex min-w-0 items-center justify-center lg:justify-end"
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal
            as="h2"
            className="mx-auto max-w-3xl text-balance text-center text-[28px] font-bold leading-tight text-[#363B51] sm:text-[40px]"
          >
            {t("fastest.title")}
          </Reveal>

          <div className="mt-14">
            <StatsCounters />
          </div>

          <Reveal>
            <p className="mx-auto mt-14 max-w-2xl text-center text-[18px] leading-8 text-[#292E3E]">
              {t("fastest.body")}
            </p>

            <div className="mt-8 flex justify-center">
              <PrimaryButton href="/onboarding">
                {t("fastest.cta")}
              </PrimaryButton>
            </div>
          </Reveal>

          <Reveal className="mt-16 flex justify-center">
            <ImagePlaceholder w={895} h={499} label="Feature image 895×499" />
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#F5F8FF]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
              {t("testimonials.title")}
            </h2>
            <p className="mt-3 text-center text-[18px] text-[#292E3E]">
              {t("testimonials.subtitle")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((tst, i) => (
              <Reveal key={tst.name} delay={i * 90}>
                <figure className="hover-lift flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm">
                  <blockquote className="text-[18px] leading-8 text-[#292E3E]">
                    {tst.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-6">
                    <ImagePlaceholder
                      w={48}
                      h={48}
                      rounded="rounded-full"
                      label=""
                    />
                    <span className="text-[16px] font-semibold text-[#363B51]">
                      {tst.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {t("partners.eyebrow")}
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-center text-[32px] font-bold leading-tight text-[#363B51] sm:text-[40px]">
              {t("partners.title")}
            </h2>
          </Reveal>

          <div className="mt-10">
            <PartnerCountryTabs countries={countries} />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((inst, i) => (
              <Reveal key={inst.name} delay={(i % 3) * 90}>
                <div className="hover-lift h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <ImagePlaceholder
                    w={338}
                    h={226}
                    rounded="rounded-none"
                    className="w-full"
                    label="Institution 338×226"
                  />
                  <div className="p-6">
                    <h3 className="text-[20px] font-bold text-[#363B51]">
                      {inst.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-[15px] text-[#5a6072]">
                      <MapPin className="size-4 text-[#1E6DEB]" />
                      {inst.location}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/universities"
              className="inline-flex h-14 items-center justify-center rounded-[8px] border border-[#0064E1] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E6DEB]/5 active:translate-y-0 motion-reduce:transform-none"
            >
              {t("partners.exploreMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS CTA BAND */}
      <section className="bg-[#1E6DEB]">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-[28px] font-bold text-white sm:text-[36px]">
            {t("programsBand.title")}
          </h2>
          <Link
            href="/programs"
            className="inline-flex h-14 items-center justify-center rounded-[8px] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 active:translate-y-0 motion-reduce:transform-none"
          >
            {t("programsBand.cta")}
          </Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {t("faq.eyebrow")}
            </p>
            <h2 className="mt-3 text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
              {t("faq.title")}
            </h2>
          </Reveal>

          <Reveal className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[18px] font-semibold text-[#363B51] transition-colors hover:text-[#1E6DEB]">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-[#1E6DEB] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                {f.a ? (
                  <p className="mt-3 text-[16px] leading-7 text-[#292E3E]">
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
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal
            as="h2"
            className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]"
          >
            {t("getStarted.title")}
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {getStartedCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="hover-lift flex h-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm">
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
