"use client";

import { Star, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/**
 * The home page shows the Arabic column when there is one and the console is
 * in Arabic — the same rule `localized` in lib/catalog applies. It is copied
 * rather than imported because that module builds a Prisma client, which has
 * no business in a client bundle.
 */
function localized(locale: string, english: string, arabic: string) {
  return locale.startsWith("ar") && arabic ? arabic : english;
}

/**
 * A live copy of one card from TestimonialsCarousel, down to its own palette:
 * the point is to show the editor what the home page will render, so it
 * deliberately does not follow the console's design language.
 */
export function TestimonialPreview({
  studentName,
  quote,
  quoteAr,
  location,
  locationAr,
  avatarUrl,
}: {
  studentName: string;
  quote: string;
  quoteAr: string;
  location: string;
  locationAr: string;
  avatarUrl: string | null;
}) {
  const t = useTranslations("Admin.testimonials");
  const locale = useLocale();

  const name = studentName.trim() || t("preview.placeholderName");
  const text = localized(locale, quote, quoteAr).trim() || t("preview.placeholderQuote");
  const place = localized(locale, location, locationAr).trim();

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-[#E7EDF5] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <span
            role="img"
            aria-label={name}
            className="size-12 shrink-0 rounded-full bg-slate-200 bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(avatarUrl)})` }}
          />
        ) : (
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-sm"
          >
            <UserRound className="size-1/2" strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <figcaption dir="auto" className="truncate font-semibold text-[#16233F]">
            {name}
          </figcaption>
          {place ? (
            <p dir="auto" className="truncate text-xs text-[#5a6072]">
              {place}
            </p>
          ) : null}
        </div>
      </div>

      {/* No `whitespace-pre-line`: the carousel does not keep the editor's
          line breaks, so honouring them here would promise a shape the home
          page never renders. */}
      <blockquote
        dir="auto"
        className="mt-4 flex-1 text-sm leading-6 text-[#4A5568]"
      >
        {text}
      </blockquote>

      {/* The carousel prints five filled stars for every testimonial; there is
          no rating column to vary them by. */}
      <div className="mt-4 flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-4 fill-[#F5A623] text-[#F5A623]" />
        ))}
      </div>
    </figure>
  );
}
