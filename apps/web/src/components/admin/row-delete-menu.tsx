"use client";

import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { RefObject } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/** The dialog stays in the caller so closing this menu never unmounts it. */
export function RowDeleteMenu({ name, pending, lockHint, triggerRef, onDelete }: {
  name: string;
  pending?: boolean;
  lockHint?: string | null;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onDelete: () => void;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={triggerRef}
        disabled={pending}
        aria-label={`${t("common.actions")}: ${name}`}
        title={t("common.actions")}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:opacity-40"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MoreHorizontal className="size-4" aria-hidden />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 max-w-64" dir={locale === "ar" ? "rtl" : "ltr"}>
        <DropdownMenuItem variant="destructive" disabled={!!lockHint} onClick={onDelete}>
          <Trash2 aria-hidden />{t("common.delete")}
        </DropdownMenuItem>
        {lockHint ? <p className="px-2 py-1.5 text-xs leading-5 text-muted-foreground">{lockHint}</p> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
