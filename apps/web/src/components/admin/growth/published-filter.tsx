"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SelectInput } from "@/components/admin";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * The draft/published filter both editorial lists carry. Its labels arrive as
 * props because the copy belongs to the section that renders it, while the
 * URL-writing behaviour is identical in both.
 */
export function PublishedFilter({
  label,
  allLabel,
}: {
  label: string;
  allLabel: string;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setPublished(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("published", value);
    } else {
      params.delete("published");
    }
    // A narrower result set has fewer pages, so the old offset would land the
    // admin on an empty page.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <SelectInput
      aria-label={label}
      className="h-10 w-auto min-w-[10rem]"
      value={searchParams.get("published") ?? ""}
      onChange={(event) => setPublished(event.target.value)}
      placeholder={allLabel}
      options={[
        { value: "true", label: t("common.published") },
        { value: "false", label: t("common.draft") },
      ]}
    />
  );
}
