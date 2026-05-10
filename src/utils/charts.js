import { site } from "@/config/site";
import { isPlaceholderGaId } from "@/utils/seo";

/**
 * Monthly series for admin area chart.
 * Published counts use `publishedAt`; draft counts use `updatedAt` (activity proxy).
 *
 * @param {import('@/lib/blogStorage').BlogPost[]} posts
 * @param {number} monthsBack
 * @returns {{ monthKey: string; label: string; published: number; drafts: number }[]}
 */
export function getPostsByMonth(posts, monthsBack = 6) {
  const now = new Date();
  const rows = [];
  for (let offset = monthsBack - 1; offset >= 0; offset -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const monthEnd = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ).getTime();
    let published = 0;
    let drafts = 0;
    for (const p of posts) {
      const iso = p.status === "published" ? p.publishedAt : p.updatedAt;
      const t = new Date(iso).getTime();
      if (t < monthStart || t > monthEnd) continue;
      if (p.status === "published") published += 1;
      else drafts += 1;
    }
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
    rows.push({ monthKey, label, published, drafts });
  }
  return rows;
}

/**
 * @param {import('@/lib/blogStorage').BlogPost[]} posts
 * @returns {{ name: string; value: number }[]}
 */
export function getPostsByCategory(posts) {
  /** @type {Record<string, number>} */
  const map = {};
  for (const p of posts) {
    const c = (p.category || "Uncategorized").trim() || "Uncategorized";
    map[c] = (map[c] ?? 0) + 1;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/**
 * @param {import('@/utils/messages').ContactMessage[]} messages
 * @param {number} daysBack
 */
export function getMessagesByDay(messages, daysBack = 14) {
  const rows = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = daysBack - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 86400000 - 1;
    let total = 0;
    let unread = 0;
    for (const m of messages) {
      const t = new Date(m.sentAt).getTime();
      if (t < dayStart || t > dayEnd) continue;
      total += 1;
      if (!m.read) unread += 1;
    }
    rows.push({
      dayKey: d.toISOString().slice(0, 10),
      dayLabel: d.toLocaleDateString(undefined, { weekday: "short" }),
      total,
      unread,
      read: total - unread,
    });
  }
  return rows;
}

/**
 * @typedef {'ok'|'warn'|'bad'} HealthIconStatus
 * @typedef {'dashboard'|'posts'|'seo'} HealthTargetTab
 * @typedef {{ id: string; label: string; valueText: string; hint?: string; iconStatus: HealthIconStatus; targetTab: HealthTargetTab }} HealthRow
 */

/**
 * @param {import('@/lib/blogStorage').BlogPost[]} posts
 * @param {import('@/utils/seo').MergedSEOConfig} merged
 * @param {{ robotsOk: boolean; sitemapOk: boolean }} net
 * @returns {HealthRow[]}
 */
export function getContentHealthRows(posts, merged, net) {
  const n = posts.length;
  let metaBoth = 0;
  let coverOk = 0;
  for (const p of posts) {
    if ((p.metaTitle || "").trim() && (p.metaDescription || "").trim()) {
      metaBoth += 1;
    }
    if ((p.coverImageUrl || "").trim()) coverOk += 1;
  }

  const metaFrac = n ? `${metaBoth}/${n}` : "0/0";
  const metaStatus =
    n === 0 ? "warn" : metaBoth === n ? "ok" : metaBoth >= n * 0.7 ? "warn" : "bad";

  const coverFrac = n ? `${coverOk}/${n}` : "0/0";
  const coverStatus =
    n === 0 ? "warn" : coverOk === n ? "ok" : coverOk >= n * 0.7 ? "warn" : "bad";

  const siteConfigured = Boolean(
    merged.global.siteTitle?.trim() &&
      merged.global.canonicalBaseUrl?.trim() &&
      merged.global.metaDescription?.trim(),
  );

  const gaOk = !isPlaceholderGaId(merged.global.googleAnalyticsId);

  return [
    {
      id: "meta_posts",
      label: "SEO Meta set on all posts?",
      valueText: metaFrac,
      iconStatus: /** @type {HealthIconStatus} */ (metaStatus),
      targetTab: "posts",
      hint: "Edit posts and fill meta title + description.",
    },
    {
      id: "covers",
      label: "All posts have cover image?",
      valueText: coverFrac,
      iconStatus: /** @type {HealthIconStatus} */ (coverStatus),
      targetTab: "posts",
    },
    {
      id: "site_seo",
      label: "Site SEO configured?",
      valueText: siteConfigured ? "✓" : "✗",
      iconStatus: siteConfigured ? "ok" : "bad",
      targetTab: "seo",
      hint: "Open Global Site SEO and save canonical URL + description.",
    },
    {
      id: "robots",
      label: "robots.txt present?",
      valueText: net.robotsOk ? "✓" : "✗",
      iconStatus: net.robotsOk ? "ok" : "bad",
      targetTab: "seo",
    },
    {
      id: "sitemap",
      label: "Sitemap configured?",
      valueText: net.sitemapOk ? "✓" : "✗",
      iconStatus: net.sitemapOk ? "ok" : "bad",
      targetTab: "seo",
    },
    {
      id: "ga4",
      label: "GA4 ID set?",
      valueText: gaOk ? "✓" : "✗",
      iconStatus: gaOk ? "ok" : "bad",
      targetTab: "seo",
      hint: `Default in site config: ${site.googleAnalyticsId}`,
    },
  ];
}
