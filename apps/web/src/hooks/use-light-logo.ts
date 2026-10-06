"use client";

import { useCallback, useState } from "react";

// One result per logo URL for the whole page session.
const cache = new Map<string, boolean>();

/**
 * Whether a logo is mostly light marks on a transparent background (white
 * text or a white crest), which vanishes on the site's white logo tiles and
 * badges. Samples the loaded image at 40x40 on a canvas: light when a good
 * share of the image is transparent and most of the visible pixels are near
 * white. Cross-origin logos without CORS can't be read and count as dark.
 */
function isLightLogo(image: HTMLImageElement): boolean {
  try {
    const size = 40;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return false;
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    let visible = 0;
    let light = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 60) continue;
      visible += 1;
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance > 215) light += 1;
    }
    const total = size * size;
    return visible > 0 && visible / total < 0.85 && light / visible > 0.35;
  } catch {
    return false;
  }
}

/**
 * `light` is true once the image has loaded and turned out to be a light
 * logo, so the caller can put it on a dark background. Pass `ref` to the
 * <img> (it also handles images that finished loading before hydration).
 */
export function useLightLogo(src: string | null | undefined) {
  const [light, setLight] = useState(() => (src ? (cache.get(src) ?? false) : false));

  const check = useCallback(
    (image: HTMLImageElement) => {
      if (!src) return;
      let value = cache.get(src);
      if (value === undefined) {
        value = isLightLogo(image);
        cache.set(src, value);
      }
      setLight(value);
    },
    [src],
  );

  const ref = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image) return;
      if (image.complete && image.naturalWidth > 0) check(image);
      else image.addEventListener("load", () => check(image), { once: true });
    },
    [check],
  );

  return { light, ref };
}
