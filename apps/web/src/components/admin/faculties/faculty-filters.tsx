"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput, type SelectOption } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

export function FacultyFilters({
  universities,
}: {
  /** Every university, already labelled for the active locale by the page. */
  universities: SelectOption[];
}) {
  const t = useTranslations("Admin");
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
    // A narrower result set has fewer pages, so the old offset would land the
    // admin on an empty page.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <SelectInput
      aria-label={t("faculties.filters.university")}
      className="h-10 w-auto min-w-[13rem] max-w-[18rem]"
      value={searchParams.get("universityId") ?? ""}
      onChange={(event) => setFilter("universityId", event.target.value)}
      options={universities}
      placeholder={t("faculties.filters.allUniversities")}
    />
  );
}
