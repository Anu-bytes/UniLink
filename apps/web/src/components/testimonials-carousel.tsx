"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, UserRound } from "lucide-react";

import type { TestimonialData } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function usePerPage(max: number) {
  const [perPage, setPerPage] = useState(1);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const base = w < 640 ? 1 : w < 1024 ? 2 : 3;
      setPerPage(Math.min(base, max));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [max]);
  return perPage;
}

export function TestimonialsCarousel({
  testimonials,
  prevLabel,
  nextLabel,
  maxPerPage = 3,
}: {
  testimonials: TestimonialData[];
  prevLabel: string;
  nextLabel: string;
  maxPerPage?: number;
}) {
  const perPage = usePerPage(maxPerPage);
  const pages = Math.max(1, Math.ceil(testimonials.length / perPage));
  const [page, setPage] = useState(0);

  // Keep the active page in range when the viewport (perPage) changes.
  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [pages]);

  const go = (next: number) => setPage((next + pages) % pages);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
      >
        {visible.map((t) => (
          <figure
            key={t.id}
            className="flex h-full flex-col rounded-2xl border border-[#E7EDF5] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {t.avatarUrl ? (
                <span
                  role="img"
                  aria-label={t.studentName}
                  className="size-12 shrink-0 rounded-full bg-slate-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${JSON.stringify(t.avatarUrl)})` }}
                />
              ) : (
                // Same brand-gradient icon badge UniversityLogo falls back to
                // when there's no real photo, rather than an empty gray box.
                <span
                  aria-hidden
                  title={t.studentName}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-sm"
                >
                  <UserRound className="size-1/2" strokeWidth={2} />
                </span>
              )}
              <div className="min-w-0">
                <figcaption className="truncate font-semibold text-[#16233F]">
                  {t.studentName}
                </figcaption>
                {t.location ? (
                  <p className="truncate text-xs text-[#5a6072]">{t.location}</p>
                ) : null}
              </div>
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-6 text-[#4A5568]">
              {t.quote}
            </blockquote>

            <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-[#F5A623] text-[#F5A623]"
                  aria-hidden
                />
              ))}
            </div>
          </figure>
        ))}
      </div>

      {pages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(page - 1)}
            aria-label={prevLabel}
            className="flex size-10 items-center justify-center rounded-full border border-[#E7EDF5] bg-white text-[#16233F] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`${i + 1}`}
                aria-current={i === page}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === page ? "w-5 bg-[#1E6DEB]" : "w-2 bg-[#C5D6F5] hover:bg-[#94b4ef]",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(page + 1)}
            aria-label={nextLabel}
            className="flex size-10 items-center justify-center rounded-full border border-[#E7EDF5] bg-white text-[#16233F] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
