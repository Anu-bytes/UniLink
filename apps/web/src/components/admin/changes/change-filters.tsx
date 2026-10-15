"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { SelectOption } from "@/components/admin";

const SELECT =
  "h-10 min-w-48 rounded-lg border border-slate-200 bg-white px-3 text-[13.5px] text-[#0F172A] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20";

/** University (and, for reviewers, submitting admin) filters for the queue. */
export function ChangeFilters({
  universities,
  authors,
  university,
  author,
}: {
  universities: SelectOption[];
  authors: SelectOption[];
  university: string;
  author: string;
}) {
  const t = useTranslations("Admin.changes");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  if (universities.length < 2 && authors.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {universities.length > 1 ? (
        <select
          aria-label={t("filterUniversity")}
          value={university}
          onChange={(event) => set("university", event.target.value)}
          className={SELECT}
        >
          <option value="">{t("allUniversities")}</option>
          {universities.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {authors.length > 1 ? (
        <select
          aria-label={t("filterAuthor")}
          value={author}
          onChange={(event) => set("author", event.target.value)}
          className={SELECT}
        >
          <option value="">{t("allAdmins")}</option>
          {authors.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
