import { ArrowRight, ClipboardCheck, FileClock, Building2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

export async function AttentionPanel({ submitted, reviewing, drafts }: { submitted: number; reviewing: number; drafts: number }) {
  const t = await getTranslations("Admin.overview.attention");
  const locale = await getLocale();
  const items = [
    { key: "submitted", count: submitted, href: "/admin/applications?status=SUBMITTED", icon: ClipboardCheck },
    { key: "reviewing", count: reviewing, href: "/admin/applications?status=IN_REVIEW", icon: FileClock },
    { key: "drafts", count: drafts, href: "/admin/universities?published=false", icon: Building2 },
  ] as const;
  return (
    <section aria-labelledby="admin-attention" className="rounded-xl border border-blue-200/70 bg-[#EAF2FE]/60 p-5">
      <h2 id="admin-attention" className="text-base font-semibold text-[#0F172A]">{t("title")}</h2>
      <p className="mt-1 text-[13px] text-[#475569]">{t(submitted + reviewing + drafts === 0 ? "clear" : "description")}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map(({ key, count, href, icon: Icon }) => (
          <Link key={key} href={href} className="group flex items-center gap-3 rounded-lg border border-blue-100 bg-white p-4 transition-colors hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <Icon className="size-5 shrink-0 text-[#1E6DEB]" aria-hidden />
            <span className="min-w-0 flex-1"><span className="block text-xl font-semibold tabular-nums text-[#0F172A]">{formatNumber(locale, count)}</span><span className="text-[13px] text-[#475569]">{t(key)}</span></span>
            <ArrowRight className="size-4 text-[#1E6DEB] rtl:rotate-180" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}
