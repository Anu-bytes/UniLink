import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SelectInput } from "@/components/admin";

/**
 * Downloads the statistics as an Excel workbook, grouped the way the admin
 * picks. A plain GET form: the browser saves the file, no script needed.
 */
export function ExportStatsButton() {
  const t = useTranslations("Admin.stats.export");
  const locale = useLocale();
  return (
    <form action="/api/admin/stats/export" method="get" className="flex items-center gap-2">
      <input type="hidden" name="locale" value={locale} />
      <SelectInput
        name="unit"
        defaultValue="month"
        aria-label={t("unitLabel")}
        className="h-9 w-auto min-w-[7.5rem] text-[13px]"
        options={(["day", "week", "month", "year"] as const).map((unit) => ({ value: unit, label: t(`units.${unit}`) }))}
      />
      <button
        type="submit"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0F7B45] px-3.5 text-[13px] font-semibold text-white hover:bg-[#0B6638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F7B45]"
      >
        <Download className="size-4" aria-hidden />
        {t("button")}
      </button>
    </form>
  );
}
