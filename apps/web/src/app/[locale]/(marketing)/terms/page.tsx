import { ArrowUp, Scale } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Paragraphs } from "@/components/university/prose";

// Fixed order, must match the length and order of Terms.sections in both
// messages/en.json and messages/ar.json — each slug is zipped by index with
// the translated section to build a stable anchor id that both locales share.
const SECTION_SLUGS = [
  "acceptance",
  "definitions",
  "eligibility",
  "description",
  "account",
  "acceptable-use",
  "your-content",
  "university-info",
  "application-tracking",
  "matching-estimates",
  "fees",
  "intellectual-property",
  "privacy",
  "third-party",
  "warranties",
  "liability",
  "indemnification",
  "termination",
  "changes",
  "governing-law",
  "general",
  "contact",
] as const;

type Section = { heading: string; body: string };

export default async function TermsPage() {
  const t = await getTranslations("Terms");

  const sections = t.raw("sections") as Section[];
  const lastUpdated = t("lastUpdated", { date: t("lastUpdatedDate") });

  return (
    <div id="top" className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <header className="border-b border-slate-200 pb-8 text-center">
        <span
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]"
        >
          <Scale className="size-6" />
        </span>
        <h1 className="mt-4 text-3xl font-bold text-[#1F2A44] md:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#5a6072]">
          {t("subtitle")}
        </p>
        <p className="mt-4 text-sm font-semibold text-[#98A0B4]">
          {lastUpdated}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Table of contents. Plain anchor links, so it works with no
            client-side JS. */}
        <nav
          aria-label={t("tocTitle")}
          className="h-fit rounded-2xl border border-slate-200 bg-[#F7F9FE] p-5 lg:sticky lg:top-24"
        >
          <p className="text-sm font-bold text-[#1F2A44]">{t("tocTitle")}</p>
          <ol className="mt-3 space-y-2 text-sm">
            {sections.map((section, index) => (
              <li key={SECTION_SLUGS[index]}>
                <a
                  href={`#${SECTION_SLUGS[index]}`}
                  className="text-[#5a6072] transition-colors hover:text-[#1E6DEB]"
                >
                  {index + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          <p className="text-base leading-8 text-[#5a6072]">{t("intro")}</p>

          <ol className="mt-10 space-y-12">
            {sections.map((section, index) => (
              <li
                key={SECTION_SLUGS[index]}
                id={SECTION_SLUGS[index]}
                className="scroll-mt-24"
              >
                <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
                  <span className="text-[#1E6DEB]">{index + 1}.</span>{" "}
                  {section.heading}
                </h2>
                <div className="mt-4">
                  <Paragraphs text={section.body} />
                </div>
              </li>
            ))}
          </ol>

          <a
            href="#top"
            className="mt-12 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E6DEB] hover:underline"
          >
            <ArrowUp className="size-4 rtl:rotate-180" aria-hidden />
            {t("backToTop")}
          </a>
        </div>
      </div>
    </div>
  );
}
