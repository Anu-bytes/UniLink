import Image from "next/image";
import {
  BookOpen,
  Check,
  Eye,
  GraduationCap,
  Landmark,
  Lightbulb,
  Rocket,
  Search,
  ShieldCheck,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";

/** Icon per value card, in the order the translated items are listed. */
const VALUE_ICONS: LucideIcon[] = [Search, Lightbulb, ShieldCheck, UserRound];

/** Icon per stat, in the order the translated items are listed. */
const STAT_ICONS: LucideIcon[] = [Landmark, BookOpen, Search, Rocket];

type ValueItem = { title: string; body: string };
type StatItem = { value: string; label: string };

export default async function AboutPage() {
  const t = await getTranslations("About");
  const studentItems = t.raw("offer.students.items") as string[];
  const universityItems = t.raw("offer.universities.items") as string[];
  const values = t.raw("values.items") as ValueItem[];
  const stats = t.raw("stats.items") as StatItem[];

  return (
    <div className="font-[family-name:var(--font-open-sans)] text-[#292E3E]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDF3FF] via-[#F5F9FF] to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-40 -top-44 size-[30rem] rounded-full bg-[#1E6DEB]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-24">
          {/* Copy column. Sits first in the DOM so it leads on mobile and,
              in RTL, renders on the start (right) side like the design. */}
          <Reveal className="max-w-[36rem]">
            <h1 className="text-[38px] font-bold leading-[1.15] text-[#16233F] sm:text-[52px]">
              {t("hero.title")}{" "}
              {/* Sized in em so the flag tracks the responsive heading, and
                  served as a plain img because next/image refuses to optimise
                  SVG without dangerouslyAllowSVG. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/flags/eg.svg"
                alt={t("hero.flagAlt")}
                width={900}
                height={600}
                className="inline-block h-[0.72em] w-auto rounded-[3px] align-baseline shadow-sm ring-1 ring-black/10"
              />
            </h1>
            <p className="mt-4 text-[19px] font-bold leading-8 text-[#1E6DEB] sm:text-[22px]">
              {t("hero.tagline")}
            </p>

            <p className="mt-6 text-[16px] leading-8 text-[#4a5163] sm:text-[17px]">
              {t("hero.intro")}
            </p>
            <p className="mt-5 text-[16px] font-bold leading-8 text-[#16233F] sm:text-[17px]">
              {t("hero.bridge")}
            </p>
            <p className="mt-4 text-[16px] leading-8 text-[#4a5163] sm:text-[17px]">
              {t("hero.body")}
            </p>

            <Link
              href="/universities"
              className="mt-9 inline-flex items-center justify-center rounded-[10px] bg-[#1E6DEB] px-8 py-3.5 text-[17px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(30,109,235,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 motion-reduce:transform-none"
            >
              {t("hero.cta")}
            </Link>
          </Reveal>

          {/* Image column. The photo is capped so it never outgrows the copy,
              and the soft disc + dot grid peek out from behind its start edge
              exactly like the mockup. */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[34rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute -start-10 -top-10 size-56 rounded-full bg-[#D8E6FF] lg:size-64"
              />
              <div
                aria-hidden
                className="ul-dots pointer-events-none absolute -start-6 -top-7 hidden size-28 sm:block"
              />
              <div className="relative overflow-hidden rounded-[26px] shadow-[0_30px_64px_-30px_rgba(15,23,42,0.5)] ring-1 ring-white/70">
                <Image
                  src="/images/decision-family-v2.png"
                  alt={t("hero.imageAlt")}
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 1024px) 90vw, 544px"
                  className="aspect-[6/5] w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VISION + MISSION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 pt-6 md:grid-cols-2 lg:pb-24 lg:pt-10">
          {(
            [
              { key: "vision", Icon: Eye },
              { key: "mission", Icon: Target },
            ] as const
          ).map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 100}>
              <div className="hover-lift h-full rounded-[22px] border border-[#E4EAF5] bg-white p-8 shadow-[0_20px_46px_-34px_rgba(15,23,42,0.4)] transition-colors hover:border-[#C9DCFB]">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[24px] font-bold text-[#1E6DEB]">
                    {t(`${key}.title`)}
                  </h2>
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
                    <Icon className="size-7" strokeWidth={1.8} />
                  </span>
                </div>
                <p className="mt-5 text-[16px] leading-8 text-[#4a5163]">
                  {t(`${key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-[#FAFBFE]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="text-center">
            <h2 className="text-[30px] font-bold text-[#16233F] sm:text-[38px]">
              {t("offer.title")}
            </h2>
            <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-[#1E6DEB]" />
          </Reveal>

          {/* The two photos sit on the outer edges of the row, mirroring each
              other the way the mockup does. */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <OfferCard
                title={t("offer.students.title")}
                Icon={GraduationCap}
                items={studentItems}
                image="/images/why-student.png"
                imageAlt={t("offer.students.imageAlt")}
                imagePosition="32% center"
                accent="#1E6DEB"
                surface="from-[#F1F6FF] to-white"
                border="border-[#DCE8FF]"
              />
            </Reveal>

            <Reveal delay={100} className="h-full">
              <OfferCard
                title={t("offer.universities.title")}
                Icon={Landmark}
                items={universityItems}
                image="/images/represent-platform.png"
                imageAlt={t("offer.universities.imageAlt")}
                imagePosition="44% center"
                accent="#17A398"
                surface="from-[#F0FAF8] to-white"
                border="border-[#CFEAE6]"
                photoOnEnd
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY UNILINK */}
      <section className="overflow-hidden bg-gradient-to-b from-[#EDF3FF] to-[#F7FAFF]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-20">
          <Reveal className="max-w-[34rem]">
            <h2 className="text-[28px] font-bold text-[#16233F] sm:text-[36px]">
              {t("why.title")}
            </h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-[#1E6DEB]" />
            <p className="mt-6 text-[16px] leading-8 text-[#4a5163] sm:text-[17px]">
              {t("why.body1")}
            </p>
            <p className="mt-4 text-[16px] leading-8 text-[#4a5163] sm:text-[17px]">
              {t("why.body2")}
            </p>
          </Reveal>

          {/* Capped and cropped to a landscape frame so it reads as a
              supporting visual, not a second hero. */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[26rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -end-6 size-40 rounded-full bg-[#D8E6FF]"
              />
              <div className="relative overflow-hidden rounded-[24px] shadow-[0_26px_56px_-30px_rgba(15,23,42,0.55)] ring-1 ring-white/70">
                <Image
                  src="/images/hero-booth-v2.png"
                  alt={t("why.imageAlt")}
                  width={580}
                  height={580}
                  sizes="(max-width: 1024px) 90vw, 416px"
                  className="aspect-[3/2] w-full object-cover object-[center_42%]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="text-center">
            <h2 className="text-[28px] font-bold text-[#16233F] sm:text-[36px]">
              {t("values.title")}
            </h2>
            <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-[#1E6DEB]" />
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Search;
              return (
                <Reveal
                  key={value.title}
                  delay={i * 90}
                  className="lg:border-s lg:border-[#E7EDF7] lg:ps-8 lg:first:border-s-0 lg:first:ps-0"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-[19px] font-bold text-[#16233F]">
                      {value.title}
                    </h3>
                    <Icon
                      className="size-[26px] shrink-0 text-[#1E6DEB]"
                      strokeWidth={1.7}
                    />
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#5a6072]">
                    {value.body}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative overflow-hidden bg-[#1B2A50]">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-28 size-80 rounded-full bg-white/[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -start-20 size-72 rounded-full bg-white/[0.06]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <Reveal className="text-center">
            <h2 className="text-[26px] font-bold text-white sm:text-[32px]">
              {t("stats.title")}
            </h2>
            <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-white/40" />
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i] ?? Landmark;
              // The last stat is a statement rather than a figure, so its
              // value sits a size down from the numeric ones.
              const isFigure = i < stats.length - 1;
              return (
                <Reveal
                  key={stat.label}
                  delay={i * 90}
                  className="text-center lg:border-s lg:border-white/15 lg:first:border-s-0"
                >
                  <Icon
                    className="mx-auto size-8 text-white/90"
                    strokeWidth={1.6}
                  />
                  <div
                    className={`mt-4 font-bold leading-none text-white ${
                      isFigure ? "text-[32px] tabular-nums" : "text-[22px]"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <p className="mx-auto mt-3 max-w-[14rem] text-[15px] leading-7 text-white/75">
                    {stat.label}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * One half of the "what we offer" row: a tinted card with a checklist of
 * benefits and a photo panel pinned to one side. `photoOnEnd` flips the panel
 * so the two cards mirror each other; on mobile it always becomes a banner
 * across the top.
 */
function OfferCard({
  title,
  Icon,
  items,
  image,
  imageAlt,
  imagePosition,
  accent,
  surface,
  border,
  photoOnEnd = false,
}: {
  title: string;
  Icon: LucideIcon;
  items: string[];
  image: string;
  imageAlt: string;
  /** CSS object-position, so the subject survives the tall crop. */
  imagePosition: string;
  accent: string;
  surface: string;
  border: string;
  photoOnEnd?: boolean;
}) {
  return (
    <div
      className={`hover-lift group flex h-full flex-col gap-6 rounded-[22px] border bg-gradient-to-b ${surface} ${border} p-6 sm:flex-row sm:items-stretch sm:gap-7 sm:p-7`}
    >
      <div
        className={`relative h-44 w-full shrink-0 overflow-hidden rounded-[16px] shadow-[0_18px_40px_-26px_rgba(15,23,42,0.6)] sm:h-auto sm:w-[9.5rem] sm:self-center sm:aspect-[3/4] lg:w-44 ${
          photoOnEnd ? "sm:order-last" : "sm:order-first"
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 90vw, 176px"
          style={{ objectPosition: imagePosition }}
          className="aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <Icon className="size-6" strokeWidth={1.8} />
          </span>
          <h3 className="text-[22px] font-bold" style={{ color: accent }}>
            {title}
          </h3>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accent}1A`, color: accent }}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="text-[16px] leading-7 text-[#4a5163]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
