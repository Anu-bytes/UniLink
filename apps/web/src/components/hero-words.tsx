"use client";

import { Fragment, useEffect, useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

// Active colour and underline per word: brand blue, deep blue, brand red.
const ACCENTS = [
  { text: "text-[#1E6DEB]", bar: "from-[#1E6DEB] to-[#5B9BFF]" },
  { text: "text-[#1E3A8A]", bar: "from-[#1E3A8A] to-[#3B6FD8]" },
  { text: "text-[#E8352A]", bar: "from-[#E8352A] to-[#FF7A6B]" },
];

/**
 * "Explore • Compare • Apply". The words rise in once, then a highlight walks
 * across them: the active word takes its colour and an underline draws in
 * under it while the previous one's retracts, every few seconds. Calm enough
 * to sit above a headline; still under reduced motion (all words coloured).
 */
export function HeroWords({ words }: { words: string[] }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length < 2) return;
    const id = setInterval(() => setActive((index) => (index + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [reducedMotion, words.length]);

  return (
    <p
      aria-hidden
      className="flex flex-nowrap items-center justify-center gap-x-2.5 whitespace-nowrap text-[clamp(1.6rem,6.4vw,3.25rem)] font-extrabold leading-[1.2] tracking-tight sm:gap-x-4 lg:justify-start"
    >
      {words.map((word, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        const on = reducedMotion || index === active;
        return (
          <Fragment key={word}>
            {index > 0 ? (
              <span
                className="ul-hero-rise size-1.5 shrink-0 rounded-full bg-[#9DB8E8] sm:size-2"
                style={{ "--i": index * 2 - 1 } as React.CSSProperties}
              />
            ) : null}
            <span
              className="ul-hero-rise relative inline-block pb-1.5"
              style={{ "--i": index * 2 } as React.CSSProperties}
            >
              <span
                className={cn(
                  "inline-block transition-[color,transform] duration-500 ease-out",
                  on ? `${accent.text} -translate-y-0.5` : "text-[#16233F]",
                )}
              >
                {word}
              </span>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-[5px] rounded-full bg-gradient-to-r transition-transform duration-500 ease-out rtl:bg-gradient-to-l",
                  accent.bar,
                  on
                    ? "scale-x-100 origin-left rtl:origin-right"
                    : "scale-x-0 origin-right rtl:origin-left",
                )}
              />
            </span>
          </Fragment>
        );
      })}
    </p>
  );
}
