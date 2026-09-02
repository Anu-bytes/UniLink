// The kit stops at inputs, cards and badges, so the buttons this section needs
// share their classes from here instead of drifting apart between the board
// and the review screen.

export const PRIMARY_BUTTON =
  "inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-3.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-60";

export const SECONDARY_BUTTON =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-60";

export const ICON_BUTTON =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-40";

/** The wrapper every page in the console opens with. */
export const PAGE_WRAPPER = "mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8";

export const CARD =
  "rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]";
