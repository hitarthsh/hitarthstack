import { site } from "@/config/site";

/**
 * @param {string} pathOrUrl
 */
export function absoluteUrl(pathOrUrl) {
  const base = site.siteUrl.replace(/\/$/, "");
  if (!pathOrUrl) return base;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}
