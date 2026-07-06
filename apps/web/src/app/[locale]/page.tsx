import { MapPin, Search, GitCompareArrows, Send, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { totals, featured } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { SearchBar } from "@/components/SearchBar";
import { FieldChips } from "@/components/FieldChips";
import { UniversityCard } from "@/components/UniversityCard";
import { LocaleLink } from "@/components/LocaleLink";
import { buttonClasses } from "@/components/ui/Button";

export default async function LandingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = getMessages(locale);
  const t = totals();
  const list = featured(6);

  const stats = [
    { value: t.universities, label: m.stats.universities },
    { value: t.programs, label: m.stats.programs },
    { value: t.fields, label: m.stats.fields },
  ];

  const steps = [
    { icon: Search, title: m.how.step1Title, body: m.how.step1Body },
    { icon: GitCompareArrows, title: m.how.step2Title, body: m.how.step2Body },
    { icon: Send, title: m.how.step3Title, body: m.how.step3Body },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50 to-bg">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-head text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {m.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{m.hero.subtitle}</p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar variant="hero" />
              <div className="mt-4 flex justify-center">
                <LocaleLink href="/search?near=1" className={buttonClasses("accent", "lg")}>
                  <MapPin className="size-5" aria-hidden />
                  {m.hero.findNearMe}
                </LocaleLink>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-2xl">
              <p className="mb-3 text-sm font-medium text-muted">{m.hero.popularFields}</p>
              <FieldChips />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <div className="container-page grid grid-cols-3 divide-x divide-line py-8 rtl:divide-x-reverse">
          {stats.map((s) => (
            <div key={s.label} className="px-2 text-center">
              <p className="font-head text-2xl font-bold text-brand sm:text-3xl">
                {formatNumber(s.value, locale)}+
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-head text-2xl font-bold text-ink">{m.featured.title}</h2>
            <p className="mt-1 text-sm text-muted">{m.featured.subtitle}</p>
          </div>
          <LocaleLink
            href="/search"
            className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
          >
            {m.featured.seeAll}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </LocaleLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u) => (
            <UniversityCard key={u.id} u={u} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="border-t border-line bg-surface">
        <div className="container-page py-14">
          <h2 className="mb-8 text-center font-head text-2xl font-bold text-ink">{m.how.title}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-card border border-line bg-bg p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                  <s.icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-head text-lg font-semibold text-ink">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
