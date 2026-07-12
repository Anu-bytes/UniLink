"use client";

import { GraduationCap, Sparkles, Heart, Languages, ArrowLeft } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { LocaleLink } from "@/components/LocaleLink";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { m } = useIntl();
  const features = [
    { icon: Sparkles, text: m.auth.panelFeature1 },
    { icon: Heart, text: m.auth.panelFeature2 },
    { icon: Languages, text: m.auth.panelFeature3 },
  ];

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 to-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <LocaleLink href="/" className="relative z-10 flex items-center gap-2 font-head text-xl font-bold">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-white/15">
            <GraduationCap className="size-5" />
          </span>
          {m.brand}
        </LocaleLink>
        <div className="relative z-10 max-w-md">
          <h2 className="font-head text-3xl font-bold leading-tight">{m.auth.panelTitle}</h2>
          <ul className="mt-8 flex flex-col gap-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <f.icon className="size-5" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-sm text-white/60">© 2026 {m.brand}</p>
        <div className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -start-10 size-72 rounded-full bg-brand-400/30 blur-3xl" />
      </aside>

      {/* Form column */}
      <main className="flex flex-col px-4 py-8 sm:px-8">
        <LocaleLink
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink lg:hidden"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {m.auth.backToHome}
        </LocaleLink>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4">{children}</div>
      </main>
    </div>
  );
}
