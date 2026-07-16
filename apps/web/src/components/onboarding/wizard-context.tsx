"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { TOTAL_STEPS, type WizardData } from "@/lib/onboarding-schema";

const STORAGE_KEY = "unilink-onboarding";

type WizardContextValue = {
  /** Zero-based index of the current step. */
  step: number;
  /** Accumulated answers so far (never includes the password after submit). */
  data: WizardData;
  /** True once we've read any persisted state — guards against SSR mismatch. */
  hydrated: boolean;
  setData: (patch: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

/**
 * Reads persisted wizard state from sessionStorage. We intentionally never
 * persist the password — only the profile answers survive a refresh.
 */
function readPersisted(): { step: number; data: WizardData } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { step?: number; data?: WizardData };
    return {
      step: Math.min(Math.max(parsed.step ?? 0, 0), TOTAL_STEPS - 1),
      data: parsed.data ?? {},
    };
  } catch {
    return null;
  }
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [data, setDataState] = useState<WizardData>({});
  const [hydrated, setHydrated] = useState(false);
  const initialised = useRef(false);

  // Hydrate from sessionStorage once on mount (client only).
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const persisted = readPersisted();
    if (persisted) {
      setStep(persisted.step);
      setDataState(persisted.data);
    }
    setHydrated(true);
  }, []);

  // Persist profile answers (minus password) whenever they change.
  useEffect(() => {
    if (!hydrated) return;
    const { password: _password, ...safe } = data;
    void _password;
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, data: safe }),
    );
  }, [step, data, hydrated]);

  const setData = useCallback((patch: Partial<WizardData>) => {
    setDataState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Keep a ref in sync so next/back don't need `step` in their deps.
  const stepRef = useRef(step);
  stepRef.current = step;

  const goTo = useCallback((target: number) => {
    setStep(Math.min(Math.max(target, 0), TOTAL_STEPS - 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const next = useCallback(() => goTo(stepRef.current + 1), [goTo]);
  const back = useCallback(() => goTo(stepRef.current - 1), [goTo]);

  const reset = useCallback(() => {
    setDataState({});
    setStep(0);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({ step, data, hydrated, setData, next, back, goTo, reset }),
    [step, data, hydrated, setData, next, back, goTo, reset],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return ctx;
}
