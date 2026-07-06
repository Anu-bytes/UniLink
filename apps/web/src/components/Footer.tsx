"use client";

import { GraduationCap } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { LocaleLink } from "./LocaleLink";

export function Footer() {
  const { m } = useIntl();
  const year = 2026;

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-head text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-brand text-white">
              <GraduationCap className="size-4" aria-hidden />
            </span>
            {m.brand}
          </div>
          <p className="mt-3 text-sm text-muted">{m.footer.tagline}</p>
        </div>

        <FooterCol title={m.footer.product}>
          <LocaleLink href="/search" className="hover:text-ink">{m.nav.universities}</LocaleLink>
          <LocaleLink href="/map" className="hover:text-ink">{m.nav.map}</LocaleLink>
          <LocaleLink href="/search?near=1" className="hover:text-ink">{m.nav.findNearMe}</LocaleLink>
        </FooterCol>

        <FooterCol title={m.footer.company}>
          <span>{m.footer.about}</span>
          <span>{m.footer.contact}</span>
        </FooterCol>

        <FooterCol title={m.footer.legal}>
          <span>{m.footer.privacy}</span>
          <span>{m.footer.terms}</span>
        </FooterCol>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>© {year} {m.brand}. {m.footer.rights}</span>
          <span>{m.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      <div className="flex flex-col gap-2 text-sm text-muted">{children}</div>
    </div>
  );
}
