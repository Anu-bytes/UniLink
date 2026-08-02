import { getLocale, getTranslations } from "next-intl/server";

import { EmptySection, Paragraphs, SectionHeading } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";

export async function TabTuition({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  const rows = university.faculties.flatMap((faculty) =>
    faculty.programs.map((program) => ({ faculty, program })),
  );

  if (rows.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading title={t("tuition.heading")} />

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[44rem] border-collapse text-start">
            <thead>
              <tr className="bg-[#F7F9FE] text-sm text-[#5a6072]">
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {t("tuition.program")}
                </th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {t("tuition.faculty")}
                </th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {t("tuition.level")}
                </th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {t("tuition.fee")}
                </th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {t("tuition.applicationFee")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ faculty, program }) => {
                const tuition = formatMoney(
                  locale,
                  program.tuitionFee,
                  program.currency,
                );
                const applicationFee = program.applicationFeeWaived
                  ? t("tuition.waived")
                  : formatMoney(locale, program.applicationFee, program.currency);

                return (
                  <tr key={program.id}>
                    <th
                      scope="row"
                      className="px-5 py-4 text-start font-semibold text-[#1F2A44]"
                    >
                      {program.name}
                    </th>
                    <td className="px-5 py-4 text-[#5a6072]">{faculty.name}</td>
                    <td className="px-5 py-4 text-[#5a6072]">
                      {tCatalog(`levels.${program.studyLevel}`)}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#1F2A44]">
                      {tuition ?? "—"}
                      {tuition ? (
                        <span className="font-normal text-[#5a6072]">
                          {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-[#5a6072]">
                      {applicationFee ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {university.tuitionNotes.map((note) => (
        <section key={note.id} className="rounded-2xl bg-[#F5F8FF] p-5 md:p-6">
          {note.title ? (
            <h3 className="font-bold text-[#1F2A44]">{note.title}</h3>
          ) : null}
          <div className="mt-2">
            <Paragraphs text={note.body} />
          </div>
        </section>
      ))}
    </div>
  );
}
