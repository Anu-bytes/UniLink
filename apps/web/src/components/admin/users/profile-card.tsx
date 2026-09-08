import { ClipboardList, Lock } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/admin";
import { countryName, flagEmoji, flagSrc } from "@/lib/countries";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatNumber } from "@/lib/format";

import { FieldRow, NotSet, Panel } from "./panel";
import type { UserProfile } from "./types";

/** Flag as an image when we ship one, otherwise the emoji. */
function Flag({ code }: { code: string }) {
  const src = flagSrc(code);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="inline-block h-3.5 w-5 rounded-sm object-cover" />;
  }
  return <span aria-hidden>{flagEmoji(code)}</span>;
}

/** A field the student picked before we renamed it still has to render as something. */
function fieldLabel(value: string, locale: string) {
  const option = FIELDS_OF_STUDY.find((entry) => entry.value === value);
  if (!option) return value;
  return locale === "ar" ? option.ar : option.en;
}

/**
 * Years are rendered as plain digits rather than through formatNumber: a
 * grouped 2,027 is not a year, and the helper's separator is exactly what the
 * rest of the console wants it for.
 */
function year(value: number) {
  return String(value);
}

export async function ProfileCard({ profile }: { profile: UserProfile | null }) {
  const t = await getTranslations("Admin.users.profile");
  const tCommon = await getTranslations("Admin.common");
  const tLevel = await getTranslations("Catalog.levels");
  const tSystem = await getTranslations("Catalog.systems");
  const tTest = await getTranslations("Catalog.englishTests");
  const tSeason = await getTranslations("Catalog.seasons");
  const tBudget = await getTranslations("Admin.enums.budgetBands");
  const locale = await getLocale();

  if (!profile) {
    return (
      <Panel title={t("title")}>
        <EmptyState
          icon={ClipboardList}
          title={t("empty.title")}
          description={t("empty.description")}
        />
      </Panel>
    );
  }

  return (
    <Panel title={t("title")}>
      {/* The wizard's answers are what the matching engine scores against, so
          an admin quietly correcting a graduation year here would move the
          student's recommendations without the student ever knowing. */}
      <p className="mb-5 flex gap-2.5 rounded-lg bg-[#EAF2FE] p-3.5 text-[13px] leading-relaxed text-[#1E6DEB]">
        <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>{t("readOnlyNote")}</span>
      </p>

      <dl>
        <FieldRow label={t("studyLevel")}>{tLevel(profile.studyLevel)}</FieldRow>

        <FieldRow label={t("system")}>
          {profile.highSchoolSystem === "OTHER" && profile.highSchoolSystemOther
            ? profile.highSchoolSystemOther
            : tSystem(profile.highSchoolSystem)}
        </FieldRow>

        <FieldRow label={t("graduationYear")}>
          <span className="tabular-nums">{year(profile.graduationYear)}</span>
        </FieldRow>

        <FieldRow label={t("grade")}>{profile.gradeValue}</FieldRow>

        <FieldRow label={t("englishTest")}>{tTest(profile.englishTest)}</FieldRow>

        {profile.englishScore != null ? (
          <FieldRow label={t("englishScore")}>
            <span className="tabular-nums">
              {formatNumber(locale, profile.englishScore)}
            </span>
          </FieldRow>
        ) : null}

        <FieldRow label={t("nationality")}>
          <span className="inline-flex items-center gap-1.5">
            <Flag code={profile.nationality} />
            {countryName(profile.nationality, locale)}
          </span>
        </FieldRow>

        <FieldRow label={t("intake")}>
          {t("intakeValue", {
            season: tSeason(profile.intakeSeason),
            year: year(profile.intakeYear),
          })}
        </FieldRow>

        <FieldRow label={t("budget")}>{tBudget(profile.budgetBand)}</FieldRow>
      </dl>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[13px] text-[#64748B]">{t("fields")}</p>
        {profile.fieldsOfStudy.length === 0 ? (
          <p className="mt-2 text-[13.5px]">
            <NotSet label={tCommon("notSet")} />
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {profile.fieldsOfStudy.map((value) => (
              <li
                key={value}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[12.5px] font-medium text-[#334155]"
              >
                {fieldLabel(value, locale)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
