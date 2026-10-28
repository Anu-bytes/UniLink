import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { NearbyPreview, previewItems } from "@/components/nearby/nearby-art";
import { NearbyLauncher } from "@/components/nearby/nearby-launcher";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import type { NearbyCatalog } from "@/lib/nearby";

export type NearbyAccess = "member" | "guest" | "guestUsed";

/** The homepage feature block for "Find nearest", with its launch button. */
export async function NearbySection({ catalog, access }: { catalog: NearbyCatalog; access: NearbyAccess }) {
  const t = await getTranslations("Nearby");
  const { items, origin } = previewItems(catalog.universities);
  const km = (value: number) => t("km", { value: value < 10 ? value.toFixed(1) : Math.round(value) });
  const points = [t("section.point1"), t("section.point2"), t("section.point3")];

  return (
    <section id="find-nearest" className="border-y border-slate-100 bg-[#F8FAFC] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal>
          <p className="text-sm font-semibold text-[#1E6DEB]">{t("section.eyebrow")}</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-slate-900">
            {t("section.title")}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">{t("section.subtitle")}</p>

          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] leading-6 text-slate-700">
                <Check className="mt-1 size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <NearbyLauncher
              fields={catalog.fields}
              levels={catalog.levels}
              variant="cta"
              guest={access !== "member"}
              notice={access === "member" ? undefined : access === "guest" ? t("access.guest") : t("access.guestUsed")}
            />
            <p className="text-sm text-slate-500">
              {access === "member" ? (
                t("access.member")
              ) : (
                <>
                  {access === "guest" ? t("access.guest") : t("access.guestUsed")}{" "}
                  <Link href="/signup" className="font-semibold text-[#1E6DEB] hover:underline">
                    {t("access.signup")}
                  </Link>
                </>
              )}
            </p>
          </div>
        </Reveal>

        <Reveal>
          {items.length ? (
            <figure>
              <NearbyPreview
                items={items}
                origin={origin}
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
              <figcaption className="mt-3 text-center text-xs text-slate-400">{t("preview.caption")}</figcaption>
            </figure>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
