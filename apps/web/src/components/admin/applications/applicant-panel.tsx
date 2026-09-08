import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { initialsAvatar } from "@/lib/format";

import { FieldRow, NotSet, Panel } from "./panel";
import { SECONDARY_BUTTON } from "./styles";
import { applicantLabel, type Applicant } from "./types";

export async function ApplicantPanel({ user }: { user: Applicant }) {
  const t = await getTranslations("Admin");

  const label = applicantLabel(user);
  const avatar = initialsAvatar(label);

  return (
    <Panel
      title={t("applications.detail.applicant")}
      action={
        <Link href={`/admin/users/${user.id}`} className={SECONDARY_BUTTON}>
          {t("applications.detail.viewProfile")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      }
    >
      <div className="flex items-center gap-3">
        {user.image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- avatars come
             from whichever OAuth provider the account signed in with, so
             next/image's configured loader cannot be relied on. */
          <img
            src={user.image}
            alt=""
            className="size-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            style={{ background: avatar.background, color: avatar.color }}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
          >
            {avatar.initials}
          </span>
        )}
        <p className="min-w-0 truncate text-[15px] font-semibold text-[#0F172A]">
          {label}
        </p>
      </div>

      <dl className="mt-4">
        <FieldRow label={t("applications.detail.email")}>
          <span dir="ltr" className="break-all">
            {user.email}
          </span>
        </FieldRow>
        <FieldRow label={t("applications.detail.phone")}>
          {user.phone ? (
            <span dir="ltr">{user.phone}</span>
          ) : (
            <NotSet label={t("common.notSet")} />
          )}
        </FieldRow>
      </dl>
    </Panel>
  );
}
