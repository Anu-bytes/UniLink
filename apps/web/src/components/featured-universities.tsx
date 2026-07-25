"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { UniversityCardData } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function FeaturedUniversities({
  universities,
  allLabel,
  filterLabel,
  programsLabel,
  viewDetailsLabel,
}: {
  universities: UniversityCardData[];
  allLabel: string;
  filterLabel: string;
  programsLabel: string;
  viewDetailsLabel: string;
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

      <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {visible.map((university) => {
          const initial = university.name.trim().charAt(0) || "U";
          return (
            <article
              key={university.id}
              className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7EDF5] bg-white text-center shadow-sm transition-colors hover:border-[#1E6DEB]/40"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                {university.coverImageUrl ? (
                  <div
                    role="img"
                    aria-label={university.name}
                    className="size-full bg-slate-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#EAF1FF] to-[#DCE7FA] text-xs font-medium text-[#9db4e0] transition-transform duration-500 group-hover:scale-105">
                    {university.name}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col items-center px-5 pb-5">
                {/* logo badge overlapping the cover image */}
                <span className="-mt-8 flex size-16 items-center justify-center rounded-full border-4 border-white bg-white text-xl font-bold text-[#1E6DEB] shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                  {initial}
                </span>

                <h3 className="mt-3 text-[17px] font-bold leading-6 text-[#16233F]">
                  {university.name}
                </h3>

                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#5a6072]">
                  <MapPin className="size-4 shrink-0 text-[#1E6DEB]" />
                  {university.city}
                </p>

                <p className="mt-1 text-sm text-[#5a6072]">
                  {programsLabel}: {university.programCount}+
                </p>

                <Link
                  href={`/universities/${university.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#1E6DEB] transition-colors hover:text-[#1859c4] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {viewDetailsLabel}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
