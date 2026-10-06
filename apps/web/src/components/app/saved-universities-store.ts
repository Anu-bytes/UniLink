"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Which universities the visitor has saved, shared by every heart toggle on
 * the page (directory cards, homepage slider, search results, profile) so
 * saving in one place updates the others immediately. Loaded once per page
 * session from GET /api/saved-universities.
 */
type State = { status: "idle" | "loading" | "ready"; signedIn: boolean; ids: ReadonlySet<string> };

let state: State = { status: "idle", signedIn: false, ids: new Set() };
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SERVER_STATE: State = { status: "idle", signedIn: false, ids: new Set() };

function load() {
  if (state.status !== "idle") return;
  emit({ ...state, status: "loading" });
  fetch("/api/saved-universities", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : { signedIn: false, ids: [] }))
    .then((data: { signedIn: boolean; ids: string[] }) =>
      emit({ status: "ready", signedIn: data.signedIn, ids: new Set(data.ids) }),
    )
    // Treat a failed load as "not signed in": the heart then offers login
    // rather than pretending to save.
    .catch(() => emit({ status: "ready", signedIn: false, ids: new Set() }));
}

/** Records a saved/unsaved change made elsewhere (e.g. the profile button). */
export function setUniversitySaved(id: string, saved: boolean) {
  const ids = new Set(state.ids);
  if (saved) ids.add(id);
  else ids.delete(id);
  emit({ ...state, ids });
}

/** Saves or unsaves, optimistically, reverting if the request fails. */
export async function toggleUniversitySaved(id: string) {
  const next = !state.ids.has(id);
  setUniversitySaved(id, next);
  try {
    const response = await fetch("/api/saved-universities", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ universityId: id }),
    });
    if (!response.ok) throw new Error(await response.text());
  } catch (error) {
    console.error("Unable to update saved universities", error);
    setUniversitySaved(id, !next);
  }
}

export function useSavedUniversities() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  useEffect(load, []);
  return snapshot;
}
