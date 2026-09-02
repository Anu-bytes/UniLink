import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { Link } from "@/i18n/navigation";

export type Crumb = {
  /** Omit on the last crumb: the page you are already on is not a link. */
  href?: string;
  label: string;
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: Crumb[];
}) {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label={t("common.breadcrumb")} className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-[#64748B]">
              {breadcrumb.map((crumb, index) => (
                <Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 ? (
                    <li aria-hidden className="text-slate-300">
                      <ChevronRight className="size-3.5 rtl:rotate-180" />
                    </li>
                  ) : null}
                  <li>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="rounded transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[#334155]">{crumb.label}</span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#0F172A]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] text-[#64748B]">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
