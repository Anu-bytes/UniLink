import { ArrowUpRight, FileText, Search, TrendingUp } from "lucide-react";

/**
 * A tablet + phone hardware mockup for the partners hero, showing a
 * simplified reproduction of the actual product (dashboard stat tiles,
 * search results) in the site's real brand colors, not the generic template
 * colors from the reference deck. Pure CSS/markup, no screenshot: a
 * screenshot would need a running app to capture and would go stale the
 * moment the dashboard's design changes; this stays accurate to the brand
 * regardless.
 */
export function EnrollmentDevices() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[460px] pb-14 pe-10">
      {/* Tablet */}
      <div className="rounded-[28px] border-[10px] border-[#16233F] bg-[#16233F] shadow-[0_40px_80px_-30px_rgba(15,23,42,0.55)]">
        <div className="overflow-hidden rounded-[18px] bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-[#F7F9FE] px-4 py-3">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#1E6DEB] text-[10px] font-bold text-white">
              U
            </span>
            <span className="text-xs font-bold text-[#16233F]">
              University Dashboard
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="rounded-xl bg-[#EEF3FF] p-3">
              <TrendingUp className="size-4 text-[#1E6DEB]" />
              <p className="mt-2 text-lg font-bold text-[#16233F]">1,123</p>
              <p className="text-[10px] font-medium text-[#5a6072]">Leads</p>
            </div>
            <div className="rounded-xl bg-[#FFF6E2] p-3">
              <FileText className="size-4 text-[#B77714]" />
              <p className="mt-2 text-lg font-bold text-[#16233F]">673</p>
              <p className="text-[10px] font-medium text-[#5a6072]">
                Applications
              </p>
            </div>
            <div className="rounded-xl bg-[#FFF0EE] p-3">
              <ArrowUpRight className="size-4 text-[#F82C1F]" />
              <p className="mt-2 text-lg font-bold text-[#16233F]">72%</p>
              <p className="text-[10px] font-medium text-[#5a6072]">
                Enrolled
              </p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex h-16 items-end gap-1.5 rounded-xl bg-slate-50 p-3">
              {[40, 65, 50, 85, 60, 95, 70].map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className="flex-1 rounded-full bg-gradient-to-t from-[#1E6DEB] to-[#3B86F7]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phone, staggered over the tablet's lower corner */}
      <div className="absolute -bottom-2 end-0 w-[150px] rounded-[26px] border-[7px] border-[#16233F] bg-[#16233F] shadow-[0_30px_60px_-24px_rgba(15,23,42,0.6)] sm:w-[170px]">
        <div className="overflow-hidden rounded-[19px] bg-white">
          <div className="flex justify-center py-1.5">
            <span className="h-1.5 w-10 rounded-full bg-slate-200" />
          </div>

          <div className="px-2.5 pb-3">
            <div className="flex items-center gap-1.5 rounded-full bg-[#F7F9FE] px-2.5 py-1.5 ring-1 ring-slate-200">
              <Search className="size-3 shrink-0 text-[#1E6DEB]" />
              <span className="truncate text-[9px] text-[#98A0B4]">
                Search programs…
              </span>
            </div>

            <div className="mt-2 space-y-1.5">
              {[
                { faculty: "Faculty of Engineering", university: "Cairo University" },
                { faculty: "Faculty of Business", university: "AUC" },
              ].map((item) => (
                <div
                  key={item.faculty}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-100 p-1.5"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-[8px] font-bold text-white">
                    U
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[8px] font-bold text-[#16233F]">
                      {item.faculty}
                    </p>
                    <p className="truncate text-[7px] text-[#5a6072]">
                      {item.university}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
