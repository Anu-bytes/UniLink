import { Gift, Infinity as InfinityIcon, Lock, MapPinned, Ruler, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { NearbyArt } from "@/components/nearby/nearby-art";
import { NearbyLauncher } from "@/components/nearby/nearby-launcher";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import type { NearbyField } from "@/lib/nearby";
import type { NearbyLevel } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

export type NearbyAccess = "member" | "guest" | "guestUsed";

/** The homepage feature block for "Find nearest", with its launch button. */
export async function NearbySection({
  fields,
  levels,
  access,
}: {
  fields: NearbyField[];
  levels: NearbyLevel[];
  access: NearbyAccess;
}) {
  const t = await getTranslations("Nearby");

  const points = [
    { icon: SlidersHorizontal, title: t("section.point1Title"), text: t("section.point1") },
    { icon: Ruler, title: t("section.point2Title"), text: t("section.point2") },
    { icon: ShieldCheck, title: t("section.point3Title"), text: t("section.point3") },
  ];

  const accessNote = {
    member: { icon: InfinityIcon, text: t("access.member"), tone: "bg-[#E7F6EE] text-[#0F7B45]" },
    guest: { icon: Gift, text: t("access.guest"), tone: "bg-[#EEF4FF] text-[#1E4FB8]" },
    guestUsed: { icon: Lock, text: t("access.guestUsed"), tone: "bg-[#FFF0EE] text-[#C81F15]" },
  }[access];

  return (
    <section id="find-nearest" className="relative overflow-hidden py-16 md:py-24">
      <div aria-hidden className="pointer-events-none absolute -start-40 top-10 size-[420px] rounded-full bg-[#1E6DEB]/[0.06] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -end-32 bottom-0 size-[360px] rounded-full bg-[#F82C1F]/[0.05] blur-3xl" />

      <div className="relative mx-auto grid max-w-[88rem] items-center gap-10 px-4 md:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-8">
        <Reveal>
          <div className="text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0FB] bg-white px-3 py-1 text-xs font-bold text-[#1E4FB8]">
              <span className="rounded-full bg-[#F82C1F] px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wider text-white">
                {t("section.new")}
              </span>
              {t("eyebrow")}
            </span>
            <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold leading-[1.15] tracking-tight text-[#16233F]">
              {t("section.titleLead")}{" "}
              <span className="bg-gradient-to-r from-[#1E6DEB] to-[#F82C1F] bg-clip-text text-transparent rtl:bg-gradient-to-l">
                {t("section.titleHighlight")}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#5a6072] lg:mx-0 md:text-lg">{t("section.subtitle")}</p>

            <ul className="mx-auto mt-7 grid max-w-xl gap-4 text-start sm:grid-cols-3 lg:mx-0 lg:grid-cols-1 xl:grid-cols-3">
              {points.map((point) => (
                <li key={point.title} className="flex gap-3 xl:flex-col xl:gap-2">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1E6DEB]">
                    <point.icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-[#16233F]">{point.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-5 text-[#5a6072]">{point.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <NearbyLauncher
                fields={fields}
                levels={levels}
                variant="cta"
                guest={access !== "member"}
                notice={access === "member" ? undefined : accessNote.text}
              />
              <p className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", accessNote.tone)}>
                <accessNote.icon className="size-3.5" aria-hidden />
                {accessNote.text}
                {access !== "member" ? (
                  <Link href="/signup" className="ms-1 underline underline-offset-2 hover:no-underline">
                    {t("access.signup")}
                  </Link>
                ) : null}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-[#1E6DEB]/15 via-transparent to-[#F82C1F]/15 blur-md" />
            <NearbyArt
              youLabel={t("map.you")}
              distanceLabel={t("km", { value: "3.2" })}
              foundLabel={t("art.found")}
              nearestLabel={t("art.nearest")}
              className="shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)]"
            />
            <span className="absolute -top-3 start-6 inline-flex items-center gap-1.5 rounded-full bg-[#16233F] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <MapPinned className="size-3.5 text-[#7FB0FF]" aria-hidden />
              {t("section.live")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
