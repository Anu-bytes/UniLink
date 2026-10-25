import { ArrowRight, Check, Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { NearbyArt } from "@/components/nearby/nearby-art";
import { Link } from "@/i18n/navigation";

/** Shown to a guest whose one free "Find nearest" search is used up. */
export async function NearbyGate({ callbackUrl }: { callbackUrl: string }) {
  const t = await getTranslations("Nearby");
  const perks = t.raw("gate.perks") as string[];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F6F9FF] to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <NearbyArt
            youLabel={t("map.you")}
            distanceLabel={t("km", { value: "3.2" })}
            foundLabel={t("art.found")}
            nearestLabel={t("art.nearest")}
            className="blur-[1.5px] saturate-[0.85]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#1E6DEB] shadow-[0_20px_40px_-18px_rgba(15,23,42,0.6)] ring-1 ring-black/5">
              <Lock className="size-7" aria-hidden />
            </span>
          </div>
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EE] px-3 py-1 text-xs font-bold text-[#C81F15]">
            {t("gate.badge")}
          </span>
          <h1 className="mt-4 text-[clamp(1.6rem,3.6vw,2.4rem)] font-extrabold leading-tight tracking-tight text-[#16233F]">
            {t("gate.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-[#5a6072] lg:mx-0">{t("gate.subtitle")}</p>

          <ul className="mx-auto mt-6 max-w-md space-y-2.5 text-start lg:mx-0">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-[15px] text-[#1F2A44]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E7F6EE] text-[#0F7B45]">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/signup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6DEB] to-[#2F7BF5] px-7 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(30,109,235,0.95)] transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] sm:w-auto rtl:bg-gradient-to-l"
            >
              {t("gate.signup")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 text-[15px] font-bold text-[#1F2A44] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB] sm:w-auto"
            >
              {t("gate.login")}
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#98A0B4]">{t("gate.free")}</p>
        </div>
      </div>
    </section>
  );
}
