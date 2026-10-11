"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { useSavedUniversities } from "@/components/app/saved-universities-store";

type SavedContextValue = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);

/**
 * The "Saved" count (header badge, dashboard stat): saved faculties plus
 * saved universities, the two tabs of the Saved page. Seeded from the server
 * on load and kept live: faculty hearts nudge it through increment/decrement,
 * and university hearts are read from the shared saved-universities store,
 * so saving either updates every count instantly, without a refresh.
 */
export function SavedProvider({
  initialCount,
  initialUniversityCount = 0,
  children,
}: {
  /** Saved faculties. */
  initialCount: number;
  /** Saved universities, used until the live store has loaded. */
  initialUniversityCount?: number;
  children: React.ReactNode;
}) {
  const [facultyCount, setCount] = useState(initialCount);
  const universities = useSavedUniversities();
  const universityCount =
    universities.status === "ready" ? universities.ids.size : initialUniversityCount;
  const count = facultyCount + universityCount;

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
