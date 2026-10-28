import { Check, Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { NearbyPreview, previewItems } from "@/components/nearby/nearby-art";
import { Link } from "@/i18n/navigation";
import type { NearbyCatalog } from "@/lib/nearby";

/** Shown to a guest whose one free "Find nearest" search is used up. */
export async function NearbyGate({ catalog, callbackUrl }: { catalog: NearbyCatalog; callbackUrl: string }) {
  const t = await getTranslations("Nearby");
  const perks = t.raw("gate.perks") as string[];
  const { items, origin } = previewItems(catalog.universities);
  const km = (value: number) => t("km", { value: value < 10 ? value.toFixed(1) : Math.round(value) });

  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.06)]">
            <Lock className="size-[18px]" aria-hidden />
          </span>
          <h1 className="mt-5 text-[clamp(1.6rem,3.2vw,2.25rem)] font-semibold leading-tight tracking-tight text-slate-900">
            {t("gate.title")}
          </h1>
          <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">{t("gate.subtitle")}</p>

          <ul className="mt-6 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-[15px] leading-6 text-slate-700">
                <Check className="mt-1 size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.1)] transition-colors hover:bg-[#1857C4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              {t("gate.signup")}
            </Link>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-[15px] font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              {t("gate.login")}
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t("gate.free")}</p>
        </div>

        {items.length ? (
          <div className="relative">
            <NearbyPreview
              items={items}
              origin={origin}
              className="pointer-events-none select-none opacity-60 blur-[2px]"
              labels={{
                from: t("preview.from"),
                field: t("controls.anyField"),
                distance: t("controls.anyDistance"),
                count: t("list.count", { count: items.length }),
                context: t("preview.context"),
                you: t("map.you"),
                nearest: t("card.nearest"),
                km,
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
