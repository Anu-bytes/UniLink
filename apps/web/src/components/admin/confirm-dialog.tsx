"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

/**
 * Hand-rolled rather than pulled from a dialog library: the admin needs one
 * modal shape and nothing else, and this keeps the dependency list where it is.
 *
 * It DOES portal to document.body, though `fixed` alone would seem to be
 * enough. Several row-action components render this dialog from inside a
 * DataTable cell, and the pinned actions column carries `sticky end-0 z-[1]`;
 * a positioned element with a z-index opens a stacking context, so the
 * overlay's own z-index resolved against that cell's z=1 rather than the page.
 * The sidebar (z-50) and the top bar then painted straight over the dialog.
 * Portalling makes the modal independent of wherever it happens to be mounted,
 * which is what a modal should be.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
  pending?: boolean;
}) {
  const t = useTranslations("Admin");
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  // document does not exist while this renders on the server, and the portal
  // target has to be the same on the client's first paint, so mount first.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Cancel takes focus, not confirm: a stray Enter on a destructive dialog
  // must not delete anything.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-slate-900/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-[15px] font-semibold text-[#0F172A]">
          {title}
        </h2>
        {description ? (
          <div className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            {description}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={pending}
            className="flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel ?? t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
              destructive
                ? "bg-[#F82C1F] hover:bg-[#C81F15] focus-visible:outline-[#F82C1F]"
                : "bg-[#1E6DEB] hover:bg-[#1557C0] focus-visible:outline-[#1E6DEB]",
            )}
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {confirmLabel ?? t("common.confirmDelete")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
