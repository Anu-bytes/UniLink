import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Star, Clock, GraduationCap, Award, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getUniversityBySlug, getAllSlugs, summarize } from "@/lib/catalog";
import { getField } from "@/data/fields";
import { pick, formatFeeRange, formatNumber } from "@/lib/format";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Tag } from "@/components/ui/Chip";
import { ProfileActions } from "@/components/ProfileActions";
import { MapView } from "@/components/MapView";

export function generateStaticParams() {
  return getAllSlugs().flatMap((slug) => [
    { locale: "en", slug },
    { locale: "ar", slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const u = getUniversityBySlug(slug);
  if (!u) return { title: "Not found" };
  return { title: pick(u.name, locale), description: pick(u.bio, locale) };
}

export default async function UniversityProfile({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const m = getMessages(locale);
  const u = getUniversityBySlug(slug);
  if (!u) notFound();

  const initials = pick(u.name, "en")
    .split(" ")
    .filter((w) => !["the", "of", "in"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const facts = [
    { label: m.profile.established, value: formatNumber(u.established, locale) },
    {
      label: m.profile.type,
      value: u.nationalOrInternational === "international" ? m.common.international : m.common.national,
    },
    { label: m.profile.city, value: pick(u.city, locale) },
    { label: m.profile.fieldsOffered, value: formatNumber(new Set(u.faculties.map((f) => f.fieldOfStudy)).size, locale) },
  ];

  return (
    <article className="pb-4">
      {/* Cover */}
      <div className="h-36 bg-gradient-to-r from-brand-600 to-brand sm:h-48" />
      <div className="container-page">
        {/* Only the logo overlaps the cover; name + meta sit on white for contrast */}
        <div className="-mt-10 sm:-mt-12">
          <span className="flex size-24 items-center justify-center rounded-2xl border-4 border-surface bg-brand-50 font-head text-2xl font-bold text-brand-600 shadow-sm sm:size-28">
            {initials}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-head text-2xl font-bold text-ink sm:text-3xl">{pick(u.name, locale)}</h1>
              {u.isVerified && <VerifiedBadge label={m.common.verified} />}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" /> {pick(u.city, locale)}, {pick(u.governorate, locale)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-warning text-warning" /> {formatNumber(u.rating, locale)}
              </span>
            </p>
          </div>
          <ProfileActions />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div className="flex flex-col gap-8">
            <Section title={m.profile.overview}>
              <p className="text-sm leading-7 text-muted">{pick(u.bio, locale)}</p>
            </Section>

            <Section title={m.profile.faculties}>
              <div className="flex flex-col gap-4">
                {u.faculties.map((fac) => (
                  <div key={fac.id} className="rounded-card border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-head text-base font-semibold text-ink">{pick(fac.name, locale)}</h3>
                      <Tag>{pick(getField(fac.fieldOfStudy).name, locale)}</Tag>
                    </div>
                    {fac.accreditation?.length ? (
                      <p className="mt-1 text-xs text-muted">
                        {m.profile.accreditation}: {fac.accreditation.join(", ")}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-col divide-y divide-line">
                      {fac.departments.flatMap((dep) =>
                        dep.programs.map((p) => (
                          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-ink">{pick(p.name, locale)}</p>
                              <p className="text-xs text-muted">{pick(dep.name, locale)}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                              <span className="inline-flex items-center gap-1">
                                <GraduationCap className="size-3.5" />
                                {p.degreeType === "postgraduate" ? m.common.postgraduate : m.common.undergraduate}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {formatNumber(p.durationYears, locale)} {m.common.years}
                              </span>
                              <span className="font-medium text-ink">
                                {formatFeeRange(p.minFees, p.maxFees, locale)}
                              </span>
                            </div>
                          </div>
                        )),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title={m.profile.location}>
              <div className="h-72 overflow-hidden rounded-card border border-line">
                <MapView points={[summarize(u)]} fitToPoints />
              </div>
              <p className="mt-2 text-sm text-muted">{pick(u.address, locale)}</p>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-card border border-line bg-surface p-5">
              <h3 className="mb-3 font-head text-base font-semibold text-ink">{m.profile.quickFacts}</h3>
              <dl className="flex flex-col gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <dt className="text-muted">{f.label}</dt>
                    <dd className="font-medium text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {u.accreditation.length > 0 && (
              <div className="rounded-card border border-line bg-surface p-5">
                <h3 className="mb-3 flex items-center gap-2 font-head text-base font-semibold text-ink">
                  <Award className="size-4 text-brand" /> {m.profile.accreditation}
                </h3>
                <ul className="flex flex-col gap-2">
                  {u.accreditation.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle2 className="size-4 text-success" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-head text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
