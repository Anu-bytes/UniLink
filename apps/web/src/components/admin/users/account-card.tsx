import type { UserRole } from "@prisma/client";
import { KeyRound, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/admin";
import { formatDate, initialsAvatar } from "@/lib/format";

import { FieldRow, NotSet, Panel } from "./panel";
import { USER_ROLE_TONES } from "./tones";
import type { UserLock } from "./types";
import { UserRoleSelect } from "./user-role-select";

export type AccountUser = {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
};

/**
 * `name` is written at sign-up, but the admin PATCH can clear it, so the two
 * registration columns are the fallback before an address has to stand in for
 * a person.
 */
export function displayName(user: AccountUser): string | null {
  if (user.name) return user.name;
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

export async function AccountCard({
  user,
  hasPassword,
  lock,
}: {
  user: AccountUser;
  /**
   * Whether a credentials password is set. Resolved on the server as a
   * boolean: the hash itself has no business on this screen, in this payload,
   * or in the client bundle.
   */
  hasPassword: boolean;
  lock: UserLock;
}) {
  const t = await getTranslations("Admin.users.account");
  const tCommon = await getTranslations("Admin.common");
  const tRole = await getTranslations("Admin.enums.userRoles");
  const locale = await getLocale();

  const name = displayName(user);
  const avatar = initialsAvatar(name ?? user.email);

  return (
    <Panel title={t("title")}>
      <div className="flex items-center gap-4">
        {user.image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- avatars come
             from whichever OAuth provider the account signed in with, so
             next/image's configured loader cannot be relied on. */
          <img
            src={user.image}
            alt=""
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            style={{ background: avatar.background, color: avatar.color }}
            className="flex size-14 shrink-0 items-center justify-center rounded-full text-[17px] font-bold"
          >
            {avatar.initials}
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#0F172A]">
            {name ?? user.email}
          </p>
          <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
            <span dir="ltr">{user.email}</span>
          </p>
          <div className="mt-2">
            <Badge tone={USER_ROLE_TONES[user.role]}>{tRole(user.role)}</Badge>
          </div>
        </div>
      </div>

      <dl className="mt-5 border-t border-slate-100 pt-1">
        <FieldRow label={t("phone")}>
          {user.phone ? (
            <span dir="ltr">{user.phone}</span>
          ) : (
            <NotSet label={tCommon("notSet")} />
          )}
        </FieldRow>

        <FieldRow label={t("signIn")}>
          <span className="inline-flex items-center gap-1.5">
            {hasPassword ? (
              <KeyRound className="size-3.5 text-[#64748B]" aria-hidden />
            ) : (
              <ShieldCheck className="size-3.5 text-[#64748B]" aria-hidden />
            )}
            {hasPassword ? t("password") : t("google")}
          </span>
        </FieldRow>

        <FieldRow label={t("joined")}>{formatDate(locale, user.createdAt)}</FieldRow>
      </dl>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <UserRoleSelect userId={user.id} role={user.role} lock={lock} />
      </div>
    </Panel>
  );
}
