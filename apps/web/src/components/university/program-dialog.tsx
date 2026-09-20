"use client";

import { X } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const CloseContext = createContext<() => void>(() => {});

/** Lets content rendered inside the dialog (e.g. the compare button) close it. */
export function useCloseProgramDialog() {
  return useContext(CloseContext);
}

/**
 * A program card that opens its full details in a modal instead of
 * navigating to a separate page. Uses the native <dialog> element: it renders
 * in the top layer, so it isn't clipped by the accordion's overflow or
 * mispositioned by transformed ancestors (the reveal animations), and gives
 * Escape-to-close and focus handling for free.
 *
 * Both the card and the detail body are rendered by the server parent
 * (translations, formatting); this component only owns open/closed state.
 */
export function ProgramDialog({
  card,
  detail,
  closeLabel,
}: {
  card: React.ReactNode;
  detail: React.ReactNode;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="block h-full w-full rounded-2xl text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        {card}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // A click on the backdrop targets the dialog element itself.
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[90vh] w-[min(94vw,46rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 text-[#1F2A44] shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <div className="relative p-5 pt-14 md:p-8 md:pt-14">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full bg-slate-100 text-[#5a6072] transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <X className="size-4" aria-hidden />
            </button>
            <CloseContext.Provider value={() => setOpen(false)}>
              {detail}
            </CloseContext.Provider>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
