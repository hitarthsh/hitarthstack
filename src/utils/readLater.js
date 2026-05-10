export const READ_LATER_KEY = "hitarth_read_later";

/**
 * @typedef {{ id: string; title: string; slug: string; savedAt: string }} ReadLaterEntry
 */

/** @returns {ReadLaterEntry[]} */
export function getReadLater() {
  try {
    const raw = localStorage.getItem(READ_LATER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x) =>
          x &&
          typeof x.id === "string" &&
          typeof x.slug === "string" &&
          typeof x.title === "string",
      )
      .map((x) => ({
        id: x.id,
        title: x.title,
        slug: x.slug,
        savedAt: typeof x.savedAt === "string" ? x.savedAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

/** @param {ReadLaterEntry} entry */
export function addReadLater(entry) {
  const list = getReadLater().filter((e) => e.id !== entry.id);
  list.unshift({
    ...entry,
    savedAt: entry.savedAt || new Date().toISOString(),
  });
  localStorage.setItem(READ_LATER_KEY, JSON.stringify(list.slice(0, 50)));
}

/** @param {string} postId */
export function isInReadLater(postId) {
  return getReadLater().some((e) => e.id === postId);
}
