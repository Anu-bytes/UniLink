import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptySection, SectionHeading } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";

export async function TabLocation({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");

  const hasContact =
    university.addressLine || university.phone || university.email;
  const hasCoordinates =
    university.latitude != null && university.longitude != null;

  if (!hasContact && !hasCoordinates) {
    return <EmptySection message={t("emptySection")} />;
  }

  const contacts = [
    university.phone
      ? { icon: Phone, label: t("location.phone"), value: university.phone, href: `tel:${university.phone}` }
      : null,
    university.addressLine
      ? { icon: MapPin, label: t("location.address"), value: university.addressLine, href: null }
      : null,
    university.email
      ? { icon: Mail, label: t("location.email"), value: university.email, href: `mailto:${university.email}` }
      : null,
  ].filter((entry): entry is NonNullable<typeof entry> => entry != null);

  // OpenStreetMap's embed needs no API key, so the map works out of the box.
  const delta = 0.01;
  const bbox = hasCoordinates
    ? [
        university.longitude! - delta,
        university.latitude! - delta,
        university.longitude! + delta,
        university.latitude! + delta,
      ].join(",")
    : null;

  return (
    <div>
      <SectionHeading title={t("location.heading")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-1">
          {contacts.map((contact) => (
            <li
              key={contact.label}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
                <contact.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F2A44]">
                  {contact.label}
                </p>
                {contact.href ? (
                  <a
                    href={contact.href}
                    dir="ltr"
                    className="mt-1 block text-sm text-[#5a6072] hover:text-[#1E6DEB]"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-[#5a6072]">{contact.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-2">
          {bbox ? (
            <>
              <iframe
                title={t("location.mapAlt")}
                loading="lazy"
                className="h-80 w-full rounded-2xl border border-slate-200 md:h-96"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${university.latitude},${university.longitude}`}
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${university.latitude},${university.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E6DEB] hover:underline"
              >
                {t("location.openInMaps")}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </>
          ) : (
            <EmptySection message={t("location.noCoordinates")} />
          )}
        </div>
      </div>
    </div>
  );
}
