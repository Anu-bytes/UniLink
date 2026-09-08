"use client";

import { Check, ChevronDown, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ContentCheck } from "@/lib/admin-catalogue";
import { Link } from "@/i18n/navigation";

export function useCatalogueExpansion() {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  function toggle(id: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  return { expanded, toggle };
}

export function CatalogueDetailsToggle({ id, name, checks, expanded, onToggle }: {
  id: string; name: string; checks: ContentCheck[]; expanded: boolean; onToggle: () => void;
}) {
  const t = useTranslations("Admin.catalogue");
  const missing = checks.filter((check) => !check.present).length;
  return (
    <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={`catalogue-details-${id}`}
      aria-label={`${t(expanded ? "hideDetails" : "showDetails")}: ${name}. ${t(missing ? "missingCount" : "contentComplete", { count: missing })}`}
      className={`mt-2 inline-flex items-center gap-1.5 rounded-md py-1 text-start text-[11.5px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] ${missing ? "text-amber-700 hover:text-amber-900" : "text-[#64748B] hover:text-[#1E6DEB]"}`}>
      {missing ? <CircleAlert className="size-3.5 shrink-0" aria-hidden /> : <Check className="size-3.5 shrink-0" aria-hidden />}
      {t(missing ? "missingCount" : "contentComplete", { count: missing })}
      <ChevronDown aria-hidden className={`size-3.5 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}

export function ContentChecklist({ checks, editHref }: { checks: ContentCheck[]; editHref: string }) {
  const t = useTranslations("Admin.catalogue");
  return (
    <section className="min-w-0">
      <h3 className="mb-2 text-xs font-semibold text-[#0F172A]">{t("contentChecklist")}</h3>
      <ul className="space-y-1.5 text-xs">
        {checks.map((check) => <li key={check.key} className="flex items-center gap-2">
          {check.present ? <Check className="size-3.5 shrink-0 text-emerald-600" aria-hidden /> : <CircleAlert className="size-3.5 shrink-0 text-amber-600" aria-hidden />}
          <span className={check.present ? "text-[#64748B]" : "text-amber-800"}>{t(`checks.${check.key}`)}<span className="sr-only">: {t(check.present ? "present" : "missing")}</span></span>
        </li>)}
      </ul>
      <Link href={editHref} className="mt-3 inline-block text-xs font-medium text-[#1E6DEB] hover:underline focus-visible:outline-2">{t("editContent")}</Link>
    </section>
  );
}
