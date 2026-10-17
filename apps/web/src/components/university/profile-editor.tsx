"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  FileText,
  Images,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { ImageField } from "@/components/admin/image-field";
import { ToastProvider, notePendingChange, useToast } from "@/components/admin/toast";
import {
  CONTENT_SECTIONS,
  MAX_SECTIONS_PER_UNIVERSITY,
  MAX_SECTION_BODY,
  MAX_SECTION_TITLE,
  type ContentSectionKind,
} from "@/lib/content-blocks";
import { cn } from "@/lib/utils";

export type EditableProgram = {
  id: string;
  name: string;
  nameAr: string | null;
  tuitionFee: number | null;
  tuitionPeriod: "YEAR" | "TERM" | "TOTAL";
  currency: string;
  minGradePercent: number | null;
  isPublished: boolean;
};

export type EditableSection = {
  id: string;
  section: ContentSectionKind;
  title: string | null;
  titleAr: string | null;
  body: string;
  bodyAr: string | null;
  sortOrder: number;
};

export type EditableUniversity = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  acronym: string | null;
  type: "NATIONAL" | "PRIVATE";
  city: string;
  cityAr: string | null;
  addressLine: string | null;
  addressLineAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  establishedYear: number | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  images: { id: string; url: string; alt: string | null }[];
  contentBlocks: EditableSection[];
  faculties: { id: string; name: string; nameAr: string | null; programs: EditableProgram[] }[];
};

type Mode = "direct" | "review";
type Section = "details" | "sections" | "photos" | "programs" | "faculties";

export const EDIT_PROGRAM_EVENT = "unilink:edit-program";
export const EDIT_SECTIONS_EVENT = "unilink:edit-sections";

