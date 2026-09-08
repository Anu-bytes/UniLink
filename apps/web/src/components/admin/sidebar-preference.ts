"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "unilink.admin.sidebar.collapsed";
const CHANGE_EVENT = "unilink:admin-sidebar-preference";
let fallback = false;

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

function snapshot() {
  try { return window.localStorage.getItem(STORAGE_KEY) === "1"; }
  catch { return fallback; }
}

const serverSnapshot = () => false;

/** Hydration-safe subscription; blocked localStorage must not break navigation. */
export function useSidebarPreference() {
  const collapsed = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  function toggleCollapsed() {
    fallback = !snapshot();
    try { window.localStorage.setItem(STORAGE_KEY, fallback ? "1" : "0"); }
    catch { /* Retain the in-memory preference when storage is unavailable. */ }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return { collapsed, toggleCollapsed };
}
