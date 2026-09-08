import { getLocale, getTranslations } from "next-intl/server";

import { formatNumber } from "@/lib/format";

/**
 * Deliberately not StatCardGrid: these are the figures an admin glances at
 * rather than acts on, and six full stat cards would out-weigh the four
 * headline numbers at the top of the page.
 */
export async function SecondaryStats({
  faculties,
  scholarships,
  testimonials,
  savedFaculties,
  newUsers,
  newLeads,
}: {
  faculties: number;
  scholarships: number;
  testimonials: number;
  savedFaculties: number;
  newUsers: number;
  newLeads: number;
}) {
  const t = await getTranslations("Admin.overview");
  const locale = await getLocale();

  const items: { key: string; label: string; value: number; hint?: string }[] = [
    { key: "faculties", label: t("secondary.faculties"), value: faculties },
    { key: "scholarships", label: t("secondary.scholarships"), value: scholarships },
    { key: "testimonials", label: t("secondary.testimonials"), value: testimonials },
    {
      key: "savedFaculties",
      label: t("secondary.savedFaculties"),
      value: savedFaculties,
    },
    {
      key: "newUsers",
      label: t("secondary.newUsers"),
      value: newUsers,
      hint: t("secondary.last30Days"),
    },
    {
      key: "newLeads",
      label: t("secondary.newLeads"),
      value: newLeads,
      hint: t("secondary.last30Days"),
    },
  ];

  return (
    <section aria-labelledby="admin-overview-secondary">
      <h2
        id="admin-overview-secondary"
        className="text-[15px] font-semibold text-[#0F172A]"
      >
        {t("secondary.title")}
      </h2>

      {/* The single-pixel gap over a slate ground draws the dividers, which
          keeps six figures in one card instead of six competing boxes. */}
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.key} className="bg-white p-4">
            <dt className="text-[13px] text-[#64748B]">{item.label}</dt>
            <dd className="mt-1.5 text-[20px] font-semibold tabular-nums tracking-[-0.01em] text-[#0F172A]">
              {formatNumber(locale, item.value)}
              {item.hint ? (
                <span className="mt-1 block text-[12px] font-normal tracking-normal text-[#94A3B8]">
                  {item.hint}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
