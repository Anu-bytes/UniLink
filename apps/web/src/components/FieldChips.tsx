"use client";

import { useIntl } from "@/i18n/provider";
import { LocaleLink } from "./LocaleLink";
import { FIELDS } from "@/data/fields";
import { pick } from "@/lib/format";
import type { FieldOfStudyId } from "@/lib/types";

const POPULAR: FieldOfStudyId[] = [
  "engineering",
  "medicine",
  "cs-ai-it",
  "business",
  "pharmacy",
  "dentistry",
  "law",
  "arts-design",
];

export function FieldChips({ limit }: { limit?: number }) {
  const { locale } = useIntl();
  const ids = limit ? POPULAR.slice(0, limit) : POPULAR;
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {ids.map((id) => {
        const field = FIELDS.find((f) => f.id === id)!;
        return (
          <LocaleLink
            key={id}
            href={`/search?field=${id}`}
            className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
          >
            {pick(field.name, locale)}
          </LocaleLink>
        );
      })}
    </div>
  );
}
