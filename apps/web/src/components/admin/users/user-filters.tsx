"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

import { USER_ROLES } from "./tones";

export function UserFilters() {
  const t = useTranslations("Admin");
  const tRole = useTranslations("Admin.enums.userRoles");
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
        aria-label={t("users.filters.role")}
        className="h-10 w-auto min-w-[11rem]"
        value={searchParams.get("role") ?? ""}
        onChange={(event) => setFilter("role", event.target.value)}
        options={USER_ROLES.map((role) => ({ value: role, label: tRole(role) }))}
        placeholder={t("users.filters.allRoles")}
      />

      <SelectInput
        aria-label={t("users.filters.profile")}
        className="h-10 w-auto min-w-[12rem]"
        value={searchParams.get("hasProfile") ?? ""}
        onChange={(event) => setFilter("hasProfile", event.target.value)}
        options={[
          { value: "true", label: t("users.filters.withProfile") },
          { value: "false", label: t("users.filters.withoutProfile") },
        ]}
        placeholder={t("users.filters.anyProfile")}
      />
    </>
  );
}
