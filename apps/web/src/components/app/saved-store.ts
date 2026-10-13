"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Which items of one kind (universities, programs) the visitor has saved,
 * shared by every heart toggle on the page so saving in one place updates
 * the others and the Saved count immediately. Loaded once per page session
 * from `GET endpoint`; toggles POST/DELETE `{ [idKey]: id }` to the same
 * endpoint.
 */
export type SavedState = {
  status: "idle" | "loading" | "ready";
  signedIn: boolean;
  ids: ReadonlySet<string>;
};

const SERVER_STATE: SavedState = { status: "idle", signedIn: false, ids: new Set() };

export function createSavedStore({
  endpoint,
  idKey,
  label,
}: {
  endpoint: string;
  idKey: string;
  /** For the console message when a save fails. */
  label: string;
}) {
  let state: SavedState = SERVER_STATE;
  const listeners = new Set<() => void>();

  function emit(next: SavedState) {
    state = next;
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function load() {
    if (state.status !== "idle") return;
    emit({ ...state, status: "loading" });
    fetch(endpoint, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { signedIn: false, ids: [] }))
      .then((data: { signedIn: boolean; ids: string[] }) =>
        emit({ status: "ready", signedIn: data.signedIn, ids: new Set(data.ids) }),
      )
      // Treat a failed load as "not signed in": the heart then offers login
      // rather than pretending to save.
      .catch(() => emit({ status: "ready", signedIn: false, ids: new Set() }));
  }

  /** Records a saved/unsaved change made elsewhere. */
  function setSaved(id: string, saved: boolean) {
    const ids = new Set(state.ids);
    if (saved) ids.add(id);
    else ids.delete(id);
    emit({ ...state, ids });
  }

  /** Saves or unsaves, optimistically, reverting if the request fails. */
  async function toggle(id: string) {
    const next = !state.ids.has(id);
    setSaved(id, next);
    try {
      const response = await fetch(endpoint, {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [idKey]: id }),
      });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error(`Unable to update saved ${label}`, error);
      setSaved(id, !next);
    }
  }

  function useSaved() {
    const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
    useEffect(load, []);
    return snapshot;
  }

  return { useSaved, setSaved, toggle };
}
