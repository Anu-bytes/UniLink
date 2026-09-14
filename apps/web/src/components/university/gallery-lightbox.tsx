"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useState } from "react";

type GalleryImage = { id: string; url: string; alt: string | null };

/**
 * A grid of photos that opens into a full-screen viewer on click, with
 * prev/next and Escape/arrow-key navigation — the compact hero thumbnail
 * strip this replaced didn't do justice to a campus with real photos to
 * show, and gave no way to actually look at one full-size.
 */
export function GalleryLightbox({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex != null;

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") {
        setOpenIndex((i) => (i == null ? i : (i + 1) % images.length));
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((i) => (i == null ? i : (i - 1 + images.length) % images.length));
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length]);

  const active = openIndex != null ? images[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={image.alt ?? `${name} ${index + 1}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-sm"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100"
            >
              <Expand className="size-6 text-white drop-shadow" />
            </span>
          </button>
        ))}
      </div>

      {isOpen && active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt ?? name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 duration-200 animate-in fade-in-0"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="size-5" aria-hidden />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenIndex((i) => (i == null ? i : (i - 1 + images.length) % images.length));
                }}
                aria-label="Previous photo"
                className="absolute start-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:start-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronLeft className="size-6 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenIndex((i) => (i == null ? i : (i + 1) % images.length));
                }}
                aria-label="Next photo"
                className="absolute end-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:end-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronRight className="size-6 rtl:rotate-180" aria-hidden />
              </button>
            </>
          ) : null}

          {/* eslint-disable-next-line @next/next/no-img-element -- campus
              photos come from arbitrary partner hosts, same as the grid
              above and the hero cover photo. */}
          <img
            src={active.url}
            alt={active.alt ?? name}
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl duration-200 animate-in zoom-in-95"
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 ? (
            <p className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {openIndex + 1} / {images.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
