import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/catalog";

import { FieldRow, Panel } from "./panel";
import { SECONDARY_BUTTON } from "./styles";
import type { ApplicationProgram } from "./types";

export async function ProgramPanel({
  program,
}: {
  program: ApplicationProgram;
}) {
  const t = await getTranslations("Admin");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  return (
    <Panel
      title={t("applications.detail.program")}
      action={
        <Link
          href={`/admin/programs/${program.id}`}
          className={SECONDARY_BUTTON}
        >
          {t("applications.detail.viewProgram")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      }
    >
      <p className="text-[15px] font-semibold text-[#0F172A]">{program.name}</p>
      {program.nameAr ? (
        <p dir="rtl" className="mt-0.5 text-[13px] text-[#64748B]">
          {program.nameAr}
        </p>
      ) : null}

      <dl className="mt-4">
        <FieldRow label={t("applications.detail.university")}>
          <Link
            href={`/admin/universities/${program.university.id}`}
            className="rounded font-medium text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {localized(
              locale,
              program.university.name,
              program.university.nameAr,
            )}
          </Link>
        </FieldRow>
        <FieldRow label={t("applications.detail.level")}>
          {tCatalog(`levels.${program.studyLevel}`)}
        </FieldRow>
      </dl>
    </Panel>
  );
}
