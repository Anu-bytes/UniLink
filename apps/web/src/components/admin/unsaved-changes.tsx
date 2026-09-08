"use client";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "./confirm-dialog";

const Context = createContext<{
  register: (id: string, dirty: boolean) => void;
  confirmNavigation: (navigate: () => void) => void;
}>({
  register: () => {},
  confirmNavigation: (navigate: () => void) => navigate(),
});

/** Each editor registers independently so saving one row cannot clear another. */
export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Admin.common");
  const dirty = useRef(new Set<string>());
  const leaving = useRef(false);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const register = useCallback((id: string, changed: boolean) => {
    if (changed) dirty.current.add(id);
    else dirty.current.delete(id);
  }, []);
  const confirmNavigation = useCallback((navigate: () => void) => {
    if (leaving.current || dirty.current.size === 0) navigate();
    else setNextAction(() => navigate);
  }, []);

  useEffect(() => { leaving.current = false; }, [pathname, search]);
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (!leaving.current && dirty.current.size) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    // Capture before Next's delegated Link handlers. Modified/new-tab clicks
    // and downloads do not leave this editor and must not prompt.
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download || (anchor.target && anchor.target !== "_self")) return;
      const next = new URL(anchor.href);
      if (!/^https?:$/.test(next.protocol)) return;
      if (next.origin === location.origin && next.pathname === location.pathname && next.search === location.search) return;
      if (!leaving.current && dirty.current.size) {
        event.preventDefault();
        event.stopImmediatePropagation();
        confirmNavigation(() => anchor.click());
      }
    }
    // History traversal does not emit a link click. Modern browsers expose a
    // cancellable navigate event before committing Back/Forward navigation.
    const navigation = (window as Window & { navigation?: EventTarget & { traverseTo: (key: string) => unknown } }).navigation;
    function navigate(event: Event) {
      const transition = event as Event & { navigationType?: string; destination?: { key: string } };
      if (transition.navigationType === "traverse" && event.cancelable && transition.destination?.key && !leaving.current && dirty.current.size) {
        event.preventDefault();
        const key = transition.destination.key;
        confirmNavigation(() => { navigation?.traverseTo(key); });
      }
    }
    document.addEventListener("click", click, true);
    window.addEventListener("beforeunload", beforeUnload);
    navigation?.addEventListener("navigate", navigate);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("beforeunload", beforeUnload);
      navigation?.removeEventListener("navigate", navigate);
    };
  }, [confirmNavigation]);

  return <Context.Provider value={{ register, confirmNavigation }}>
    {children}
    <ConfirmDialog
      open={nextAction !== null}
      onOpenChange={(open) => { if (!open) setNextAction(null); }}
      title={t("unsavedChanges")}
      description={t("discardChanges")}
      cancelLabel={t("keepEditing")}
      confirmLabel={t("discardAndLeave")}
      onConfirm={() => {
        leaving.current = true;
        setNextAction(null);
        nextAction?.();
      }}
    />
  </Context.Provider>;
}

export function useUnsavedChanges(dirty: boolean) {
  const id = useId();
  const { register } = useContext(Context);
  useEffect(() => {
    register(id, dirty);
    return () => register(id, false);
  }, [dirty, id, register]);
  // Clear synchronously after a successful create, before router.push().
  return () => register(id, false);
}

export function useConfirmNavigation() {
  return useContext(Context).confirmNavigation;
}

/** New-record forms compare to their initial defaults, including select values. */
export function useUnsavedDraft(value: unknown) {
  const [initial] = useState(() => JSON.stringify(value));
  return useUnsavedChanges(JSON.stringify(value) !== initial);
}
