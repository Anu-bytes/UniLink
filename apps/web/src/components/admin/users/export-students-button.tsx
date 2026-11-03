import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Downloads every student and parent account as an Excel workbook. A plain
 * GET form, like the statistics export: the browser saves the file.
 */
export function ExportStudentsButton() {
  const t = useTranslations("Admin.users.export");
  const locale = useLocale();
  return (
    <form action="/api/admin/users/export" method="get">
      <input type="hidden" name="locale" value={locale} />
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
