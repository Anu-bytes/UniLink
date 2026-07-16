"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/image-placeholder";

export type Step = {
  /** Short label shown in the pill slider (e.g. "Sign Up"). */
  tab: string;
  /** Full heading shown in the panel (e.g. "Sign Up for Free"). */
  heading: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
};

/**
 * ApplyBoard "Steps to Study Success" section: a rounded white pill slider
 * whose tabs switch the content panel below. The active tab gets a soft-blue
 * pill; the others stay muted uppercase.
 */
export function StepsSlider({
  title,
  steps,
  stepLabel = "Step",
}: {
  title: string;
  steps: Step[];
  stepLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-[32px] font-bold text-[#363B51] sm:text-[40px]">
          {title}
        </h2>

        {/* Pill slider */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label={title}
            className="flex flex-wrap items-center justify-center gap-1 rounded-full bg-white p-2 shadow-[0_10px_40px_-10px_rgba(30,109,235,0.25)] ring-1 ring-slate-100"
          >
            {steps.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.tab}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-6 py-2.5 text-[14px] font-bold uppercase tracking-wide transition-colors ${
                    selected
                      ? "bg-[#E8EEFB] text-[#1E6DEB]"
                      : "text-[#363B51] hover:text-[#1E6DEB]"
                  }`}
                >
                  {s.tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active step panel */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <span className="text-[14px] font-bold uppercase tracking-widest text-[#1E6DEB]">
              {stepLabel} {active + 1}
            </span>
            <h3 className="mt-3 text-[28px] font-bold leading-tight text-[#363B51] sm:text-[34px]">
              {step.heading}
            </h3>
            <p className="mt-4 text-[18px] leading-8 text-[#292E3E]">
              {step.description}
            </p>
            <ul className="mt-6 space-y-3">
              {step.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E8EEFB] text-[#1E6DEB]">
                    <Check className="size-4" />
                  </span>
                  <span className="text-[17px] leading-7 text-[#292E3E]">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href={step.cta.href}
                className="inline-flex h-14 items-center justify-center rounded-[8px] bg-[#1E6DEB] px-7 text-[18px] font-semibold text-white transition-colors hover:bg-[#1859c4]"
              >
                {step.cta.label}
              </Link>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <ImagePlaceholder
              w={520}
              h={420}
              className="w-full bg-slate-200"
              label={`Step ${active + 1} image 520×420`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
