import Image from "next/image";
import {
  Award,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";

/** Icon + accent colour per service card, matched to the translated items. */
const SERVICES: { icon: LucideIcon; color: string }[] = [
  { icon: Building2, color: "#1E6DEB" },
  { icon: BookOpen, color: "#17A398" },
  { icon: ClipboardCheck, color: "#F0852E" },
  { icon: Wallet, color: "#A945D6" },
  { icon: Award, color: "#F5245F" },
  { icon: RefreshCw, color: "#0063e7" },
];

export default async function AboutPage() {
  const t = await getTranslations("About");
  const services = t.raw("services.items") as { title: string; body: string }[];
  const faqs = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF] via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-[#1E6DEB]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -end-24 size-80 rounded-full bg-[#F82C1F]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-[#1E6DEB] shadow-sm ring-1 ring-[#1E6DEB]/15">
              <Image
                src="/flags/eg.svg"
                alt=""
                width={20}
                height={14}
                className="rounded-[2px]"
              />
              {t("eyebrow")}
            </span>

            <h1 className="mt-5 text-[36px] font-bold leading-tight text-[#363B51] sm:text-[48px]">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-8 text-[#292E3E]">
              {t("lead")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-7 text-[18px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] active:translate-y-0 motion-reduce:transform-none"
              >
                {t("cta.primary")}
              </Link>
              <Link
                href="/universities"
                className="inline-flex h-14 items-center justify-center rounded-[8px] border border-[#0064E1] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E6DEB]/5 active:translate-y-0 motion-reduce:transform-none"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </Reveal>

          {/* Visual collage. The two tinted tiles are ready-made slots — drop
              real campus/student photos in to replace them. */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="ul-float flex aspect-square items-center justify-center rounded-3xl bg-white p-6 shadow-[0_24px_60px_-20px_rgba(30,109,235,0.45)] ring-1 ring-[#1E6DEB]/10">
                  <Image
                    src="/logo/unilink-logo-mark.png"
                    alt="UniLink"
                    width={229}
                    height={259}
                    className="h-20 w-auto object-contain"
                  />
                </div>

                <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                  <Building2 className="size-7" />
                  <span className="px-2 text-center text-xs font-medium">
                    {t("photos.campus")}
                  </span>
                </div>

                <div className="col-span-2 flex h-40 flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-[#EEF3FF] to-[#dbe6fb] text-[#1E6DEB]/70">
                  <GraduationCap className="size-8" />
                  <span className="px-2 text-center text-xs font-medium">
                    {t("photos.students")}
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-5 -end-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.3)]">
                <Image
                  src="/flags/eg.svg"
                  alt=""
                  width={26}
                  height={18}
                  className="rounded-[2px]"
                />
                <span className="text-sm font-bold text-[#363B51]">
                  {t("badge")}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#1E6DEB]/10 text-[#1E6DEB]">
            <Sparkles className="size-6" />
          </span>
          <h2 className="mt-5 text-[28px] font-bold text-[#363B51] sm:text-[34px]">
            {t("mission.title")}
          </h2>
          <p className="mt-4 text-[18px] leading-8 text-[#292E3E]">
            {t("mission.body")}
          </p>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section className="bg-[#F5F8FF]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
              {t("services.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[18px] text-[#292E3E]">
              {t("services.subtitle")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const { icon: Icon, color } = SERVICES[i] ?? SERVICES[0];
              return (
                <Reveal key={service.title} delay={(i % 3) * 90}>
                  <div className="hover-lift h-full rounded-2xl bg-white p-7 shadow-sm">
                    <span
                      className="flex size-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="size-6 text-white" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 text-[20px] font-bold text-[#363B51]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-[16px] leading-7 text-[#5a6072]">
                      {service.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Q&A */}
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

          <Reveal className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 transition-colors open:border-[#1E6DEB]/30 open:bg-[#F5F8FF] hover:border-[#1E6DEB]/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-[#363B51]">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-[#1E6DEB] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[16px] leading-7 text-[#292E3E]">
                  {f.a}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E6DEB]">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="text-[28px] font-bold text-white sm:text-[36px]">
            {t("cta.title")}
          </h2>
          <p className="max-w-xl text-[18px] leading-8 text-white/90">
            {t("cta.body")}
          </p>
          <Link
            href="/onboarding"
            className="inline-flex h-14 items-center justify-center rounded-[8px] bg-white px-7 text-[18px] font-semibold text-[#1E6DEB] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 active:translate-y-0 motion-reduce:transform-none"
          >
            {t("cta.primary")}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
