import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Inside the console: a record that does not exist, or one this admin is not
 * allowed to open (a university admin following a link to someone else's
 * university). Same page for both, so it says nothing about which.
 */
export default async function AdminNotFound() {
  const t = await getTranslations("Admin.notFound");
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX className="size-6" aria-hidden />
      </span>
      <h1 className="mt-4 text-[18px] font-semibold text-[#0F172A]">{t("title")}</h1>
      <p className="mt-1.5 text-[13.5px] text-[#64748B]">{t("body")}</p>
      <Link href="/admin" className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-[#1E6DEB] px-4 text-[13.5px] font-semibold text-white hover:bg-[#1859c4]">
        {t("back")}
      </Link>
    </div>
  );
}
