/**
 * Writes public/robots.txt and a baseline public/sitemap.xml from src/config/site.js.
 * Run: npm run generate:seo
 *
 * Skipped when SKIP_SEO_GENERATE=1 (e.g. local builds that should not touch public/).
 */
if (process.env.SKIP_SEO_GENERATE === "1") {
  console.log("Skipping SEO generation (SKIP_SEO_GENERATE=1).");
  process.exit(0);
}

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { site } from "../src/config/site.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "..", "public");

const base = site.siteUrl.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${base}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Dynamic post URLs appended at build time (posts live in localStorage client-side) -->
  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

writeFileSync(path.join(publicDir, "robots.txt"), robots);
writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

console.log("Wrote public/robots.txt and public/sitemap.xml using site.siteUrl:", base);
