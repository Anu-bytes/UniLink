"use client";

import { createSavedStore } from "@/components/app/saved-store";

/**
 * Which universities the visitor has saved, shared by every heart toggle on
 * the page (directory cards, homepage slider, search results, profile).
 */
const store = createSavedStore({
  endpoint: "/api/saved-universities",
  idKey: "universityId",
  label: "universities",
});

export const useSavedUniversities = store.useSaved;
export const setUniversitySaved = store.setSaved;
export const toggleUniversitySaved = store.toggle;
