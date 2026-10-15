"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  ExternalLink,
  Loader2,
  Undo2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { Badge, type BadgeTone } from "@/components/admin/status-badge";
import { useToast } from "@/components/admin/toast";
import { When } from "@/components/admin/changes/when";
import type { ReviewField, ReviewItem } from "@/lib/admin-review";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<ReviewItem["action"], string> = {
  CREATE: "bg-[#E7F6EE] text-[#0F7B45]",
  UPDATE: "bg-[#EEF3FF] text-[#1E6DEB]",
  DELETE: "bg-[#FFF0EE] text-[#C81F15]",
};

const STATUS_TONE: Record<ReviewItem["status"], BadgeTone> = {
  PENDING: "amber",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "neutral",
};

const IMAGE_KEYS = new Set(["logoUrl", "coverImageUrl", "url", "imageUrl"]);
const LONG_TEXT = 140;

async function send(url: string, method: "PATCH" | "DELETE" | "POST", body?: unknown) {
  const response = await fetch(url, {
    method,
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  }).catch(() => null);
  const payload = (await response?.json().catch(() => null)) as Record<string, unknown> | null;
  return { ok: Boolean(response?.ok), payload };
}

/**
 * The review queue: one card per change, each showing exactly which fields
 * it touches (live value next to the proposed one). Reviewers approve or
 * reject, singly or in bulk; a university admin sees their own and can
 * withdraw one that is still waiting.
 */
