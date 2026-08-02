"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; alt: string | null };

/**
 * Large preview plus the thumbnail strip beneath it. Selection is local state:
 * nothing about which photo is showing needs to survive a reload.
 */
export function UniversityGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-[#E8EFFC] to-[#D5E2F8]" />
    );
  }

  return (
    <div>
      <div
        role="img"
        aria-label={active.alt ?? name}
        className="aspect-[16/10] w-full rounded-2xl bg-slate-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${JSON.stringify(active.url)})` }}
      />

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={image.alt ?? `${name} ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "size-16 shrink-0 rounded-lg border-2 bg-slate-200 bg-cover bg-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] md:size-20",
                index === activeIndex
                  ? "border-[#1E6DEB] shadow-sm"
                  : "border-transparent opacity-80 hover:opacity-100",
              )}
              style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
