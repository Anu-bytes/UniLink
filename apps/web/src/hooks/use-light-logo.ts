"use client";

import { useCallback, useState } from "react";

// One result per logo URL for the whole page session: the recoloured image
// as a data URL, or null when the logo is fine as it is (or unreadable).
const cache = new Map<string, string | null>();

// The site's dark text colour (#1F2A44). Near-white marks are mapped to it.
const DARK = [31, 42, 68] as const;

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
 * Redraws a light logo for a white background: only the neutral (white and
 * grey) pixels are flipped, white becoming the site's dark text colour, so
 * every coloured part (a red star, a blue crest) keeps its exact brand
 * colour. A whole-image CSS invert turned those colours into their negative.
 */
function recolourLightLogo(image: HTMLImageElement): string | null {
  try {
    const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    const { data } = pixels;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Saturated pixels are brand colour: leave them alone.
      if (Math.max(r, g, b) - Math.min(r, g, b) > 48) continue;
      // Neutral pixels: white maps to the dark colour, black to white, greys
      // in between, so anti-aliased edges stay smooth.
      const lightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      data[i] = Math.round(DARK[0] + (255 - DARK[0]) * (1 - lightness));
      data[i + 1] = Math.round(DARK[1] + (255 - DARK[1]) * (1 - lightness));
      data[i + 2] = Math.round(DARK[2] + (255 - DARK[2]) * (1 - lightness));
    }
    context.putImageData(pixels, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/**
 * For logos that are white marks on transparency, returns a recoloured
 * version (`src`) that reads on a white tile, keeping the brand colours.
 * Use `src ?? originalUrl` as the <img> source and pass `ref` to the <img>
 * (it also handles images that finished loading before hydration).
 */
export function useLightLogo(src: string | null | undefined) {
  const [recoloured, setRecoloured] = useState<string | null>(() =>
    src ? (cache.get(src) ?? null) : null,
  );

  const check = useCallback(
    (image: HTMLImageElement) => {
      if (!src) return;
      let value = cache.get(src);
      if (value === undefined) {
        value = isLightLogo(image) ? recolourLightLogo(image) : null;
        cache.set(src, value);
      }
      setRecoloured(value);
    },
    [src],
  );

  const ref = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image) return;
      // Once swapped to the recoloured data URL, there is nothing to check.
      if (image.src.startsWith("data:")) return;
      if (image.complete && image.naturalWidth > 0) check(image);
      else image.addEventListener("load", () => check(image), { once: true });
    },
    [check],
  );

  return { src: recoloured, ref };
}
