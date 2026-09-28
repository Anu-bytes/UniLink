"use client";

import { BookOpen, Loader2, MapPin, Percent, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { FacultySaveButton } from "@/components/app/faculty-save-button";
import { ProgramCard } from "@/components/app/program-card";
import { UniversityLogo } from "@/components/university-logo";
import type { FacultyResult } from "@/lib/faculty-search";
import { formatMoney, formatNumber } from "@/lib/format";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import type { ProgramResult } from "@/lib/program-search";

type FacultyDetail = {
  faculty: FacultyResult;
  programs: ProgramResult[];
  hasProfile: boolean;
};

/**
 * "Explore programs" opens this instead of navigating to
 * /app/faculties/[facultyId]: same content (the API route behind it calls the
 * same lib functions that page does), shown in place. Fetched on open rather
 * than pre-rendered per card — a results page can list dozens of faculties,
 * and precomputing full detail (programs, match scores) for every one of
 * them up front would multiply the query load for cards nobody opens.
 */
export function FacultyDialog({
  facultyId,
  trigger,
}: {
  facultyId: string;
  trigger: React.ReactNode;
}) {
  const t = useTranslations("FacultySearch");
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<FacultyDetail | null>(null);
  const [failed, setFailed] = useState(false);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open || loadedFor.current === facultyId) return;
    let cancelled = false;
    setFailed(false);

    fetch(`/api/faculties/${facultyId}?locale=${locale}`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<FacultyDetail>;
      })
      .then((result) => {
        if (cancelled) return;
        loadedFor.current = facultyId;
        setData(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, facultyId, locale]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/cta inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#1E6DEB] text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        {trigger}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[90vh] w-[min(94vw,64rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 text-[#1F2A44] shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <div className="relative p-5 pt-14 md:p-8 md:pt-14">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full bg-slate-100 text-[#5a6072] transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <X className="size-4" aria-hidden />
            </button>

            {data ? (
              <FacultyDialogContent
                faculty={data.faculty}
                programs={data.programs}
                hasProfile={data.hasProfile}
              />
            ) : failed ? (
              <p className="py-16 text-center text-sm text-[#5a6072]">
                {t("loadError")}
              </p>
            ) : (
              <div className="flex items-center justify-center gap-2 py-16 text-sm font-semibold text-[#5a6072]">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t("loading")}
              </div>
            )}
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function FacultyDialogContent({
  faculty,
  programs,
  hasProfile,
}: {
  faculty: FacultyResult;
  programs: ProgramResult[];
  hasProfile: boolean;
}) {
  const t = useTranslations("FacultySearch");
  const tSearch = useTranslations("Search");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const disciplineLabels = faculty.disciplines.map((value) => {
    const field = FIELDS_OF_STUDY.find((entry) => entry.value === value);
    if (!field) return value;
    return isArabic ? field.ar : field.en;
  });

  const from = formatMoney(locale, faculty.tuitionFrom, faculty.currency);
  const to = formatMoney(locale, faculty.tuitionTo, faculty.currency);

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <UniversityLogo
          name={faculty.university.name}
          logoUrl={faculty.university.logoUrl}
          className="size-14"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
            {faculty.name}
          </h2>
          <Link
            href={`/universities/${faculty.university.slug}`}
            className="mt-1 inline-block text-sm font-semibold text-[#1E6DEB] hover:underline"
          >
            {faculty.university.name}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5a6072]">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {faculty.university.city}, {faculty.university.country}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <FacultySaveButton facultyId={faculty.id} initialSaved={faculty.saved} />
        </div>
      </div>

      {faculty.description ? (
        <p className="mt-4 text-base leading-7 text-[#5a6072]">
          {faculty.description}
        </p>
      ) : null}

      <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
            <BookOpen className="size-3.5" aria-hidden />
            {t("programs")}
          </dt>
          <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
            {formatNumber(locale, faculty.programCount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
            {t("tuitionRange")}
          </dt>
          <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
            {from && to && faculty.tuitionFrom !== faculty.tuitionTo
              ? `${from} - ${to}`
              : (from ?? tSearch("card.notSpecified"))}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
            <Percent className="size-3.5" aria-hidden />
            {t("minGrade")}
          </dt>
          <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
            {faculty.minGradePercent != null
              ? `${formatNumber(locale, faculty.minGradePercent)}${tCatalog("units.PERCENT")}`
              : tSearch("card.notSpecified")}
          </dd>
        </div>
      </dl>

      {disciplineLabels.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {disciplineLabels.map((label) => (
            <li
              key={label}
              className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-semibold text-[#1E3A8A]"
            >
              {label}
            </li>
          ))}
        </ul>
      ) : null}

      <section className="mt-8">
        <h3 className="text-lg font-bold text-[#1F2A44] md:text-xl">
          {t("programsInFaculty")}
        </h3>
        <p className="mt-1 text-sm text-[#5a6072]">
          {hasProfile ? t("programsSubtitle") : t("programsSubtitleNoProfile")}
        </p>

        {programs.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-[#F5F8FF] px-6 py-14 text-center">
            <p className="text-sm text-[#5a6072]">{t("noPrograms")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