export function ReviewList({
  items,
  canReview,
  canWithdraw,
}: {
  items: ReviewItem[];
  canReview: boolean;
  canWithdraw: boolean;
}) {
  const t = useTranslations("Admin.changes");
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState<"approve" | "reject" | null>(null);

  const pendingIds = items.filter((item) => item.status === "PENDING").map((item) => item.id);
  const bulkMode = canReview && pendingIds.length > 1;
  const allSelected = bulkMode && pendingIds.every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulk(decision: "approve" | "reject") {
    if (selected.size === 0) return;
    setBulkBusy(decision);
    const { ok, payload } = await send("/api/admin/changes/bulk", "POST", { ids: [...selected], decision });
    setBulkBusy(null);
    if (!ok) {
      toast({ title: t("failed"), tone: "error" });
      return;
    }
    const done = Number(payload?.done ?? 0);
    const failed = Array.isArray(payload?.failed) ? payload.failed.length : 0;
    toast({
      title: decision === "approve" ? t("bulkApproved", { count: done }) : t("bulkRejected", { count: done }),
      description: failed ? t("bulkFailed", { count: failed }) : undefined,
      tone: failed ? "error" : "success",
    });
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {bulkMode ? (
        <div className="sticky top-16 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-semibold text-[#334155]">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => setSelected(allSelected ? new Set() : new Set(pendingIds))}
              className="size-4 accent-[#1E6DEB]"
            />
            {t("selectAll")}
          </label>
          <span className="text-[13px] text-[#64748B]">{t("selected", { count: selected.size })}</span>
          <div className="ms-auto flex gap-2">
            <button
              type="button"
              disabled={selected.size === 0 || bulkBusy !== null}
              onClick={() => void bulk("reject")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#F5C2BD] px-3 text-[13px] font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE] disabled:opacity-50"
            >
              {bulkBusy === "reject" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <X className="size-4" aria-hidden />}
              {t("rejectSelected")}
            </button>
            <button
              type="button"
              disabled={selected.size === 0 || bulkBusy !== null}
              onClick={() => void bulk("approve")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#0F7B45] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0B6638] disabled:opacity-50"
            >
              {bulkBusy === "approve" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
              {t("approveSelected")}
            </button>
          </div>
        </div>
      ) : null}

      {items.map((item) => (
        <ChangeCard
          key={item.id}
          item={item}
          canReview={canReview}
          canWithdraw={canWithdraw}
          selectable={bulkMode && item.status === "PENDING"}
          selected={selected.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}

function ChangeCard({
  item,
  canReview,
  canWithdraw,
  selectable,
  selected,
  onToggle,
}: {
  item: ReviewItem;
  canReview: boolean;
  canWithdraw: boolean;
  selectable: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("Admin.changes");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState<"approve" | "reject" | "withdraw" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const universityName = locale === "ar" ? (item.university.nameAr ?? item.university.name) : item.university.name;
  const pending = item.status === "PENDING";
  const stale = item.fields.some((field) => field.stale);

  async function review(decision: "approve" | "reject") {
    setBusy(decision);
    const { ok, payload } = await send(`/api/admin/changes/${item.id}`, "PATCH", { decision, note: note.trim() || null });
    setBusy(null);
    if (!ok) {
      toast({ title: t("failed"), description: typeof payload?.error === "string" ? payload.error : undefined, tone: "error" });
      router.refresh();
      return;
    }
    toast({ title: decision === "approve" ? t("approvedToast") : t("rejectedToast") });
    setRejecting(false);
    router.refresh();
  }

  async function withdraw() {
    setBusy("withdraw");
    const { ok } = await send(`/api/admin/changes/${item.id}`, "DELETE");
    setBusy(null);
    toast(ok ? { title: t("withdrawnToast") } : { title: t("failed"), tone: "error" });
    router.refresh();
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors",
        selected ? "border-[#1E6DEB] ring-1 ring-[#1E6DEB]" : "border-[#E2E8F0]",
      )}
    >
      <header className="flex flex-wrap items-start gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
        {selectable ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            aria-label={t("selectOne", { label: item.entityLabel })}
            className="mt-1 size-4 accent-[#1E6DEB]"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide", ACTION_TONE[item.action])}>
              {t(`actions.${item.action}`)}
            </span>
            <span className="text-[12px] font-semibold text-[#64748B]">{t(`entities.${item.entity}`)}</span>
            {!pending ? (
              <Badge tone={STATUS_TONE[item.status]} dot>
                {t(`status.${item.status}`)}
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-1.5 text-[15px] font-semibold text-[#0F172A]">{item.entityLabel}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#64748B]">
            <Link href={`/admin/universities/${item.university.id}`} className="font-semibold text-[#1E6DEB] hover:underline">
              {universityName}
            </Link>
            <span aria-hidden>·</span>
            <span>
              {t("by", { name: item.author?.name ?? item.author?.email ?? t("unknownAdmin") })}
            </span>
            <span aria-hidden>·</span>
            <When value={item.createdAt} />
          </p>
        </div>
        <Link
          href={`/universities/${item.university.slug}`}
          target="_blank"
          className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-[12.5px] font-semibold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          {t("viewProfile")}
        </Link>
      </header>

      <div className="px-4 py-3.5 sm:px-5">
        {item.missing && pending ? (
          <Notice tone="red">{t("missing")}</Notice>
        ) : null}
        {stale ? <Notice tone="amber">{t("stale")}</Notice> : null}
        {item.applyError ? <Notice tone="red">{t("applyError", { error: item.applyError })}</Notice> : null}

        {item.action === "DELETE" ? (
          <p className="mb-2 text-[13px] font-semibold text-[#C81F15]">{t("willDelete")}</p>
        ) : null}

        {item.fields.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="text-start text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  <th className="w-[22%] pb-2 text-start font-semibold">{t("field")}</th>
                  {item.action === "UPDATE" ? (
                    <>
                      <th className="pb-2 text-start font-semibold">{t("currentValue")}</th>
                      <th className="w-6 pb-2" aria-hidden />
                      <th className="pb-2 text-start font-semibold">{t("proposedValue")}</th>
                    </>
                  ) : (
                    <th className="pb-2 text-start font-semibold">{t("value")}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {item.fields.map((field) => (
                  <FieldRow key={field.key} field={field} action={item.action} />
                ))}
              </tbody>
            </table>
          </div>
        ) : item.action !== "DELETE" ? (
          <p className="text-[13px] text-[#64748B]">{t("noFields")}</p>
        ) : null}

        {item.reviewNote || item.reviewer ? (
          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-[13px] text-[#334155]">
            <p className="font-semibold">
              {t(item.status === "REJECTED" ? "rejectedBy" : "reviewedBy", {
                name: item.reviewer?.name ?? item.reviewer?.email ?? t("unknownAdmin"),
              })}
              {item.reviewedAt ? (
                <span className="font-normal text-[#64748B]">
                  {" · "}
                  <When value={item.reviewedAt} />
                </span>
              ) : null}
            </p>
            {item.reviewNote ? <p className="mt-1 whitespace-pre-line">{item.reviewNote}</p> : null}
          </div>
        ) : null}
      </div>

      {pending && (canReview || canWithdraw) ? (
        <footer className="border-t border-slate-100 bg-[#FAFBFC] px-4 py-3 sm:px-5">
          {rejecting ? (
            <div className="space-y-2.5">
              <label className="block text-[12.5px] font-semibold text-[#334155]" htmlFor={`note-${item.id}`}>
                {t("noteLabel")}
              </label>
              <textarea
                id={`note-${item.id}`}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                maxLength={1000}
                placeholder={t("notePlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="min-h-9 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void review("reject")}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#C81F15] px-3 text-[13px] font-semibold text-white hover:bg-[#A8180F] disabled:opacity-60"
                >
                  {busy === "reject" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <X className="size-4" aria-hidden />}
                  {t("confirmReject")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {canWithdraw ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void withdraw()}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-60"
                >
                  {busy === "withdraw" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Undo2 className="size-4" aria-hidden />}
                  {t("withdraw")}
                </button>
              ) : null}
              {canReview ? (
                <>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => setRejecting(true)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#F5C2BD] bg-white px-3 text-[13px] font-semibold text-[#C81F15] hover:bg-[#FFF0EE] disabled:opacity-60"
                  >
                    <X className="size-4" aria-hidden />
                    {t("reject")}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null || (item.missing && item.action !== "CREATE")}
                    onClick={() => void review("approve")}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#0F7B45] px-3.5 text-[13px] font-semibold text-white hover:bg-[#0B6638] disabled:opacity-60"
                  >
                    {busy === "approve" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
                    {t("approve")}
                  </button>
                </>
              ) : null}
            </div>
          )}
        </footer>
      ) : null}
    </article>
  );
}

function Notice({ tone, children }: { tone: "amber" | "red"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "mb-3 flex items-start gap-2 rounded-lg px-3 py-2 text-[12.5px] font-medium",
        tone === "amber" ? "bg-[#FFF6E5] text-[#7A5410]" : "bg-[#FFF0EE] text-[#A8180F]",
      )}
    >
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function FieldRow({ field, action }: { field: ReviewField; action: ReviewItem["action"] }) {
  const t = useTranslations("Admin.changes");
  const key = `fields.${field.key}`;
  const label = t.has(key) ? t(key) : field.key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

  if (action === "UPDATE") {
    return (
      <tr className={cn("align-top", field.stale && "bg-[#FFFBF2]")}>
        <td className="py-2.5 pe-3 font-semibold text-[#334155]">
          {label}
          {field.stale ? (
            <span className="mt-0.5 block text-[11px] font-semibold text-[#B77714]">{t("changedSince")}</span>
          ) : null}
        </td>
        <td className="py-2.5 pe-2 text-[#64748B]">
          <Value fieldKey={field.key} value={field.current} muted />
        </td>
        <td className="w-6 py-2.5 text-[#94A3B8]">
          <ArrowRight className="mt-0.5 size-3.5 rtl:rotate-180" aria-hidden />
        </td>
        <td className="py-2.5 font-medium text-[#0F172A]">
          <Value fieldKey={field.key} value={field.proposed} />
        </td>
      </tr>
    );
  }

  return (
    <tr className="align-top">
      <td className="py-2.5 pe-3 font-semibold text-[#334155]">{label}</td>
      <td className={cn("py-2.5", action === "DELETE" ? "text-[#A8180F] line-through decoration-[#F5C2BD]" : "text-[#0F172A]")}>
        <Value fieldKey={field.key} value={action === "DELETE" ? field.before : field.proposed} />
      </td>
    </tr>
  );
}

function Value({ fieldKey, value, muted }: { fieldKey: string; value: unknown; muted?: boolean }) {
  const t = useTranslations("Admin.changes");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  if (value === null || value === undefined || value === "") {
    return <span className="italic text-[#94A3B8]">{t("notSet")}</span>;
  }
  if (typeof value === "boolean") return <span>{value ? t("yes") : t("no")}</span>;
  if (typeof value === "number") return <span className="tabular-nums">{formatNumber(locale, value)}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="italic text-[#94A3B8]">{t("notSet")}</span>;
    return (
      <span className="flex flex-wrap gap-1">
        {value.map((entry) => (
          <span key={String(entry)} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11.5px]">
            {String(entry)}
          </span>
        ))}
      </span>
    );
  }
  const text = String(value);
  if (IMAGE_KEYS.has(fieldKey) && /^(https?:\/\/|\/)/.test(text)) {
    return (
      <a href={text} target="_blank" rel="noreferrer" className="inline-block">
        {/* Previews of uploaded and catalogue images. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={text}
          alt=""
          className={cn("h-16 max-w-44 rounded-md border border-slate-200 object-cover", muted && "opacity-70")}
        />
      </a>
    );
  }
  if (text.length > LONG_TEXT) {
    return (
      <span>
        <span className={cn("whitespace-pre-line", !open && "line-clamp-3")}>{text}</span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-1 block text-[12px] font-semibold text-[#1E6DEB] hover:underline"
        >
          {open ? t("showLess") : t("showMore")}
        </button>
      </span>
    );
  }
  return <span className="break-words whitespace-pre-line">{text}</span>;
}
