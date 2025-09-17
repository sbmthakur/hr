import { HarEntry } from "./types";

/**
 * Narrow HAR entries using a case-insensitive substring check across URL, method, and status.
 */
export function filterEntries(entries: HarEntry[], rawQuery: string): HarEntry[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return entries;
  }

  return entries.filter((entry) => {
    const candidates = [
      entry.request.url,
      entry.request.method,
      entry.response.status.toString(),
    ];

    return candidates.some((value) => value.toLowerCase().includes(query));
  });
}
