import { site } from "@/config/site";

export const BLOG_STORAGE_KEY = "hitarth_blog_posts";

/** @typedef {'draft'|'published'} BlogStatus */

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} category
 * @property {string[]} tags
 * @property {string} coverImageUrl
 * @property {string} bodyMarkdown
 * @property {BlogStatus} status
 * @property {string} publishedAt
 * @property {string} updatedAt
 * @property {number} readTimeMinutes
 * @property {string} [metaTitle]
 * @property {string} [metaDescription]
 * @property {string} [ogImage]
 * @property {string} [canonicalUrl]
 * @property {boolean} [noIndex]
 * @property {string} excerpt
 * @property {string} [focusKeyword]
 */

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_\-\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** @param {string} md */
export function estimateReadMinutes(md) {
  const words = stripMarkdown(md || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** @param {string} md */
export function excerptFromMarkdown(md, maxLen = 160) {
  const t = stripMarkdown(md || "");
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trim()}…`;
}

/** @param {string} title */
export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `post_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** @returns {BlogPost[]} */
export function loadPosts() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return seedIfNeeded([]);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedIfNeeded([]);
    return parsed.map(normalizePost);
  } catch {
    return seedIfNeeded([]);
  }
}

/** @param {BlogPost[]} posts */
export function savePosts(posts) {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

/** @param {Partial<BlogPost>} data */
function normalizePost(data) {
  const now = new Date().toISOString();
  const body = String(data.bodyMarkdown ?? "");
  const title = String(data.title ?? "Untitled");
  const slug = data.slug ? String(data.slug) : slugify(title);
  const readTimeMinutes =
    typeof data.readTimeMinutes === "number"
      ? data.readTimeMinutes
      : estimateReadMinutes(body);
  const excerpt =
    typeof data.excerpt === "string" && data.excerpt
      ? data.excerpt
      : excerptFromMarkdown(body, 180);

  return {
    id: String(data.id ?? generateId()),
    title,
    slug,
    category: String(data.category ?? site.blogCategories[0] ?? "Notes"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImageUrl: String(data.coverImageUrl ?? ""),
    bodyMarkdown: body,
    status: data.status === "published" ? "published" : "draft",
    publishedAt: String(data.publishedAt ?? now),
    updatedAt: String(data.updatedAt ?? now),
    readTimeMinutes,
    metaTitle: data.metaTitle ? String(data.metaTitle) : "",
    metaDescription: data.metaDescription ? String(data.metaDescription) : "",
    ogImage: data.ogImage ? String(data.ogImage) : "",
    canonicalUrl: data.canonicalUrl ? String(data.canonicalUrl) : "",
    noIndex: Boolean(data.noIndex),
    excerpt,
    focusKeyword: data.focusKeyword ? String(data.focusKeyword) : "",
  };
}

/** @param {BlogPost[]} posts */
function seedIfNeeded(posts) {
  if (posts.length > 0) return posts;
  const seed = site.blogSeedPosts;
  if (!Array.isArray(seed) || seed.length === 0) return [];
  const normalized = seed.map((p) =>
    normalizePost({
      ...p,
      status: p.status === "draft" ? "draft" : "published",
    }),
  );
  savePosts(normalized);
  return normalized;
}

/** @param {Partial<BlogPost>} input */
export function upsertPost(input) {
  const posts = loadPosts();
  const existing = input.id ? posts.find((p) => p.id === input.id) : null;
  const now = new Date().toISOString();
  const merged = { ...existing, ...input };
  merged.updatedAt = now;
  if (merged.status === "published" && !merged.publishedAt) {
    merged.publishedAt = existing?.publishedAt || now;
  }
  const normalized = normalizePost(merged);
  const idx = posts.findIndex((p) => p.id === normalized.id);
  if (idx >= 0) posts[idx] = normalized;
  else posts.unshift(normalized);
  savePosts(posts);
  return normalized;
}

/** @param {string} id */
export function deletePost(id) {
  const next = loadPosts().filter((p) => p.id !== id);
  savePosts(next);
}

/** @param {string} slug */
export function findPublishedBySlug(slug) {
  return loadPosts().find((p) => p.slug === slug && p.status === "published");
}

/** @param {string} slug */
export function findAnyBySlug(slug) {
  return loadPosts().find((p) => p.slug === slug);
}
