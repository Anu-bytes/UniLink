const CARD =
  "rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]";

/**
 * Mirrors the real page block for block — header, toolbar with its four
 * filters, six table rows — so the layout does not shift when the query lands.
 */
export default function AdminProgramsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100 sm:max-w-xs" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="flex flex-wrap items-center gap-2 sm:ms-auto">
            <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className={`overflow-hidden ${CARD}`}>
          <div className="h-10 border-b border-[#E2E8F0] bg-[#F8FAFC]" />
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`row-${index}`} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 w-56 max-w-full animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-36 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="hidden h-3.5 w-36 animate-pulse rounded bg-slate-100 md:block" />
                <div className="hidden h-3.5 w-32 animate-pulse rounded bg-slate-100 lg:block" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="hidden h-3.5 w-24 animate-pulse rounded bg-slate-100 xl:block" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="size-9 shrink-0 animate-pulse rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
