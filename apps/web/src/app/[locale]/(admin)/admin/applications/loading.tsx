import { PAGE_WRAPPER } from "@/components/admin/applications/styles";

const CHIPS = 7;
const ROWS = 8;

export default function Loading() {
  return (
    <div className={PAGE_WRAPPER}>
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-3.5 w-80 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: CHIPS }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-28 animate-pulse rounded-full bg-slate-100"
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100 sm:max-w-xs" />
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-100 sm:ms-auto" />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <div className="h-10 border-b border-[#E2E8F0] bg-[#F8FAFC]" />
          {Array.from({ length: ROWS }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
            >
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-44 animate-pulse rounded bg-slate-100" />
                <div className="h-2.5 w-56 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
