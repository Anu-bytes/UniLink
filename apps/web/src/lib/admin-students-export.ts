// The student leads export behind /admin/users: one row per student or parent
// account with the contact details and onboarding answers a university needs
// to follow up, nationality and country of residence included. Super admins
// only (see app/api/admin/users/export/route.ts).

import { getTranslations } from "next-intl/server";

import { countryName } from "@/lib/countries";
import { cityLabel } from "@/lib/egypt-governorates";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { prisma } from "@/lib/prisma";
import { buildWorkbook, columnName, type Cell, type CellStyle } from "@/lib/xlsx";

const TZ = "Africa/Cairo";

const zebra = (r: number, even: CellStyle, odd: CellStyle) => (r % 2 ? odd : even);

export async function buildStudentsWorkbook(locale: "en" | "ar") {
  const t = await getTranslations({ locale, namespace: "Admin.users.export" });
  const tRole = await getTranslations({ locale, namespace: "Admin.enums.userRoles" });
  const tSystem = await getTranslations({ locale, namespace: "Catalog.systems" });
  const tBudget = await getTranslations({ locale, namespace: "Admin.enums.budgetBands" });
  const rtl = locale === "ar";

  const users = await prisma.user.findMany({
    where: { role: { in: ["STUDENT", "PARENT"] } },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: {
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      studentProfile: {
        select: {
          nationality: true,
          residenceCountry: true,
          city: true,
          highSchoolSystem: true,
          highSchoolSystemOther: true,
          graduationYear: true,
          gradeValue: true,
          fieldsOfStudy: true,
          budgetBand: true,
        },
      },
    },
  });

  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", numberingSystem: "latn", timeZone: TZ });
  const field = (value: string) => {
    const option = FIELDS_OF_STUDY.find((entry) => entry.value === value);
    return option ? (rtl ? option.ar : option.en) : value;
  };

  const headers = [
    t("columns.name"),
    t("columns.role"),
    t("columns.email"),
    t("columns.phone"),
    t("columns.nationality"),
    t("columns.residenceCountry"),
    t("columns.city"),
    t("columns.certificate"),
    t("columns.graduationYear"),
    t("columns.grade"),
    t("columns.fields"),
    t("columns.budget"),
    t("columns.joined"),
  ];

  const rows: Cell[][] = users.map((user, r) => {
    const profile = user.studentProfile;
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || "";
    const certificate = profile
      ? profile.highSchoolSystem === "OTHER" && profile.highSchoolSystemOther
        ? profile.highSchoolSystemOther
        : tSystem(profile.highSchoolSystem)
      : "";
    const text = (value: string | number | null | undefined): Cell => ({
      value: value ?? null,
      style: zebra(r, "text", "textAlt"),
    });
    return [
      text(name),
      text(tRole(user.role)),
      text(user.email),
      text(user.phone),
      text(profile ? countryName(profile.nationality, locale) : null),
      text(profile?.residenceCountry ? countryName(profile.residenceCountry, locale) : null),
      text(profile ? cityLabel(profile.city, locale) : null),
      text(certificate),
      text(profile?.graduationYear ?? null),
      text(profile?.gradeValue),
      text(profile ? profile.fieldsOfStudy.map(field).join(rtl ? "، " : ", ") : null),
      text(profile ? tBudget(profile.budgetBand) : null),
      text(date.format(user.createdAt)),
    ];
  });

  const generated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short", numberingSystem: "latn", timeZone: TZ }).format(new Date());
  const last = columnName(headers.length - 1);
  const headerRow = 3;

  const sheet = {
    name: t("sheet"),
    columns: [24, 12, 30, 18, 18, 20, 18, 22, 14, 12, 36, 24, 16],
    rows: [
      [{ value: t("title"), style: "title" as const }],
      [{ value: t("generated", { date: generated, count: users.length }), style: "subtitle" as const }],
      headers.map((label, i) => ({ value: label, style: i === 0 ? ("headerStart" as const) : ("header" as const) })),
      ...rows,
    ],
    merges: [`A1:${last}1`, `A2:${last}2`],
    freeze: { rows: headerRow, columns: 1 },
    autoFilter: `A${headerRow}:${last}${headerRow + rows.length}`,
    heights: { 1: 34, 2: 22, 3: 28 },
    rightToLeft: rtl,
  };

  const stamp = new Date().toISOString().slice(0, 10);
  return {
    file: buildWorkbook([sheet], { title: t("title") }),
    filename: `unilink-students-${stamp}.xlsx`,
  };
}
