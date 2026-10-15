"use client";

import { CircleAlert, CircleCheck, Clock3, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const DISMISS_AFTER_MS = 4000;
const MAX_VISIBLE = 3;

export type ToastTone = "success" | "error" | "pending";

// A university admin's save does not change anything yet: the API queues it
// for review and answers 202. The shared request helpers call this when that
// happens, so the form's own "Saved" toast becomes "Sent for approval"
// instead of claiming something it did not do.
const PENDING_EVENT = "unilink:change-queued";
const PENDING_WINDOW_MS = 1500;
let pendingUntil = 0;

export function notePendingChange() {
  pendingUntil = Date.now() + PENDING_WINDOW_MS;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PENDING_EVENT));
}

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
};

type ToastEntry = ToastInput & { id: number; tone: ToastTone };

type ToastContextValue = { toast: (input: ToastInput) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Admin");
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer != null) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((previous) => previous.filter((entry) => entry.id !== id));
  }, []);

  const pendingShown = useRef(false);

  const push = useCallback(
    (input: ToastInput) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((previous) =>
        [...previous, { ...input, id, tone: input.tone ?? "success" }].slice(
          -MAX_VISIBLE,
        ),
      );
      timers.current.set(id, window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS));
    },
    [dismiss],
  );

  const pendingToast = useMemo<ToastInput>(
    () => ({
      title: t("changes.sentTitle"),
      description: t("changes.sentBody"),
      tone: "pending",
    }),
    [t],
  );

  const toast = useCallback(
    (input: ToastInput) => {
      if ((input.tone ?? "success") === "success" && Date.now() < pendingUntil) {
        if (pendingShown.current) return;
        pendingShown.current = true;
        push(pendingToast);
        return;
      }
      push(input);
    },
    [push, pendingToast],
  );

  // A queued save whose form shows no toast of its own still gets the notice.
  useEffect(() => {
    function onQueued() {
      pendingShown.current = false;
      window.setTimeout(() => {
        if (!pendingShown.current) {
          pendingShown.current = true;
          push(pendingToast);
        }
      }, 400);
    }
    window.addEventListener(PENDING_EVENT, onQueued);
    return () => window.removeEventListener(PENDING_EVENT, onQueued);
  }, [push, pendingToast]);

  // A pending timer firing after the tree is gone would set state on nothing.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 end-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((entry) => (
          <div
            key={entry.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_8px_24px_rgba(16,24,40,0.10)]"
          >
            <span
              aria-hidden
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                entry.tone === "error"
                  ? "bg-[#FFF0EE] text-[#C81F15]"
                  : entry.tone === "pending"
                    ? "bg-[#FFF6E5] text-[#B77714]"
                    : "bg-[#E7F6EE] text-[#0F7B45]",
              )}
            >
              {entry.tone === "error" ? (
                <CircleAlert className="size-4" />
              ) : entry.tone === "pending" ? (
                <Clock3 className="size-4" />
              ) : (
                <CircleCheck className="size-4" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-[#0F172A]">{entry.title}</p>
              {entry.description ? (
                <p className="mt-0.5 text-[12.5px] text-[#64748B]">{entry.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => dismiss(entry.id)}
              aria-label={t("common.dismiss")}
              className="-me-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
