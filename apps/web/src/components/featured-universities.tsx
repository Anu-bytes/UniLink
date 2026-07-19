"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { ImagePlaceholder } from "@/components/image-placeholder";
import type { UniversityCardData } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function FeaturedUniversities({
  universities,
  allLabel,
  filterLabel,
}: {
  universities: UniversityCardData[];
  allLabel: string;
  filterLabel: string;
}) {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const cities = useMemo(
    () => Array.from(new Set(universities.map((item) => item.city))),
    [universities],
  );
  const visible = activeCity
    ? universities.filter((item) => item.city === activeCity)
    : universities;

  return (
    <>
      <div
        role="group"
        aria-label={filterLabel}
        className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-8 md:gap-y-3"
      >
        {[null, ...cities].map((city) => {
          const selected = city === activeCity;
          return (
            <button
              key={city ?? "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveCity(city)}
              className={cn(
                "relative inline-flex min-h-11 items-center px-2 pb-1 text-base font-semibold outline-none transition-colors md:px-1 md:text-[18px]",
                "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-center after:rounded-full after:bg-[#1E6DEB] after:transition-transform after:duration-300 after:content-['']",
                "focus-visible:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                selected
                  ? "text-[#1E6DEB] after:scale-x-100"
                  : "text-[#292E3E] after:scale-x-0 hover:text-[#1E6DEB]",
              )}
            >
              {city ?? allLabel}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {visible.map((university) => (
          <article
            key={university.id}
            className="hover-lift h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {university.coverImageUrl ? (
              <div
                role="img"
                aria-label={university.name}
                className="aspect-[338/226] w-full bg-slate-200 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
                }}
              />
            ) : (
              <ImagePlaceholder
                w={338}
                h={226}
                rounded="rounded-none"
                className="w-full"
                label=""
              />
            )}
            <div className="min-w-0 p-5 md:p-6">
              <h3 className="text-[20px] font-bold text-[#363B51]">
                {university.name}
              </h3>
              <p className="mt-2 flex min-w-0 items-start gap-1.5 text-[15px] leading-6 text-[#5a6072]">
                <MapPin className="mt-1 size-4 shrink-0 text-[#1E6DEB]" />
                <span>
                  {university.city}, {university.country}
                </span>
              </p>
              {university.description ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5a6072]">
                  {university.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
