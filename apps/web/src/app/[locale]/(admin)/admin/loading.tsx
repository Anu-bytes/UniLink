const CARD = "rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]";

/**
 * Mirrors the overview's real blocks rather than showing a spinner: the header,
 * four stat cards, the six pipeline tiles, the activity cards and the secondary
 * row all keep their final height, so nothing shifts when the data lands.
 */
export default function AdminOverviewLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
      <div className="h-7 w-52 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />

      <div className="mt-6 flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`stat-${index}`}
              className={`flex items-start justify-between gap-3 p-5 ${CARD}`}
            >
              <div className="w-full">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-7 w-20 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="size-10 shrink-0 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>

        <div>
          <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`pipeline-${index}`} className={`p-4 ${CARD}`}>
                <div className="h-[26px] w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-3 h-6 w-12 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, cardIndex) => (
            <div key={`activity-${cardIndex}`} className={`overflow-hidden ${CARD}`}>
              <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div
                    key={`activity-${cardIndex}-${rowIndex}`}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="size-9 shrink-0 animate-pulse rounded-full bg-slate-100" />
                    <div className="min-w-0 flex-1">
                      <div className="h-3.5 w-40 max-w-full animate-pulse rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-56 max-w-full animate-pulse rounded bg-slate-100" />
                    </div>
                    <div className="h-6 w-20 shrink-0 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`overflow-hidden ${CARD}`}>
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`lead-${index}`} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 w-48 max-w-full animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-3.5 w-56 max-w-full flex-1 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-20 shrink-0 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`secondary-${index}`} className="bg-white p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                <div className="mt-2.5 h-5 w-14 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
