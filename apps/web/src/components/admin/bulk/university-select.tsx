"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import type { SelectOption } from "@/components/admin";
import { useConfirmNavigation } from "@/components/admin/unsaved-changes";

/** Which university's programs the bulk grid shows. */
export function BulkUniversityPicker({ value, options }: { value: string; options: SelectOption[] }) {
  const t = useTranslations("Admin.bulk");
  const router = useRouter();
  const confirmNavigation = useConfirmNavigation();
  return (
    <select
      aria-label={t("chooseUniversity")}
      value={value}
      onChange={(event) => {
        const next = event.target.value;
        confirmNavigation(() => router.push(`/admin/bulk-edit?tab=programs&university=${next}`));
      }}
      className="h-10 min-w-64 rounded-lg border border-slate-200 bg-white px-3 text-[13.5px] outline-none focus:border-[#1E6DEB]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
