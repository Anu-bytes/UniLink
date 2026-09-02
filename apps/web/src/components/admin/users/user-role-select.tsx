"use client";

import type { UserRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Field, SelectInput, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { USER_ROLES } from "./tones";
import type { UserLock } from "./types";

/**
 * The one writable thing on the detail screen. It saves on change rather than
 * behind a Save button: it is a single field, and a role that looks changed
 * but was never submitted is worse than no control at all.
 *
 * `lock` mirrors the API's two refusals — you cannot change your own role, and
 * the last admin cannot be demoted — so the select is disabled with the reason
 * spelled out. The 409 is still handled: another admin may have changed things
 * between this page rendering and the change landing.
 */
export function UserRoleSelect({
  userId,
  role,
  lock,
}: {
  userId: string;
  role: UserRole;
  lock: UserLock;
}) {
  const t = useTranslations("Admin");
  const tRole = useTranslations("Admin.enums.userRoles");
  const router = useRouter();
  const { toast } = useToast();
  const selectId = useId();

  const [value, setValue] = useState<UserRole>(role);
  const [pending, setPending] = useState(false);

  async function change(next: UserRole) {
    const previous = value;
    setValue(next);
    setPending(true);
    const result = await adminWrite(`/api/admin/users/${userId}`, "PATCH", {
      role: next,
    });
    setPending(false);

    if (!result.ok) {
      // The select must never sit on a role the server refused to store.
      setValue(previous);
      toast({
        title: t("users.account.roleFailed"),
        description: result.message ?? undefined,
        tone: "error",
      });
      return;
    }

    toast({ title: t("users.toasts.roleChanged") });
    router.refresh();
  }

  return (
    <Field
      label={t("users.account.role")}
      htmlFor={selectId}
      hint={lock ? t(`users.locks.${lock}`) : t("users.account.roleHint")}
    >
      <div className="relative">
        <SelectInput
          id={selectId}
          value={value}
          disabled={pending || lock !== null}
          onChange={(event) => void change(event.target.value as UserRole)}
          options={USER_ROLES.map((option) => ({
            value: option,
            label: tRole(option),
          }))}
        />
        {pending ? (
          <Loader2
            aria-hidden
            className="pointer-events-none absolute end-9 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#1E6DEB]"
          />
        ) : null}
      </div>
    </Field>
  );
}
