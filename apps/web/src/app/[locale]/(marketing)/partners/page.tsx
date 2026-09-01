import {
  ArrowRight,
  Building2,
  LayoutDashboard,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EnrollmentDevices } from "@/components/partners/enrollment-devices";
import { PartnerLogosSlider } from "@/components/partners/partner-logos-slider";
import { Reveal } from "@/components/reveal";

const cardIcons = [TrendingUp, LayoutDashboard, UserCheck, Building2];

export default async function PartnersPage() {
  const t = await getTranslations("Partners.landing");

  const cards = t.raw("whyChoose.cards") as { title: string; body: string }[];
  const steps = t.raw("howItWorks.steps") as {
    number: string;
    tab: string;
    heading: string;
    description: string;
  }[];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F9FE] to-white">
        <div
          aria-hidden
          className="ul-dots pointer-events-none absolute -inset-8 opacity-10"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-start">
              <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.15] text-[#16233F]">
                {t("hero.titleLead")}{" "}
                <span className="text-[#F82C1F]">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#4A5568] md:text-lg lg:mx-0">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#F82C1F] px-8 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(248,44,31,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C81F15]"
                >
                  {t("hero.cta")}
                  <ArrowRight
                    className="size-5 rtl:rotate-180"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>

            <EnrollmentDevices />
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS: no real partner logos yet, so every tile is an
          explicit "Soon" placeholder rather than a real (or fabricated)
          university name/logo. Swap PartnerLogosSlider for real logos once
          partners are signed. */}
      <section className="bg-white py-8 md:py-10">
        <div className="flex items-center justify-center gap-2">
          <span className="ul-blink-warm inline-flex size-2 rounded-full bg-[#F82C1F]" />
          <h2 className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-[#16233F]">
            {t("logosTitle")}
          </h2>
        </div>
        <div className="mt-6">
          <PartnerLogosSlider label={t("logosComingSoon")} />
        </div>
      </section>

      {/* WHY UNIVERSITIES CHOOSE UNILINK */}
      <section className="bg-[#F7F9FE]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <h2 className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-[#16233F]">
            {t("whyChoose.title")}
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => {
              const Icon = cardIcons[i] ?? TrendingUp;
              // Alternates blue/red per card, matching the site's brand mix
              // rather than an all-blue grid.
              const isRed = i % 2 === 1;
              return (
                <div
                  key={card.title}
                  className={`hover-lift flex flex-col items-center rounded-2xl border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isRed
                      ? "border-[#E7EDF5] hover:border-[#F82C1F]/40"
                      : "border-[#E7EDF5] hover:border-[#1E6DEB]/40"
                  }`}
                >
                  <span
                    className={`flex size-14 items-center justify-center rounded-2xl ${
                      isRed
                        ? "bg-[#FFF0EE] text-[#F82C1F]"
                        : "bg-[#EEF3FF] text-[#1E6DEB]"
                    }`}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[17px] font-bold leading-6 text-[#16233F]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5a6072]">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-center text-base leading-8 text-[#4A5568]">
            {t("whyChoose.summary")}
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#1E6DEB] px-8 text-[17px] font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4]"
            >
              {t("whyChoose.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* HOW YOUR PARTNERSHIP WORKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <h2 className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-[#16233F]">
            {t("howItWorks.title")}
          </h2>

          <div className="mt-8 space-y-8 md:space-y-10">
            {steps.map((step, i) => {
              // Alternates every other step: which side the number badge
              // sits on, and its color (blue/red, so the list doesn't read
              // as one long blue block). `order` respects the page's actual
              // direction (flips correctly under RTL on its own), unlike
              // forcing `direction` per-step which would fight the locale's
              // real text direction.
              const alt = i % 2 === 1;
              return (
                <Reveal
                  key={step.number}
                  delay={i * 120}
                  className="hover-lift group grid items-center gap-6 rounded-2xl border border-[#E7EDF5] bg-white p-5 shadow-sm transition-colors duration-300 hover:border-[#1E6DEB]/30 md:grid-cols-[auto_1fr] md:gap-8 md:p-6"
                >
                  <div className="flex justify-center md:contents">
                    <span
                      className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 sm:size-20 sm:text-3xl ${
                        alt ? "md:order-2" : "md:order-1"
                      } ${
                        alt
                          ? "bg-gradient-to-br from-[#F82C1F] to-[#ff6b5b]"
                          : "bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7]"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div className={alt ? "md:order-1" : "md:order-2"}>
                    <span
                      className={`text-[13px] font-bold uppercase tracking-widest ${
                        alt ? "text-[#F82C1F]" : "text-[#1E6DEB]"
                      }`}
                    >
                      {step.tab}
                    </span>
                    <h3 className="mt-1.5 text-[19px] font-bold leading-tight text-[#16233F] sm:text-[22px]">
                      {step.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#5a6072] sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
          {/* A photo overlapping the card's top edge needs to live outside
              the card's own overflow-hidden (which clips the decorative
              rings to its rounded corners), so it's a sibling positioned
              absolutely against this shared wrapper instead of a child of
              the card. */}
          <div className="relative">
            {/* Cut out against a transparent background, so it renders
                directly (no box/border) and just floats over the card with
                a drop-shadow for depth, rather than sitting in a bordered
                placeholder tile. Sits above the card on md+; the card gets
                left padding to make room for it. */}
            <div className="absolute -top-10 start-8 z-20 hidden w-44 md:block lg:w-56">
              <Image
                src="/images/partner-photo.png"
                alt=""
                width={400}
                height={500}
                priority
                className="h-auto w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1E6DEB] to-[#1657c9] px-6 py-10 sm:px-10 sm:py-12 md:py-14 md:ps-64 lg:ps-80">
              {/* Decorative concentric rings, clipped to the card. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -start-24 top-1/2 hidden -translate-y-1/2 md:block"
              >
                <div className="flex size-[22rem] items-center justify-center rounded-full border-[3rem] border-white/10">
                  <div className="size-40 rounded-full border-[2rem] border-white/10" />
                </div>
              </div>

              {/* Mobile: the photo sits inline above the text instead of
                  overlapping (the absolute version above is hidden below
                  md), since there's no card edge to overlap when everything
                  stacks. */}
              <div className="mb-6 flex justify-center md:hidden">
                <Image
                  src="/images/partner-photo.png"
                  alt=""
                  width={400}
                  height={500}
                  priority
                  className="h-auto w-32 object-contain drop-shadow-2xl"
                />
              </div>

              <div className="relative z-10 mx-auto max-w-xl text-center sm:mx-0 sm:text-start">
                <h2 className="text-[26px] font-bold leading-tight text-white sm:text-[30px]">
                  {t("band.title")}
                </h2>
                <div className="mt-6 flex justify-center sm:justify-start">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-bold text-[#1E6DEB] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    {t("band.cta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
