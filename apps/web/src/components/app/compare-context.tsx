"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const MAX_COMPARE = 4;

const STORAGE_KEY = "unilink.compare";

/** Faculties and programs are compared on different attributes. */
export type CompareKind = "program" | "faculty";

export type CompareEntry = {
  id: string;
  kind: CompareKind;
  name: string;
  universityName: string;
  logoUrl: string | null;
};

type CompareContextValue = {
  entries: CompareEntry[];
  ids: string[];
  /** What the current selection holds, or null when empty. */
  kind: CompareKind | null;
  isSelected: (id: string) => boolean;
  toggle: (entry: CompareEntry) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** True when the tray is full and a new selection would be rejected. */
  isFull: boolean;
  ready: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function read(): CompareEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const entries = parsed.filter(
      (entry): entry is CompareEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as CompareEntry).id === "string" &&
        ((entry as CompareEntry).kind === "program" ||
          (entry as CompareEntry).kind === "faculty"),
    );

    // A selection stored before kinds existed, or a hand-edited one, could
    // mix the two. Keep only the first kind seen.
    const kind = entries[0]?.kind;
    return entries
      .filter((entry) => entry.kind === kind)
      .slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

/**
 * Holds the compare selection for the whole app area. Backed by localStorage so
 * it survives navigation and reloads; the compare page also accepts the ids in
 * the URL so a comparison can be shared.
 */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CompareEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, ready]);

  const toggle = useCallback((entry: CompareEntry) => {
    setEntries((previous) => {
      if (previous.some((item) => item.id === entry.id)) {
        return previous.filter((item) => item.id !== entry.id);
      }

      // Faculties and programs are compared on different attributes, so
      // picking one kind while the other is selected starts a fresh tray
      // rather than producing a table of mismatched rows.
      if (previous.length > 0 && previous[0].kind !== entry.kind) {
        return [entry];
      }

      if (previous.length >= MAX_COMPARE) return previous;
      return [...previous, entry];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setEntries((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      entries,
      ids: entries.map((entry) => entry.id),
      kind: entries[0]?.kind ?? null,
      isSelected: (id) => entries.some((entry) => entry.id === id),
      toggle,
      remove,
      clear,
      isFull: entries.length >= MAX_COMPARE,
      ready,
    }),
    [clear, entries, ready, remove, toggle],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used inside a CompareProvider");
  }
  return context;
}
