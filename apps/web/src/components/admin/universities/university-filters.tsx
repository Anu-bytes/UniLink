"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

import { UNIVERSITY_TYPES } from "./types";

export function UniversityFilters() {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
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
    <>
      <SelectInput
        aria-label={t("universities.filters.type")}
        className="h-10 w-auto min-w-[9.5rem]"
        value={searchParams.get("type") ?? ""}
        onChange={(event) => setFilter("type", event.target.value)}
        options={UNIVERSITY_TYPES.map((type) => ({
          value: type,
          label: tCatalog(`universityTypes.${type}`),
        }))}
        placeholder={t("universities.filters.allTypes")}
      />

      <SelectInput
        aria-label={t("universities.filters.status")}
        className="h-10 w-auto min-w-[9.5rem]"
        value={searchParams.get("published") ?? ""}
        onChange={(event) => setFilter("published", event.target.value)}
        options={[
          { value: "true", label: t("common.published") },
          { value: "false", label: t("common.draft") },
        ]}
        placeholder={t("universities.filters.allStatuses")}
      />

      <SelectInput
        aria-label={t("universities.filters.featured")}
        className="h-10 w-auto min-w-[9.5rem]"
        value={searchParams.get("featured") ?? ""}
        onChange={(event) => setFilter("featured", event.target.value)}
        options={[
          { value: "true", label: t("universities.filters.featuredOnly") },
          { value: "false", label: t("universities.filters.notFeatured") },
        ]}
        placeholder={t("universities.filters.allFeatured")}
      />
    </>
  );
}
