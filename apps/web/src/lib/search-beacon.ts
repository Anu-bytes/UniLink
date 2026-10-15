// Browser side of the search analytics: reports a quick or homepage search
// without delaying the navigation it triggers.
export function reportSearch(entry: {
  query: string;
  source: "quick_search" | "hero";
  universitySlug?: string;
  resultCount?: number;
  locale?: string;
}) {
  const query = entry.query.trim();
  if (!query || typeof navigator === "undefined") return;
  const body = JSON.stringify({ ...entry, query });
  try {
    if (navigator.sendBeacon?.("/api/search-log", new Blob([body], { type: "application/json" }))) return;
  } catch {
    // fall through to fetch
  }
  void fetch("/api/search-log", { method: "POST", body, keepalive: true }).catch(() => undefined);
}
