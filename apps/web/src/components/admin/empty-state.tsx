import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon ? (
        <span
          aria-hidden
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#EAF2FE] text-[#1E6DEB]"
        >
          <Icon className="size-5" />
        </span>
      ) : null}
      <p className="text-[15px] font-semibold text-[#0F172A]">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-[13px] text-[#64748B]">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
