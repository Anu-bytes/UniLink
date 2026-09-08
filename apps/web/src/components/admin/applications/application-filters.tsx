"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput, type SelectOption } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * The university options are localised on the server, where the catalogue's
 * `localized` helper already lives; they cross the boundary as plain strings.
 */
export function ApplicationFilters({
  universities,
}: {
  universities: SelectOption[];
}) {
  const t = useTranslations("Admin.applications");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Same reason the chips do it: a narrower result set has fewer pages.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <SelectInput
      aria-label={t("filters.university")}
      className="h-10 w-auto min-w-[12rem]"
      value={searchParams.get("universityId") ?? ""}
      onChange={(event) => setFilter("universityId", event.target.value)}
      options={universities}
      placeholder={t("filters.allUniversities")}
    />
  );
}
