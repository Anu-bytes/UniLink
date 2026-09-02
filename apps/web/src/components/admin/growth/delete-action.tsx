"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { adminWrite } from "./request";
import { DANGER_BUTTON } from "./styles";

/**
 * One delete for all three sections, unlike the catalogue's two-step dialog: a
 * lead, a testimonial and a scholarship each own no child rows, so their API
 * handlers take no `?confirm=true` and there are no counts to quote back. The
 * dialog is still there because the row is gone for good — it just asks once.
 */
export function DeleteAction({
  section,
  id,
  name,
  variant,
  after,
}: {
  section: "leads" | "testimonials" | "scholarships";
  id: string;
  /** Quoted in the dialog so the admin can see which row they are about to lose. */
  name: string;
  /** The table row has no space for a label; the detail header does. */
  variant: "icon" | "button";
  /** Where the admin ends up once the row is gone. */
  after: "refresh" | "list";
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function confirmDelete() {
    setPending(true);
    const result = await adminWrite(`/api/admin/${section}/${id}`, "DELETE");
    setPending(false);

    if (!result.ok) {
      toast({
        title: t("common.deleteFailed"),
        description: result.message ?? undefined,
        tone: "error",
      });
      return;
    }

    setOpen(false);
    toast({ title: t(`${section}.toasts.deleted`) });

    if (after === "list") {
      router.push(`/admin/${section}`);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={variant === "icon" ? t("common.delete") : undefined}
        title={variant === "icon" ? t("common.delete") : undefined}
        className={cn(
          DANGER_BUTTON,
          variant === "icon" && "size-9 justify-center px-0",
        )}
      >
        <Trash2 className="size-4" aria-hidden />
        {variant === "button" ? t("common.delete") : null}
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        destructive
        pending={pending}
        title={t(`${section}.delete.title`)}
        confirmLabel={t(`${section}.delete.confirm`)}
        onConfirm={() => void confirmDelete()}
        description={
          <>
            <p>{t(`${section}.delete.description`, { name })}</p>
            <p className="mt-3">{t(`${section}.delete.note`)}</p>
          </>
        }
      />
    </>
  );
}
