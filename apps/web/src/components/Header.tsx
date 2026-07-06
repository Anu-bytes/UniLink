"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, MapPin, Menu, X } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { LocaleLink } from "./LocaleLink";
import { LanguageToggle } from "./LanguageToggle";
import { buttonClasses } from "./ui/Button";
import { cn } from "@/lib/cn";

export function Header() {
  const { m } = useIntl();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/search", label: m.nav.universities },
    { href: "/map", label: m.nav.map },
    { href: "/#about", label: m.nav.about },
  ];

  const isActive = (href: string) => pathname.replace(/^\/(en|ar)/, "").startsWith(href) && href !== "/#about";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        <LocaleLink href="/" className="flex items-center gap-2 font-head text-lg font-bold text-ink">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand text-white">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          {m.brand}
        </LocaleLink>

        <nav className="mx-2 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href) ? "text-brand" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </LocaleLink>
          ))}
        </nav>

        <div className="ms-auto hidden items-center gap-2 md:flex">
          <LocaleLink href="/search?near=1" className={buttonClasses("ghost", "md")}>
            <MapPin className="size-4" aria-hidden />
            {m.nav.findNearMe}
          </LocaleLink>
          <LanguageToggle />
          <button className={buttonClasses("primary", "md")}>{m.nav.signIn}</button>
        </div>

        <button
          className="ms-auto inline-flex size-10 items-center justify-center rounded-[10px] border border-line md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <LocaleLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-brand-50"
              >
                {item.label}
              </LocaleLink>
            ))}
            <LocaleLink
              href="/search?near=1"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand hover:bg-brand-50"
            >
              <MapPin className="size-4" /> {m.nav.findNearMe}
            </LocaleLink>
            <div className="mt-2 flex items-center gap-2">
              <LanguageToggle className="flex-1" />
              <button className={buttonClasses("primary", "md", "flex-1")}>{m.nav.signIn}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
