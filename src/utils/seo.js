import { site } from "@/config/site";

export const SEO_CONFIG_KEY = "hitarth_seo_config";
export const ROBOTS_TXT_KEY = "hitarth_robots_txt";
export const SEO_UPDATED_EVENT = "hitarth-seo-updated";

/**
 * @typedef {object} SEOGlobalConfig
 * @property {string} siteTitle
 * @property {string} titleSeparator
 * @property {string} metaDescription
 * @property {string[]} siteKeywords
 * @property {string} canonicalBaseUrl
 * @property {string} authorName
 * @property {string} twitterHandle
 * @property {string} ogDefaultImageUrl
 * @property {string} robotsDefault
 * @property {string} googleAnalyticsId
 */

/**
 * @typedef {object} SEOSocialConfig
 * @property {string} ogTitle
 * @property {string} ogDescription
 * @property {string} ogImageUrl
 * @property {'summary'|'summary_large_image'} twitterCardType
 * @property {string} twitterImageUrl
 */

/**
 * @typedef {object} SEOStructuredToggles
 * @property {boolean} person
 * @property {boolean} website
 * @property {boolean} blogPosting
 */

/**
 * @typedef {object} SEOTechnicalConfig
 * @property {SEOStructuredToggles} structuredData
 * @property {Record<string, { changefreq?: string; priority?: number; lastmod?: string }>} sitemapRows
 */

/**
 * @typedef {object} MergedSEOConfig
 * @property {SEOGlobalConfig} global
 * @property {SEOSocialConfig} social
 * @property {SEOTechnicalConfig} technical
 */

export function isPlaceholderGaId(id) {
  return !id || String(id).trim() === "" || String(id) === "G-XXXXXXXXXX";
}

function readRawOverrides() {
  try {
    const raw = localStorage.getItem(SEO_CONFIG_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw);
    if (typeof p !== "object" || p === null || Array.isArray(p)) return {};
    return p;
  } catch {
    return {};
  }
}

function deepMerge(
  /** @type {Record<string, unknown>} */ base,
  /** @type {Record<string, unknown>} */ patch,
) {
  if (!patch || typeof patch !== "object") return base;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const pv = patch[k];
    const bv = base[k];
    if (Array.isArray(pv)) {
      out[k] = pv;
      continue;
    }
    if (
      pv &&
      typeof pv === "object" &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[k] = deepMerge(
        /** @type {Record<string, unknown>} */ (
          /** @type {unknown} */ (bv)
        ),
        /** @type {Record<string, unknown>} */ (
          /** @type {unknown} */ (pv)
        ),
      );
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out;
}

/** @returns {MergedSEOConfig} */
export function getDefaultSEOConfig() {
  const tw = String(site.twitterHandle ?? "").replace(/^@/, "");
  return {
    global: {
      siteTitle: site.seo.siteNameOg,
      titleSeparator: " | ",
      metaDescription: site.seo.defaultDescription,
      siteKeywords: [],
      canonicalBaseUrl: site.siteUrl.replace(/\/$/, ""),
      authorName: site.seo.personName,
      twitterHandle: tw,
      ogDefaultImageUrl: site.seo.defaultOgImage,
      robotsDefault: site.seo.robotsIndexFollow,
      googleAnalyticsId: site.googleAnalyticsId,
    },
    social: {
      ogTitle: "",
      ogDescription: "",
      ogImageUrl: "",
      twitterCardType:
        site.seo.twitterCard === "summary" ? "summary" : "summary_large_image",
      twitterImageUrl: "",
    },
    technical: {
      structuredData: {
        person: true,
        website: true,
        blogPosting: true,
      },
      sitemapRows: {},
    },
  };
}

/** @returns {MergedSEOConfig} */
export function getSEOConfig() {
  const defaults = getDefaultSEOConfig();
  const ov = readRawOverrides();
  return /** @type {MergedSEOConfig} */ (
    /** @type {unknown} */ (deepMerge(
      /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (defaults)),
      ov,
    ))
  );
}

/** @param {Partial<{ global?: Partial<SEOGlobalConfig>; social?: Partial<SEOSocialConfig>; technical?: Partial<SEOTechnicalConfig & { structuredData?: Partial<SEOStructuredToggles>; sitemapRows?: SEOTechnicalConfig['sitemapRows'] }> }>} partial */
export function saveSEOConfig(partial) {
  const current = readRawOverrides();
  const next = deepMerge(current, /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (partial)));
  localStorage.setItem(SEO_CONFIG_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(SEO_UPDATED_EVENT));
}

