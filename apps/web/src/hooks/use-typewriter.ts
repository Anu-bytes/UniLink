"use client";

import { useEffect, useState } from "react";

/**
 * Types each phrase out, pauses, erases it and moves to the next, while
 * `active`. Drives the "Try: ..." hint in the empty search box.
 */
export function useTypewriter(phrases: string[], active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active || phrases.length === 0) return;
    let phrase = 0;
    let length = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const target = phrases[phrase] ?? "";
      if (!deleting) {
        length += 1;
        setText(target.slice(0, length));
        if (length >= target.length) {
          deleting = true;
          timer = setTimeout(tick, 1700);
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        length -= 1;
        setText(target.slice(0, length));
        if (length <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [active, phrases]);
  return active ? text : "";
}
