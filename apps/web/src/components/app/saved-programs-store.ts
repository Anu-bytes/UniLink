"use client";

import { createSavedStore } from "@/components/app/saved-store";

/**
 * Which programs the visitor has saved, shared by every program heart on the
 * page (search and faculty cards, the program page, the university profile's
 * program dialog) and by the Saved count.
 */
const store = createSavedStore({
  endpoint: "/api/saved-programs",
  idKey: "programId",
  label: "programs",
});

export const useSavedPrograms = store.useSaved;
export const toggleProgramSaved = store.toggle;