const INPUT =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] text-[#0F172A] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/15";
const LABEL = "mb-1 block text-[12.5px] font-semibold text-[#334155]";

/** Sends one write; a 202 means it went to the review queue. */
async function write(url: string, method: "PATCH" | "POST" | "DELETE", body?: unknown) {
  const response = await fetch(url, {
    method,
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  }).catch(() => null);
  const payload = (await response?.json().catch(() => null)) as { error?: string; pending?: boolean } | null;
  if (response?.status === 202 && payload?.pending) notePendingChange();
  return { ok: Boolean(response?.ok), pending: response?.status === 202, error: payload?.error ?? null };
}

/**
 * Edit a university from its own public profile. Super admins' changes go
 * live at once; a university admin's go to the review queue (the same admin
 * API decides, see lib/admin-changes.ts).
 */
export function ProfileEditor(props: { university: EditableUniversity; mode: Mode; pendingCount: number; startOpen: boolean }) {
  return (
    <ToastProvider>
      <ProfileEditorInner {...props} />
    </ToastProvider>
  );
}

function ProfileEditorInner({
  university,
  mode,
  pendingCount,
  startOpen,
}: {
  university: EditableUniversity;
  mode: Mode;
  pendingCount: number;
  startOpen: boolean;
}) {
  const t = useTranslations("ProfileEditor");
  const [open, setOpen] = useState(startOpen);
  const [section, setSection] = useState<Section>("details");
  const [focusProgram, setFocusProgram] = useState<string | null>(null);

  useEffect(() => {
    function onEditProgram(event: Event) {
      const id = (event as CustomEvent<{ id: string }>).detail?.id;
      if (!id) return;
      setFocusProgram(id);
      setSection("programs");
      setOpen(true);
    }
    function onEditSections() {
      setSection("sections");
      setOpen(true);
    }
    window.addEventListener(EDIT_PROGRAM_EVENT, onEditProgram);
    window.addEventListener(EDIT_SECTIONS_EVENT, onEditSections);
    return () => {
      window.removeEventListener(EDIT_PROGRAM_EVENT, onEditProgram);
      window.removeEventListener(EDIT_SECTIONS_EVENT, onEditSections);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const sections: { key: Section; label: string; icon: typeof Settings2 }[] = [
    { key: "details", label: t("sections.details"), icon: Settings2 },
    { key: "sections", label: t("sections.sections"), icon: FileText },
    { key: "photos", label: t("sections.photos"), icon: Images },
    { key: "programs", label: t("sections.programs"), icon: Pencil },
    { key: "faculties", label: t("sections.faculties"), icon: Layers },
  ];

  return (
    <>
      {/* The admin bar: always there for someone who can edit this page. */}
      <div className="fixed inset-x-0 bottom-[calc(var(--ul-bottom-nav,0px)+0.75rem)] z-40 flex justify-center px-4 print:hidden">
        <div className="flex max-w-full items-center gap-2 rounded-full bg-[#0B1220] py-1.5 ps-4 pe-1.5 text-white shadow-[0_12px_32px_-12px_rgba(11,18,32,0.6)]">
          <span className="truncate text-[13px] font-semibold">{mode === "direct" ? t("bar.direct") : t("bar.review")}</span>
          {mode === "review" && pendingCount > 0 ? (
            <span className="shrink-0 rounded-full bg-[#F5A524] px-2 py-0.5 text-[11.5px] font-bold text-[#0B1220]">
              {t("bar.pending", { count: pendingCount })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-[#0B1220] hover:bg-slate-100"
          >
            <Pencil className="size-3.5" aria-hidden />
            {t("bar.edit")}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t("title")}>
          <button type="button" tabIndex={-1} aria-hidden className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 end-0 flex w-[min(600px,100vw)] flex-col bg-[#F7F8FA] shadow-2xl">
            <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#1E6DEB]">{t("title")}</p>
                <h2 className="truncate text-[17px] font-semibold text-[#0F172A]">{university.name}</h2>
                <p className={cn("mt-1 text-[12.5px]", mode === "direct" ? "text-[#0F7B45]" : "text-[#B77714]")}>
                  {mode === "direct" ? t("directNote") : t("reviewNote")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>

            <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3" aria-label={t("title")}>
              {sections.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setSection(entry.key)}
                  aria-current={section === entry.key ? "page" : undefined}
                  className={cn(
                    "-mb-px inline-flex min-h-11 shrink-0 items-center gap-1.5 border-b-2 px-3 text-[13px] font-semibold",
                    section === entry.key ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
                  )}
                >
                  <entry.icon className="size-4" aria-hidden />
                  {entry.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 overflow-y-auto p-5">
              {section === "details" ? <DetailsSection university={university} /> : null}
              {section === "sections" ? <SectionsSection university={university} /> : null}
              {section === "photos" ? <PhotosSection university={university} /> : null}
              {section === "programs" ? <ProgramsSection university={university} focus={focusProgram} /> : null}
              {section === "faculties" ? <FacultiesSection university={university} mode={mode} /> : null}
            </div>

            <footer className="border-t border-slate-200 bg-white px-5 py-3">
              <Link
                href={`/admin/universities/${university.id}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1E6DEB] hover:underline"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                {t("openConsole")}
              </Link>
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function useSaver() {
  const t = useTranslations("ProfileEditor");
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  // One write at a time: a double click must not send the same change twice.
  // A ref, not the state, because both clicks can land before a re-render.
  const inFlight = useRef(false);
  async function save(key: string, url: string, method: "PATCH" | "POST" | "DELETE", body?: unknown) {
    if (inFlight.current) return false;
    inFlight.current = true;
    setBusy(key);
    const result = await write(url, method, body);
    inFlight.current = false;
    setBusy(null);
    if (!result.ok) {
      toast({ title: result.error ?? t("saveFailed"), tone: "error" });
      return false;
    }
    toast({ title: t("saved") });
    router.refresh();
    return true;
  }
  return { busy, save };
}

function SaveButton({ busy, disabled, onClick, label }: { busy: boolean; disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-4 text-[13.5px] font-semibold text-white hover:bg-[#1859c4] disabled:opacity-50"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
      {label}
    </button>
  );
}

const DETAIL_FIELDS = [
  ["name", "ltr"],
  ["nameAr", "rtl"],
  ["acronym", "ltr"],
  ["city", "ltr"],
  ["cityAr", "rtl"],
  ["addressLine", "ltr"],
  ["addressLineAr", "rtl"],
  ["establishedYear", "ltr"],
  ["websiteUrl", "ltr"],
  ["googleMapsUrl", "ltr"],
] as const;

function DetailsSection({ university }: { university: EditableUniversity }) {
  const t = useTranslations("ProfileEditor");
  const tCatalog = useTranslations("Catalog");
  const { busy, save } = useSaver();
  const initial = useMemo(
    () => ({
      name: university.name,
      nameAr: university.nameAr ?? "",
      acronym: university.acronym ?? "",
      type: university.type,
      city: university.city,
      cityAr: university.cityAr ?? "",
      addressLine: university.addressLine ?? "",
      addressLineAr: university.addressLineAr ?? "",
      establishedYear: university.establishedYear == null ? "" : String(university.establishedYear),
      websiteUrl: university.websiteUrl ?? "",
      googleMapsUrl: university.googleMapsUrl ?? "",
      description: university.description ?? "",
      descriptionAr: university.descriptionAr ?? "",
    }),
    [university],
  );
  const [form, setForm] = useState(initial);
  const changed = (Object.keys(form) as (keyof typeof form)[]).filter((key) => form[key] !== initial[key]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {DETAIL_FIELDS.map(([key, dir]) => (
          <label key={key} className={cn("block", key === "websiteUrl" || key === "googleMapsUrl" ? "sm:col-span-2" : undefined)}>
            <span className={LABEL}>{t(`fields.${key}`)}</span>
            <input
              dir={dir}
              type={key === "establishedYear" ? "number" : "text"}
              value={form[key]}
              onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))}
              className={INPUT}
            />
          </label>
        ))}
        <label className="block">
          <span className={LABEL}>{t("fields.type")}</span>
          <select
            value={form.type}
            onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value as "NATIONAL" | "PRIVATE" }))}
            className={INPUT}
          >
            <option value="NATIONAL">{tCatalog("universityTypes.NATIONAL")}</option>
            <option value="PRIVATE">{tCatalog("universityTypes.PRIVATE")}</option>
          </select>
        </label>
      </div>
      {(["description", "descriptionAr"] as const).map((key) => (
        <label key={key} className="block">
          <span className={LABEL}>{t(`fields.${key}`)}</span>
          <textarea
            dir={key === "descriptionAr" ? "rtl" : "ltr"}
            rows={5}
            maxLength={2000}
            value={form[key]}
            onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] leading-6 outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/15"
          />
        </label>
      ))}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <p className="text-[12.5px] text-[#64748B]">{changed.length ? t("changedFields", { count: changed.length }) : t("noChanges")}</p>
        <SaveButton
          busy={busy === "details"}
          disabled={!changed.length}
          label={t("save")}
          onClick={() =>
            void save(
              "details",
              `/api/admin/universities/${university.id}`,
              "PATCH",
              Object.fromEntries(
                changed.map((key) => [key, key === "establishedYear" ? (form[key] ? Number(form[key]) : null) : form[key] || null]),
              ),
            )
          }
        />
      </div>
    </div>
  );
}

function PhotosSection({ university }: { university: EditableUniversity }) {
  const t = useTranslations("ProfileEditor");
  const { busy, save } = useSaver();
  const [cover, setCover] = useState(university.coverImageUrl);
  const [logo, setLogo] = useState(university.logoUrl);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const brandingChanged = cover !== university.coverImageUrl || logo !== university.logoUrl;

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">{t("photos.branding")}</h3>
        <ImageField label={t("photos.cover")} value={cover} onChange={setCover} folder="universities" aspect="wide" />
        <ImageField label={t("photos.logo")} value={logo} onChange={setLogo} folder="universities" aspect="square" />
        <div className="flex justify-end">
          <SaveButton
            busy={busy === "branding"}
            disabled={!brandingChanged}
            label={t("save")}
            onClick={() => void save("branding", `/api/admin/universities/${university.id}`, "PATCH", { coverImageUrl: cover, logoUrl: logo })}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">{t("photos.gallery", { count: university.images.length })}</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {university.images.map((image) => (
            <figure key={image.id} className="group relative overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void save(`delete-${image.id}`, `/api/admin/universities/${university.id}/images/${image.id}`, "DELETE")}
                aria-label={t("photos.remove")}
                className="absolute end-1.5 top-1.5 flex size-8 items-center justify-center rounded-full bg-white/95 text-[#C81F15] shadow-sm hover:bg-white"
              >
                {busy === `delete-${image.id}` ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
              </button>
            </figure>
          ))}
        </div>
        <ImageField label={t("photos.add")} value={newPhoto} onChange={setNewPhoto} folder="universities" aspect="video" />
        <div className="flex justify-end">
          <SaveButton
            busy={busy === "add"}
            disabled={!newPhoto}
            label={t("photos.addButton")}
            onClick={async () => {
              const ok = await save("add", `/api/admin/universities/${university.id}/images`, "POST", {
                url: newPhoto,
                alt: `${university.name} campus`,
              });
              if (ok) setNewPhoto(null);
            }}
          />
        </div>
      </section>
    </div>
  );
}

function ProgramsSection({ university, focus }: { university: EditableUniversity; focus: string | null }) {
  const t = useTranslations("ProfileEditor");
  const locale = useLocale();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`edit-program-${focus}`)?.scrollIntoView({ block: "center" });
  }, [focus]);

  const q = query.trim().toLowerCase();
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("programs.search")}
          className={cn(INPUT, "ps-9")}
        />
      </div>
      {university.faculties.map((faculty) => {
        const programs = faculty.programs.filter(
          (program) => !q || `${program.name} ${program.nameAr ?? ""}`.toLowerCase().includes(q) || program.id === focus,
        );
        if (!programs.length) return null;
        return (
          <section key={faculty.id}>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
              {locale === "ar" ? (faculty.nameAr ?? faculty.name) : faculty.name}
            </h3>
            <div className="space-y-2">
              {programs.map((program) => (
                <ProgramRow key={program.id} program={program} highlighted={program.id === focus} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ProgramRow({ program, highlighted }: { program: EditableProgram; highlighted: boolean }) {
  const t = useTranslations("ProfileEditor");
  const { busy, save } = useSaver();
  const initial = useMemo(
    () => ({
      name: program.name,
      nameAr: program.nameAr ?? "",
      tuitionFee: program.tuitionFee == null ? "" : String(program.tuitionFee),
      tuitionPeriod: program.tuitionPeriod,
      minGradePercent: program.minGradePercent == null ? "" : String(program.minGradePercent),
      isPublished: program.isPublished,
    }),
    [program],
  );
  const [form, setForm] = useState(initial);
  const changed = (Object.keys(form) as (keyof typeof form)[]).filter((key) => form[key] !== initial[key]);

  return (
    <div
      id={`edit-program-${program.id}`}
      className={cn("rounded-xl border bg-white p-3", highlighted ? "border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20" : "border-slate-200")}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <input aria-label={t("fields.programName")} dir="ltr" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} />
        <input aria-label={t("fields.programNameAr")} dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className={INPUT} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="block">
          <span className={LABEL}>{t("fields.fee")}</span>
          <input type="number" min={0} value={form.tuitionFee} onChange={(e) => setForm({ ...form, tuitionFee: e.target.value })} className={cn(INPUT, "tabular-nums")} />
        </label>
        <label className="block">
          <span className={LABEL}>{t("fields.period")}</span>
          <select value={form.tuitionPeriod} onChange={(e) => setForm({ ...form, tuitionPeriod: e.target.value as EditableProgram["tuitionPeriod"] })} className={INPUT}>
            {(["YEAR", "TERM", "TOTAL"] as const).map((value) => (
              <option key={value} value={value}>
                {t(`periods.${value}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={LABEL}>{t("fields.minGrade")}</span>
          <input type="number" min={0} max={100} value={form.minGradePercent} onChange={(e) => setForm({ ...form, minGradePercent: e.target.value })} className={cn(INPUT, "tabular-nums")} />
        </label>
        <label className="flex items-end gap-2 pb-2.5 text-[13px] font-semibold text-[#334155]">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="size-4 accent-[#1E6DEB]" />
          {t("fields.published")}
        </label>
      </div>
      {changed.length ? (
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={() => setForm(initial)} className="min-h-9 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] hover:bg-slate-100">
            {t("reset")}
          </button>
          <SaveButton
            busy={busy === "program"}
            label={t("save")}
            onClick={() =>
              void save(
                "program",
                `/api/admin/programs/${program.id}`,
                "PATCH",
                Object.fromEntries(
                  changed.map((key) => {
                    const value = form[key];
                    if (key === "tuitionFee" || key === "minGradePercent") return [key, value === "" ? null : Number(value)];
                    if (key === "nameAr") return [key, value || null];
                    return [key, value];
                  }),
                ),
              )
            }
          />
        </div>
      ) : null}
    </div>
  );
}

function FacultiesSection({ university, mode }: { university: EditableUniversity; mode: Mode }) {
  const t = useTranslations("ProfileEditor");
  const { busy, save } = useSaver();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-dashed border-[#1E6DEB]/40 bg-white p-4">
        <h3 className="flex items-center gap-1.5 text-[14px] font-semibold text-[#0F172A]">
          <Plus className="size-4 text-[#1E6DEB]" aria-hidden />
          {t("faculties.add")}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <input aria-label={t("fields.facultyName")} placeholder={t("fields.facultyName")} dir="ltr" maxLength={200} value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          <input aria-label={t("fields.facultyNameAr")} placeholder={t("fields.facultyNameAr")} dir="rtl" maxLength={200} value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={INPUT} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-[#64748B]">{mode === "direct" ? t("faculties.addHintDirect") : t("faculties.addHintReview")}</p>
          <SaveButton
            busy={busy === "add-faculty"}
            disabled={!name.trim()}
            label={t("faculties.addButton")}
            onClick={async () => {
              const ok = await save("add-faculty", "/api/admin/faculties", "POST", {
                universityId: university.id,
                name: name.trim(),
                nameAr: nameAr.trim() || null,
              });
              if (ok) {
                setName("");
                setNameAr("");
              }
            }}
          />
        </div>
      </section>

      <div className="space-y-2">
        {university.faculties.map((faculty) => (
          <FacultyRow key={faculty.id} faculty={faculty} universityId={university.id} />
        ))}
      </div>
    </div>
  );
}

function FacultyRow({ faculty, universityId }: { faculty: EditableUniversity["faculties"][number]; universityId: string }) {
  const t = useTranslations("ProfileEditor");
  const { busy, save } = useSaver();
  const [name, setName] = useState(faculty.name);
  const [nameAr, setNameAr] = useState(faculty.nameAr ?? "");
  const dirty = name !== faculty.name || nameAr !== (faculty.nameAr ?? "");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input aria-label={t("fields.facultyName")} dir="ltr" value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
        <input aria-label={t("fields.facultyNameAr")} dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={INPUT} />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[12px] text-[#94A3B8]">{t("faculties.programs", { count: faculty.programs.length })}</p>
        <Link
          href={`/admin/programs/new?universityId=${encodeURIComponent(universityId)}&facultyId=${encodeURIComponent(faculty.id)}`}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1E6DEB] hover:underline"
        >
          <Plus className="size-3.5" aria-hidden />
          {t("faculties.addProgram")}
        </Link>
      </div>
      {dirty ? (
        <div className="mt-2 flex justify-end">
          <SaveButton
            busy={busy === "faculty"}
            label={t("save")}
            onClick={() =>
              void save("faculty", `/api/admin/faculties/${faculty.id}`, "PATCH", {
                ...(name !== faculty.name ? { name } : {}),
                ...(nameAr !== (faculty.nameAr ?? "") ? { nameAr: nameAr || null } : {}),
              })
            }
          />
        </div>
      ) : null}
    </div>
  );
}

const TEXTAREA =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] leading-6 outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/15";

type SectionForm = { section: ContentSectionKind; title: string; titleAr: string; body: string; bodyAr: string };

function formOf(block: EditableSection | null): SectionForm {
  return {
    section: block?.section ?? "ABOUT_EXTRA",
    title: block?.title ?? "",
    titleAr: block?.titleAr ?? "",
    body: block?.body ?? "",
    bodyAr: block?.bodyAr ?? "",
  };
}

/** The fields of one section, shared by the add form and each existing section. */
function SectionFields({ form, onChange }: { form: SectionForm; onChange: (next: SectionForm) => void }) {
  const t = useTranslations("ProfileEditor");
  return (
    <div className="space-y-3">
      <label className="block">
        <span className={LABEL}>{t("sectionsTab.kind")}</span>
        <select
          value={form.section}
          onChange={(event) => onChange({ ...form, section: event.target.value as ContentSectionKind })}
          className={INPUT}
        >
          {CONTENT_SECTIONS.map((kind) => (
            <option key={kind} value={kind}>
              {t(`sectionsTab.kinds.${kind}`)}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>{t("sectionsTab.title")}</span>
          <input dir="ltr" maxLength={MAX_SECTION_TITLE} value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} className={INPUT} />
        </label>
        <label className="block">
          <span className={LABEL}>{t("sectionsTab.titleAr")}</span>
          <input dir="rtl" maxLength={MAX_SECTION_TITLE} value={form.titleAr} onChange={(e) => onChange({ ...form, titleAr: e.target.value })} className={INPUT} />
        </label>
      </div>
      <label className="block">
        <span className={LABEL}>{t("sectionsTab.body")}</span>
        <textarea dir="ltr" rows={6} maxLength={MAX_SECTION_BODY} value={form.body} onChange={(e) => onChange({ ...form, body: e.target.value })} className={TEXTAREA} />
      </label>
      <label className="block">
        <span className={LABEL}>{t("sectionsTab.bodyAr")}</span>
        <textarea dir="rtl" rows={6} maxLength={MAX_SECTION_BODY} value={form.bodyAr} onChange={(e) => onChange({ ...form, bodyAr: e.target.value })} className={TEXTAREA} />
      </label>
      <p className="text-[12px] leading-5 text-[#64748B]">{t("sectionsTab.formatHint")}</p>
    </div>
  );
}

function SectionsSection({ university }: { university: EditableUniversity }) {
  const t = useTranslations("ProfileEditor");
  const { busy, save } = useSaver();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<SectionForm>(() => formOf(null));
  const blocks = university.contentBlocks;
  const full = blocks.length >= MAX_SECTIONS_PER_UNIVERSITY;
  const base = `/api/admin/universities/${university.id}/content-blocks`;

  // Within a kind, sections show in sortOrder. Moving one swaps it with its
  // neighbour, then numbers the kind 0, 1, 2... and saves only the sections
  // whose number changed (usually two; more once, for older rows that all
  // share position 0).
  async function move(block: EditableSection, direction: -1 | 1) {
    const order = blocks.filter((entry) => entry.section === block.section);
    const index = order.findIndex((entry) => entry.id === block.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    for (const [position, entry] of order.entries()) {
      if (entry.sortOrder === position) continue;
      const ok = await save(`move-${entry.id}`, `${base}/${entry.id}`, "PATCH", { sortOrder: position });
      if (!ok) return;
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-6 text-[#475569]">{t("sectionsTab.intro")}</p>

      {adding ? (
        <section className="space-y-3 rounded-xl border border-[#1E6DEB]/40 bg-white p-4">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">{t("sectionsTab.new")}</h3>
          <SectionFields form={draft} onChange={setDraft} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraft(formOf(null));
              }}
              className="min-h-10 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] hover:bg-slate-100"
            >
              {t("sectionsTab.cancel")}
            </button>
            <SaveButton
              busy={busy === "add-section"}
              disabled={!draft.body.trim()}
              label={t("sectionsTab.addButton")}
              onClick={async () => {
                const ok = await save("add-section", base, "POST", {
                  section: draft.section,
                  title: draft.title.trim() || null,
                  titleAr: draft.titleAr.trim() || null,
                  body: draft.body,
                  bodyAr: draft.bodyAr.trim() || null,
                });
                if (ok) {
                  setAdding(false);
                  setDraft(formOf(null));
                }
              }}
            />
          </div>
        </section>
      ) : (
        <button
          type="button"
          disabled={full}
          onClick={() => setAdding(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E6DEB]/50 bg-white text-[14px] font-semibold text-[#1E6DEB] hover:bg-[#EEF3FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden />
          {full ? t("sectionsTab.full", { max: MAX_SECTIONS_PER_UNIVERSITY }) : t("sectionsTab.add")}
        </button>
      )}

      {blocks.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-[13px] text-[#64748B]">{t("sectionsTab.empty")}</p>
      ) : (
        CONTENT_SECTIONS.map((kind) => {
          const ofKind = blocks.filter((block) => block.section === kind);
          if (!ofKind.length) return null;
          return (
            <section key={kind} className="space-y-2">
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">{t(`sectionsTab.kinds.${kind}`)}</h3>
              {ofKind.map((block, index) => (
                <SectionRow
                  key={block.id}
                  block={block}
                  base={base}
                  busy={busy}
                  save={save}
                  canMoveUp={index > 0}
                  canMoveDown={index < ofKind.length - 1}
                  onMove={(direction) => void move(block, direction)}
                />
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}

function SectionRow({
  block,
  base,
  busy,
  save,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  block: EditableSection;
  base: string;
  busy: string | null;
  save: ReturnType<typeof useSaver>["save"];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  const t = useTranslations("ProfileEditor");
  const initial = useMemo(() => formOf(block), [block]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  const changed = (Object.keys(form) as (keyof SectionForm)[]).filter((key) => form[key] !== initial[key]);
  const iconButton =
    "flex size-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-1 px-3 py-2.5">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="min-w-0 flex-1 text-start">
          <span className="block truncate text-[14px] font-semibold text-[#0F172A]">{block.title || t("sectionsTab.untitled")}</span>
          <span className="block truncate text-[12px] text-[#64748B]">{block.body.slice(0, 120)}</span>
        </button>
        <button type="button" disabled={!canMoveUp || busy !== null} onClick={() => onMove(-1)} aria-label={t("sectionsTab.moveUp")} className={iconButton}>
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <button type="button" disabled={!canMoveDown || busy !== null} onClick={() => onMove(1)} aria-label={t("sectionsTab.moveDown")} className={iconButton}>
          <ArrowDown className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => setOpen(!open)} aria-label={t("sectionsTab.edit")} className={iconButton}>
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => {
            if (window.confirm(t("sectionsTab.confirmDelete"))) void save(`delete-${block.id}`, `${base}/${block.id}`, "DELETE");
          }}
          aria-label={t("sectionsTab.delete")}
          className={cn(iconButton, "text-[#C81F15] hover:bg-[#FFF0EE] hover:text-[#C81F15]")}
        >
          {busy === `delete-${block.id}` ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
        </button>
      </div>
      {open ? (
        <div className="space-y-3 border-t border-slate-100 p-3">
          <SectionFields form={form} onChange={setForm} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setForm(initial)}
              disabled={!changed.length}
              className="min-h-10 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] hover:bg-slate-100 disabled:opacity-40"
            >
              {t("reset")}
            </button>
            <SaveButton
              busy={busy === `section-${block.id}`}
              disabled={!changed.length || !form.body.trim()}
              label={t("save")}
              onClick={() =>
                void save(
                  `section-${block.id}`,
                  `${base}/${block.id}`,
                  "PATCH",
                  Object.fromEntries(
                    changed.map((key) => [key, key === "section" || key === "body" ? form[key] : form[key].trim() || null]),
                  ),
                )
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** On the "More info" tab, for editors: opens the editor at its sections. */
export function ManageSectionsButton() {
  const t = useTranslations("ProfileEditor");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EDIT_SECTIONS_EVENT))}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E6DEB]/50 px-4 text-[14px] font-bold text-[#1E6DEB] hover:bg-[#EEF3FF]"
    >
      <Plus className="size-4" aria-hidden />
      {t("sectionsTab.manage")}
    </button>
  );
}

/** "Edit" on a program's detail popup, for admins: opens the editor at it. */
export function EditProgramButton({ programId }: { programId: string }) {
  const t = useTranslations("ProfileEditor");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(EDIT_PROGRAM_EVENT, { detail: { id: programId } }))}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E6DEB]/50 px-5 text-base font-bold text-[#1E6DEB] hover:bg-[#EEF3FF]"
    >
      <Pencil className="size-4" aria-hidden />
      {t("editProgram")}
    </button>
  );
}