/** @param {string} content */
export function saveRobotsTxt(content) {
  localStorage.setItem(ROBOTS_TXT_KEY, String(content));
}

export function getRobotsTxt() {
  try {
    return localStorage.getItem(ROBOTS_TXT_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * @param {import('@/lib/blogStorage').BlogPost} post
 * @returns {{ score: number; issues: string[]; band: 'Good'|'Needs work'|'Poor' }}
 */
export function calcPostSEOScore(post) {
  let score = 0;
  const issues = [];
  const mt = (post.metaTitle || "").trim();
  const md = (post.metaDescription || "").trim();
  const og = (post.ogImage || "").trim();

  if (mt) score += 20;
  else issues.push("Missing meta title");

  if (md.length >= 50) score += 20;
  else issues.push("Meta description under 50 characters");

  if (og) score += 20;
  else issues.push("Missing OG image URL");

  if (mt.length >= 30 && mt.length <= 60) score += 20;
  else if (mt) issues.push("Meta title length should be 30–60 characters");

  if (md.length >= 120 && md.length <= 160) score += 20;
  else if (md) issues.push("Meta description length should be 120–160 characters");

  score = Math.min(100, score);
  let band = /** @type {'Good'|'Needs work'|'Poor'} */ ("Poor");
  if (score >= 80) band = "Good";
  else if (score >= 50) band = "Needs work";

  return { score, issues, band };
}

/**
 * @param {import('@/lib/blogStorage').BlogPost[]} posts
 */
export function exportSEOReportCSV(posts) {
  const headers = ["Title", "Score", "Issues"];
  const escape = (/** @type {string} */ cell) => {
    const s = String(cell ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const rows = posts.map((p) => {
    const { score, issues } = calcPostSEOScore(p);
    return [p.title, String(score), issues.join("; ")].map(escape).join(",");
  });
  return [headers.join(","), ...rows].join("\r\n");
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {{
 *   baseUrl: string;
 *   posts: import('@/lib/blogStorage').BlogPost[];
 *   merged?: MergedSEOConfig;
 * }} opts
 */
/**
 * @param {string} origin
 * @param {import('@/lib/blogStorage').BlogPost[]} posts
 * @param {MergedSEOConfig} merged
 */
export function listSitemapEntries(origin, posts, merged) {
  const m = merged ?? getSEOConfig();
  const rows = m.technical.sitemapRows || {};
  const o = origin.replace(/\/$/, "");
  const today = new Date().toISOString().slice(0, 10);
  /** @type {{ path: string; loc: string; changefreq: string; priority: number; lastmod: string }[]} */
  const list = [];

  const push = (
    /** @type {string} */ path,
    /** @type {{ changefreq: string; priority: number; lastmod: string }} */ defaults,
  ) => {
    const ov = rows[path] || {};
    list.push({
      path,
      loc: `${o}${path}`,
      changefreq: String(ov.changefreq ?? defaults.changefreq),
      priority:
        typeof ov.priority === "number"
          ? Math.min(1, Math.max(0.1, ov.priority))
          : defaults.priority,
      lastmod: String(ov.lastmod ?? defaults.lastmod),
    });
  };

  push("/", { changefreq: "weekly", priority: 1, lastmod: today });
  push("/blog", { changefreq: "weekly", priority: 0.9, lastmod: today });
  for (const p of posts.filter((x) => x.status === "published")) {
    const path = `/blog/${p.slug}`;
    push(path, {
      changefreq: "monthly",
      priority: 0.7,
      lastmod: (p.updatedAt || p.publishedAt).slice(0, 10),
    });
  }
  return list;
}

export function generateSitemapXML({ baseUrl, posts, merged }) {
  const origin = baseUrl.replace(/\/$/, "");
  const m = merged ?? getSEOConfig();
  const entries = listSitemapEntries(origin, posts, m);

  const body = entries
    .map(
      (e) => `
  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${escapeXml(e.lastmod)}</lastmod>
    <changefreq>${escapeXml(e.changefreq)}</changefreq>
    <priority>${Number(e.priority).toFixed(1)}</priority>
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
}
