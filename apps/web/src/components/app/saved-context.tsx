"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type SavedContextValue = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);

/**
 * Holds the saved-faculties count for the header badge. Seeded from the
 * server on load, then nudged by FacultySaveButton so the badge updates the
 * instant a heart is toggled instead of waiting for a page refresh.
 */
export function SavedProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => setCount((current) => current + 1), []);
  const decrement = useCallback(
    () => setCount((current) => Math.max(0, current - 1)),
    [],
  );

  const value = useMemo<SavedContextValue>(
    () => ({ count, increment, decrement }),
    [count, increment, decrement],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSavedCount() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSavedCount must be used inside a SavedProvider");
  }
  return context;
}
