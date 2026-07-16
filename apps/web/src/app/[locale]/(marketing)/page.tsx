import { ChevronDown, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { StatsCounters } from "@/components/stats-counters";

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
      className={`inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-7 text-[18px] font-semibold text-white transition-colors hover:bg-[#1859c4] ${className}`}
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
        <div className="mx-auto max-w-6xl px-6 pt-6 pb-10">
          <div className="grid items-center gap-10 rounded-[40px] bg-[#EEF3FF] px-8 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-10">
            <div className="text-center lg:text-start">
              <h1 className="text-[36px] font-bold leading-tight text-[#363B51] sm:text-[50px]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#1E6DEB]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[20px] leading-8 text-[#292E3E] lg:mx-0">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <PrimaryButton href="/onboarding">
                  {t("hero.cta")}
                </PrimaryButton>
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

      {/* FASTEST & EASIEST + STATS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mx-auto max-w-3xl text-balance text-center text-[32px] font-bold leading-tight text-[#363B51] sm:text-[40px]">
            {t("fastest.title")}
          </h2>

          <div className="mt-14">
            <StatsCounters />
          </div>

          <p className="mx-auto mt-14 max-w-2xl text-center text-[18px] leading-8 text-[#292E3E]">
            {t("fastest.body")}
          </p>

          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/onboarding">{t("fastest.cta")}</PrimaryButton>
          </div>

          <div className="mt-16 flex justify-center">
            <ImagePlaceholder w={895} h={499} label="Feature image 895×499" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#F5F8FF]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
            {t("testimonials.title")}
          </h2>
          <p className="mt-3 text-center text-[18px] text-[#292E3E]">
            {t("testimonials.subtitle")}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((tst) => (
              <figure
                key={tst.name}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-sm"
              >
                <blockquote className="text-[18px] leading-8 text-[#292E3E]">
                  {tst.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <ImagePlaceholder w={48} h={48} rounded="rounded-full" label="" />
                  <span className="text-[16px] font-semibold text-[#363B51]">
                    {tst.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
            {t("partners.eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-center text-[32px] font-bold leading-tight text-[#363B51] sm:text-[40px]">
            {t("partners.title")}
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {countries.map((c, i) => (
              <button
                key={c}
                className={`pb-1 text-[18px] font-semibold transition-colors ${
                  i === 1
                    ? "border-b-2 border-[#1E6DEB] text-[#1E6DEB]"
                    : "text-[#292E3E] hover:text-[#1E6DEB]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((inst) => (
              <div
                key={inst.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
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
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/universities"
              className="inline-flex h-14 items-center justify-center rounded-[8px] border border-[#0064E1] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5"
            >
              {t("partners.exploreMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS CTA BAND */}
      <section className="bg-[#1E6DEB]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-[28px] font-bold text-white sm:text-[36px]">
            {t("programsBand.title")}
          </h2>
          <Link
            href="/programs"
            className="inline-flex h-14 items-center justify-center rounded-[8px] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-colors hover:bg-white/90"
          >
            {t("programsBand.cta")}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="text-center text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
            {t("faq.eyebrow")}
          </p>
          <h2 className="mt-3 text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
            {t("faq.title")}
          </h2>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[18px] font-semibold text-[#363B51]">
                  {f.q}
                  <ChevronDown className="size-5 text-[#1E6DEB] transition-transform group-open:rotate-180" />
                </summary>
                {f.a ? (
                  <p className="mt-3 text-[16px] leading-7 text-[#292E3E]">
                    {f.a}
                  </p>
                ) : null}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* GET STARTED */}
      <section className="bg-[#F5F8FF]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
            {t("getStarted.title")}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {getStartedCards.map((card, i) => (
              <div
                key={card.title}
                className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm"
              >
                <ImagePlaceholder w={120} h={120} rounded="rounded-2xl" label="icon" />
                <h3 className="mt-6 text-[22px] font-bold text-[#363B51]">
                  {card.title}
                </h3>
                <div className="mt-6">
                  <PrimaryButton
                    href={getStartedHrefs[i] ?? "/onboarding"}
                    className="px-6"
                  >
                    {card.cta}
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
