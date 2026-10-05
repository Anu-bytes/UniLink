"use client";

import { useEffect, useState } from "react";

import type { UniversitySearchEntry } from "@/lib/catalog";
import { normalize } from "@/lib/normalize-text";

export type { UniversitySearchEntry };

// One fetch per locale for the whole session, shared by every search box on
// the page (header palette, home search bar). The index is ~50 rows.
const cache = new Map<string, Promise<UniversitySearchEntry[]>>();

function loadIndex(locale: string): Promise<UniversitySearchEntry[]> {
  let pending = cache.get(locale);
  if (!pending) {
    pending = fetch(`/api/search-index?locale=${encodeURIComponent(locale)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`search index ${response.status}`);
        return response.json() as Promise<{ entries: UniversitySearchEntry[] }>;
      })
      .then((data) => data.entries)
      .catch((error) => {
        // Let a later open retry instead of caching the failure forever.
        cache.delete(locale);
        throw error;
      });
    cache.set(locale, pending);
  }
  return pending;
}

/** The search index, fetched the first time `enabled` is true. */
export function useUniversityIndex(locale: string, enabled: boolean) {
  const [entries, setEntries] = useState<UniversitySearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || entries) return;
    let alive = true;
    loadIndex(locale).then(
      (result) => {
        if (alive) setEntries(result);
      },
      () => {
        if (alive) setFailed(true);
      },
    );
    return () => {
      alive = false;
    };
  }, [enabled, entries, locale]);

  return { entries, failed, loading: enabled && !entries && !failed };
}

export type UniversitySearchHit = {
  entry: UniversitySearchEntry;
  /** A faculty that matched the query, shown as the reason for the hit. */
  faculty: string | null;
  score: number;
};

type Prepared = {
  entry: UniversitySearchEntry;
  names: string[];
  acronym: string;
  places: string[];
  faculties: { display: string; folded: string }[];
};

const preparedCache = new WeakMap<UniversitySearchEntry[], Prepared[]>();

function prepare(entries: UniversitySearchEntry[]): Prepared[] {
  let prepared = preparedCache.get(entries);
  if (!prepared) {
    prepared = entries.map((entry) => ({
      entry,
      names: [entry.name, entry.altName ?? ""].map(normalize).filter(Boolean),
      acronym: normalize(entry.acronym ?? ""),
      places: [entry.city, entry.governorate ?? ""].map(normalize).filter(Boolean),
      faculties: [
        ...entry.faculties.map((display) => ({ display, folded: normalize(display) })),
        // Other-language faculty names are matched but the displayed reason
        // stays in the page language: pair each with its displayed twin.
        ...entry.altFaculties.map((alt, i) => ({
          display: entry.faculties[i] ?? alt,
          folded: normalize(alt),
        })),
      ],
    }));
    preparedCache.set(entries, prepared);
  }
  return prepared;
}

/**
 * Whether some word in `haystack` starts with `token`. Arabic words usually
 * carry the definite article, so "صيدلة" also matches "الصيدلة" and
 * "قاهرة" matches "القاهرة".
 */
function wordStarts(haystack: string, token: string) {
  return (
    haystack.startsWith(token) ||
    haystack.includes(` ${token}`) ||
    haystack.startsWith(`ال${token}`) ||
    haystack.includes(` ال${token}`)
  );
}

/**
 * Ranks universities for a free-text query. Every word has to match
 * somewhere (name, acronym, city/governorate or a faculty); name and
 * acronym matches outrank place and faculty matches.
 */
export function searchUniversities(
  entries: UniversitySearchEntry[],
  query: string,
  limit = 8,
): UniversitySearchHit[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];

  const hits: UniversitySearchHit[] = [];
  for (const item of prepare(entries)) {
    let score = 0;
    let faculty: string | null = null;
    let allMatched = true;

    for (const token of tokens) {
      let best = 0;
      if (item.acronym && item.acronym === token) best = 120;
      for (const name of item.names) {
        if (name.startsWith(token)) best = Math.max(best, 90);
        else if (wordStarts(name, token)) best = Math.max(best, 70);
        else if (token.length >= 3 && name.includes(token)) best = Math.max(best, 45);
      }
      if (item.acronym && token.length >= 2 && item.acronym.startsWith(token)) {
        best = Math.max(best, 80);
      }
      for (const place of item.places) {
        if (wordStarts(place, token)) best = Math.max(best, 40);
      }
      if (best < 40 && token.length >= 3) {
        const match = item.faculties.find((f) => wordStarts(f.folded, token));
        if (match) {
          best = Math.max(best, 30);
          faculty ??= match.display;
        }
      }
      if (best === 0) {
        allMatched = false;
        break;
      }
      score += best;
    }

    if (allMatched) hits.push({ entry: item.entry, faculty, score });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Splits `text` around the first case-insensitive occurrence of each query
 * word, for bolding the matched part of a result. Plain substring matching,
 * so an Arabic spelling variant that only matched after folding is simply
 * not highlighted (the result still shows).
 */
export function highlightParts(text: string, query: string): { text: string; hit: boolean }[] {
  const words = query.trim().split(/\s+/).filter((word) => word.length >= 1);
  if (words.length === 0) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const ranges: [number, number][] = [];
  for (const word of words) {
    const at = lower.indexOf(word.toLowerCase());
    if (at >= 0) ranges.push([at, at + word.length]);
  }
  if (ranges.length === 0) return [{ text, hit: false }];
  ranges.sort((a, b) => a[0] - b[0]);
  const parts: { text: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start < cursor) continue;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), hit: false });
    parts.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}
