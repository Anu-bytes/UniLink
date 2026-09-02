"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { adminWrite } from "./request";
import { DANGER_BUTTON } from "./styles";
import type { UserCounts, UserLock } from "./types";

/** Rendered in the dialog in the order an admin reads them. */
const COUNT_KEYS = [
  "applications",
  "savedFaculties",
  "savedPrograms",
] as const satisfies readonly (keyof UserCounts)[];

/** A 409 either asks for confirmation or refuses outright; only the first carries counts. */
function countsFrom(body: unknown): UserCounts | null {
  const counts = (body as { counts?: UserCounts } | null)?.counts;
  return counts && typeof counts.applications === "number" ? counts : null;
}

/**
 * The two-step delete, shared by the table row and the detail header so both
 * ask the same question. Step one goes out without `?confirm`, which the API
 * answers with a 409 carrying what the delete would take; the dialog quotes
 * those counts and only then repeats the request with `?confirm=true`.
 *
 * The same 409 also carries the two lockout refusals — your own account, and
 * the last remaining admin. `lock` disables the button for both ahead of time,
 * but the answer is still handled: another admin may have been demoted between
 * this page rendering and the click.
 */
export function UserDeleteAction({
  user,
  lock,
  variant,
  after,
}: {
  user: { id: string; name: string | null; email: string };
  lock: UserLock;
  /** The table row has no space for a label; the detail header does. */
  variant: "icon" | "button";
  /** Where the admin ends up once the account is gone. */
  after: "refresh" | "list";
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [counts, setCounts] = useState<UserCounts | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const label = user.name ?? user.email;
  const lockHint = lock ? t(`users.locks.${lock}`) : null;

  function failed(message: string | null) {
    toast({
      title: t("common.deleteFailed"),
      description: message ?? undefined,
      tone: "error",
    });
  }

  function done() {
    toast({ title: t("users.toasts.deleted") });
    if (after === "list") {
      router.push("/admin/users");
      return;
    }
    router.refresh();
  }

  async function requestDelete() {
    setPending(true);
    const result = await adminWrite(`/api/admin/users/${user.id}`, "DELETE");
    setPending(false);

    if (result.ok) {
      done();
      return;
    }

    if (result.status === 409) {
      const cascade = countsFrom(result.body);
      if (cascade) {
        setCounts(cascade);
        setOpen(true);
        return;
      }
    }

    failed(result.message);
  }

  async function confirmDelete() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/users/${user.id}?confirm=true`,
      "DELETE",
    );
    setPending(false);

    if (!result.ok) {
      setOpen(false);
      failed(result.message);
      return;
    }

    setOpen(false);
    done();
  }

  return (
    <>
      {/* The lock explanation sits on a wrapper, not on the button: a disabled
          control fires none of the hover events a `title` needs, so a locked
          row would otherwise refuse the click and explain nothing. */}
      <span title={lockHint ?? undefined} className="inline-flex">
        <button
          type="button"
          onClick={() => void requestDelete()}
          disabled={pending || lock !== null}
          aria-label={variant === "icon" ? t("common.delete") : undefined}
          title={
            lockHint || variant !== "icon" ? undefined : t("common.delete")
          }
          className={cn(
            DANGER_BUTTON,
            variant === "icon" && "size-9 justify-center px-0",
          )}
        >
          <Trash2 className="size-4" aria-hidden />
          {variant === "button" ? t("common.delete") : null}
        </button>
      </span>

      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
        destructive
        pending={pending}
        title={t("users.delete.title")}
        confirmLabel={t("users.delete.confirm")}
        onConfirm={() => void confirmDelete()}
        description={
          <>
            <p>{t("users.delete.description", { name: label })}</p>
            {counts ? (
              <ul className="mt-3 space-y-1">
                {COUNT_KEYS.filter((key) => counts[key] > 0).map((key) => (
                  <li key={key} className="flex items-center justify-between gap-4">
                    <span>{t(`users.delete.counts.${key}`)}</span>
                    <span className="font-semibold tabular-nums text-[#0F172A]">
                      {formatNumber(locale, counts[key])}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 font-semibold text-[#C81F15]">
              {t("users.delete.note")}
            </p>
          </>
        }
      />
    </>
  );
}
