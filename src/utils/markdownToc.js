/** Extract ## / ### headings for table-of-contents (order-preserving). */

/** @param {string} text */
export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

/**
 * @param {string} markdown
 * @returns {{ level: 2|3; text: string; id: string }[]}
 */
export function extractTocFromMarkdown(markdown) {
  const lines = String(markdown ?? "").split("\n");
  /** @type {{ level: 2|3; text: string; id: string }[]} */
  const items = [];
  const usedIds = new Map();

  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h2) {
      const text = h2[1].trim().replace(/\s+#+$/, "");
      let base = slugifyHeading(text) || "section";
      let id = base;
      let n = 1;
      while (usedIds.has(id)) {
        id = `${base}-${++n}`;
      }
      usedIds.set(id, true);
      items.push({ level: 2, text, id });
    } else if (h3) {
      const text = h3[1].trim().replace(/\s+#+$/, "");
      let base = slugifyHeading(text) || "subsection";
      let id = base;
      let n = 1;
      while (usedIds.has(id)) {
        id = `${base}-${++n}`;
      }
      usedIds.set(id, true);
      items.push({ level: 3, text, id });
    }
  }
  return items;
}
