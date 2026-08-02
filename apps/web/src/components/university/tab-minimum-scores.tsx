import { getLocale, getTranslations } from "next-intl/server";

import { EmptySection, SectionHeading } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

export async function TabMinimumScores({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  if (university.minimumScores.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div>
      <SectionHeading title={t("scores.heading")} intro={t("scores.intro")} />

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[36rem] border-collapse text-start">
          <thead>
            <tr className="bg-[#F7F9FE] text-sm text-[#5a6072]">
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {t("scores.system")}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {t("scores.minimum")}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {t("scores.scope")}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {t("scores.year")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {university.minimumScores.map((score) => (
              <tr key={score.id}>
                <th
                  scope="row"
                  className="px-5 py-4 text-start font-semibold text-[#1F2A44]"
                >
                  {tCatalog(`systems.${score.system}`)}
                </th>
                <td className="px-5 py-4 font-bold text-[#1E6DEB]">
                  {formatNumber(locale, score.minScore)}
                  <span className="ms-1 text-sm font-normal text-[#5a6072]">
                    {tCatalog(`units.${score.unit}`)}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#5a6072]">
                  {score.facultyName ?? t("scores.universityWide")}
                </td>
                <td className="px-5 py-4 text-[#5a6072]">
                  {score.year ? formatNumber(locale, score.year) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
