"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput, type SelectOption } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

import { PublishedFilter } from "./published-filter";

/**
 * `PLATFORM_WIDE` is not a university id: it stands for the scholarships with
 * no university at all, which is a filter the API cannot express through
 * `?universityId`. It is a distinct enough answer to be worth its own option,
 * so the page translates it into a `universityId: null` clause.
 */
export const PLATFORM_WIDE = "none";

export function ScholarshipFilters({
  universities,
}: {
  /** Every university, already labelled for the active locale by the page. */
  universities: SelectOption[];
}) {
  const t = useTranslations("Admin.scholarships");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setUniversity(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("universityId", value);
    } else {
      params.delete("universityId");
    }
    // A narrower result set has fewer pages, so the old offset would land the
    // admin on an empty page.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <>
      <SelectInput
        aria-label={t("filters.university")}
        className="h-10 w-auto min-w-[13rem] max-w-[18rem]"
        value={searchParams.get("universityId") ?? ""}
        onChange={(event) => setUniversity(event.target.value)}
        placeholder={t("filters.allUniversities")}
        options={[
          { value: PLATFORM_WIDE, label: t("filters.platformWide") },
          ...universities,
        ]}
      />

      <PublishedFilter
        label={t("filters.status")}
        allLabel={t("filters.allStatuses")}
      />
    </>
  );
}
