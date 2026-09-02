"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { SelectInput } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

import { STUDY_LEVELS } from "./types";
import type { FacultyOption, UniversityOption } from "./types";

export function ProgramFilters({
  universities,
  faculties,
}: {
  universities: UniversityOption[];
  /**
   * Only the faculties of the university currently in scope. Empty until one
   * is chosen: a faculty from another university narrows the list to nothing,
   * so it is not a filter anybody would mean to pick.
   */
  faculties: FacultyOption[];
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function apply(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    // A narrower result set has fewer pages, so the old offset would land the
    // admin on an empty page.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function setFilter(key: string, value: string) {
    apply((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function label(option: UniversityOption) {
    return locale === "ar" ? (option.nameAr ?? option.name) : option.name;
  }

  return (
    <>
      <SelectInput
        aria-label={t("programs.filters.university")}
        className="h-10 w-auto min-w-[12rem] max-w-[16rem]"
        value={searchParams.get("universityId") ?? ""}
        onChange={(event) =>
          apply((params) => {
            if (event.target.value) {
              params.set("universityId", event.target.value);
            } else {
              params.delete("universityId");
            }
            // The faculty in the URL belongs to the university being replaced,
            // so keeping it would filter to a combination with no rows.
            params.delete("facultyId");
          })
        }
        options={universities.map((university) => ({
          value: university.id,
          label: label(university),
        }))}
        placeholder={t("programs.filters.allUniversities")}
      />

      <SelectInput
        aria-label={t("programs.filters.faculty")}
        className="h-10 w-auto min-w-[12rem] max-w-[16rem]"
        value={searchParams.get("facultyId") ?? ""}
        disabled={faculties.length === 0}
        onChange={(event) => setFilter("facultyId", event.target.value)}
        options={faculties.map((faculty) => ({
          value: faculty.id,
          label: label(faculty),
        }))}
        placeholder={
          faculties.length === 0
            ? t("programs.filters.facultyLocked")
            : t("programs.filters.allFaculties")
        }
      />

      <SelectInput
        aria-label={t("programs.filters.level")}
        className="h-10 w-auto min-w-[9.5rem]"
        value={searchParams.get("studyLevel") ?? ""}
        onChange={(event) => setFilter("studyLevel", event.target.value)}
        options={STUDY_LEVELS.map((level) => ({
          value: level,
          label: tCatalog(`levels.${level}`),
        }))}
        placeholder={t("programs.filters.allLevels")}
      />

      <SelectInput
        aria-label={t("programs.filters.status")}
        className="h-10 w-auto min-w-[9.5rem]"
        value={searchParams.get("published") ?? ""}
        onChange={(event) => setFilter("published", event.target.value)}
        options={[
          { value: "true", label: t("common.published") },
          { value: "false", label: t("common.draft") },
        ]}
        placeholder={t("programs.filters.allStatuses")}
      />
    </>
  );
}
