import { getLocale, getTranslations } from "next-intl/server";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Panel } from "./panel";

/**
 * The three instants the schema actually records. There is no status-change
 * log table, so this is the whole history: inventing a per-transition timeline
 * would mean inventing the timestamps behind it.
 *
 * `submittedAt` is stamped once, when the application first reaches SUBMITTED,
 * and is never cleared afterwards — it is a fact about the student, not a
 * mirror of the current status, which is why it is shown here rather than
 * offered as a field on the form.
 */
export async function TimelinePanel({
  createdAt,
  submittedAt,
  updatedAt,
}: {
  createdAt: Date;
  submittedAt: Date | null;
  updatedAt: Date;
}) {
  const t = await getTranslations("Admin.applications.timeline");
  const locale = await getLocale();

  const entries = [
    { key: "created", label: t("created"), value: createdAt },
    { key: "submitted", label: t("submitted"), value: submittedAt },
    { key: "updated", label: t("updated"), value: updatedAt },
  ];

  return (
    <Panel title={t("title")} description={t("description")}>
      <ol className="relative">
        <span
          aria-hidden
          className="absolute inset-y-2 start-[3.5px] w-px bg-slate-100"
        />
        {entries.map((entry, index) => (
          <li
            key={entry.key}
            className={cn("relative ps-6", index > 0 && "mt-5")}
          >
            <span
              aria-hidden
              className={cn(
                "absolute start-0 top-1 size-2 rounded-full ring-4 ring-white",
                entry.value ? "bg-[#1E6DEB]" : "bg-slate-300",
              )}
            />
            <p className="text-[13px] font-semibold text-[#334155]">
              {entry.label}
            </p>
            <p className="mt-0.5 text-[12.5px] text-[#64748B]">
              {entry.value ? (
                <time dateTime={entry.value.toISOString()}>
                  {formatDate(locale, entry.value)}
                </time>
              ) : (
                <span className="text-slate-400">{t("notSubmitted")}</span>
              )}
            </p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
