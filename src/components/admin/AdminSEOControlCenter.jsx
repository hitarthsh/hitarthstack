import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BlogMarkdownPreview } from "@/components/blog/BlogMarkdownPreview";
import { site } from "@/config/site";
import { upsertPost } from "@/lib/blogStorage";
import {
  calcPostSEOScore,
  exportSEOReportCSV,
  generateSitemapXML,
  getDefaultSEOConfig,
  getRobotsTxt,
  getSEOConfig,
  listSitemapEntries,
  saveRobotsTxt,
  saveSEOConfig,
} from "@/utils/seo";
import { getGaMeasurementId } from "@/analytics/analytics";

const ROBOTS_OPTIONS = [
  { value: "index, follow", label: "index, follow" },
  { value: "noindex, follow", label: "noindex, follow" },
  { value: "index, nofollow", label: "index, nofollow" },
  { value: "noindex, nofollow", label: "noindex, nofollow" },
];

const INPUT =
  "mt-1 w-full rounded-xl border border-[#1f1f1f] bg-[#111] px-3 py-2 text-sm text-[#f0f0f0] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
const LABEL = "block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]";

/**
 * @param {{
 *   posts: import('@/lib/blogStorage').BlogPost[];
 *   refreshPosts: () => void;
 *   showToast: (msg: string, variant?: 'success'|'error'|'info') => void;
 * }} props
 */
export function AdminSEOControlCenter({ posts, refreshPosts, showToast }) {
  const dc = site.admin.dashboardCharts;
  const defaults = useMemo(() => getDefaultSEOConfig(), []);

  const [cfg, setCfg] = useState(() => getSEOConfig());
  const hydrate = useCallback(() => setCfg(getSEOConfig()), []);

  const [robotsDraft, setRobotsDraft] = useState(() => getRobotsTxt());
  const [kwDraft, setKwDraft] = useState("");
  const [drawerPostId, setDrawerPostId] = useState(/** @type {string | null} */ (null));
  const [bulkSel, setBulkSel] = useState(/** @type {Record<string, boolean>} */ ({}));
  const [jsonModal, setJsonModal] = useState(/** @type {null | 'person'|'website'|'blog'} */ (null));

  useEffect(() => {
    if (getRobotsTxt().trim()) return;
    let cancelled = false;
    fetch("/robots.txt")
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => {
        if (!cancelled && t.trim()) setRobotsDraft(t);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const baseUrl =
    cfg.global.canonicalBaseUrl?.trim() || site.siteUrl.replace(/\/$/, "");

  const sitemapRows = useMemo(
    () => listSitemapEntries(baseUrl, posts, cfg),
    [baseUrl, posts, cfg],
  );

  const drawerPost = drawerPostId ? posts.find((p) => p.id === drawerPostId) : null;

  const demoPageTitle = site.seo.homeTitle;
  const sepShow = cfg.global.titleSeparator || " | ";
  const serpTitlePreview = `${demoPageTitle}${sepShow}${cfg.global.siteTitle || defaults.global.siteTitle}`;
  const titleLen = serpTitlePreview.length;
  const titleTone =
    titleLen <= 60 ? "text-emerald-400" : titleLen <= 70 ? "text-amber-400" : "text-red-400";

  const descLen = (cfg.global.metaDescription || "").length;
  const descTone =
    descLen <= 160 ? "text-emerald-400" : descLen <= 180 ? "text-amber-400" : "text-red-400";

  const scrollTo = (/** @type {string} */ id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveGlobal = () => {
    saveSEOConfig({
      global: {
        siteTitle: cfg.global.siteTitle,
        titleSeparator: cfg.global.titleSeparator,
        metaDescription: cfg.global.metaDescription,
        siteKeywords: cfg.global.siteKeywords,
        canonicalBaseUrl: cfg.global.canonicalBaseUrl.replace(/\/$/, ""),
        authorName: cfg.global.authorName,
        twitterHandle: cfg.global.twitterHandle.replace(/^@/, ""),
        ogDefaultImageUrl: cfg.global.ogDefaultImageUrl,
        robotsDefault: cfg.global.robotsDefault,
        googleAnalyticsId: cfg.global.googleAnalyticsId,
      },
    });
    hydrate();
    showToast("Global SEO updated ✦", "success");
  };

  const saveSocial = () => {
    saveSEOConfig({
      social: {
        ogTitle: cfg.social.ogTitle,
        ogDescription: cfg.social.ogDescription,
        ogImageUrl: cfg.social.ogImageUrl,
        twitterCardType: cfg.social.twitterCardType,
        twitterImageUrl: cfg.social.twitterImageUrl,
      },
    });
    hydrate();
    showToast("Social SEO saved ✦", "success");
  };

  const saveTechnicalToggles = () => {
    const fresh = getSEOConfig();
    saveSEOConfig({
      technical: {
        structuredData: { ...cfg.technical.structuredData },
        sitemapRows: { ...(fresh.technical.sitemapRows || {}) },
      },
    });
    hydrate();
    showToast("Technical preferences saved", "success");
  };

  const addKeywordsFromInput = () => {
    const parts = kwDraft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...new Set([...(cfg.global.siteKeywords || []), ...parts])];
    setCfg((c) => ({
      ...c,
      global: { ...c.global, siteKeywords: next },
    }));
    setKwDraft("");
  };

  const removeKeyword = (/** @type {string} */ k) => {
    setCfg((c) => ({
      ...c,
      global: {
        ...c.global,
        siteKeywords: (c.global.siteKeywords || []).filter((x) => x !== k),
      },
    }));
  };

  const patchSitemapRow = (
    /** @type {string} */ path,
    /** @type {Partial<{ changefreq: string; priority: number; lastmod: string }>} */ patch,
  ) => {
    const prevRows = getSEOConfig().technical.sitemapRows || {};
    saveSEOConfig({
      technical: {
        sitemapRows: {
          ...prevRows,
          [path]: { ...prevRows[path], ...patch },
        },
      },
    });
    hydrate();
  };

  const copyXml = async () => {
    const xml = generateSitemapXML({ baseUrl, posts, merged: getSEOConfig() });
    try {
      await navigator.clipboard.writeText(xml);
      showToast("Sitemap XML copied", "success");
    } catch {
      showToast("Copy failed", "error");
    }
  };

  const downloadXml = () => {
    const xml = generateSitemapXML({ baseUrl, posts, merged: getSEOConfig() });
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const bulkIds = Object.keys(bulkSel).filter((id) => bulkSel[id]);
  const bulkBar = bulkIds.length > 0;

  const runBulkNoIndex = (/** @type {boolean} */ nextNoIndex) => {
    for (const id of bulkIds) {
      const p = posts.find((x) => x.id === id);
      if (p) upsertPost({ ...p, noIndex: nextNoIndex });
    }
    setBulkSel({});
    refreshPosts();
    showToast(nextNoIndex ? "Marked noindex" : "Marked index", "success");
  };

  const exportBulkCsv = () => {
    const selPosts =
      bulkIds.length > 0 ? posts.filter((p) => bulkIds.includes(p.id)) : posts;
    const csv = exportSEOReportCSV(selPosts);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ogForPreview =
    cfg.social.ogImageUrl?.trim() ||
    cfg.global.ogDefaultImageUrl?.trim() ||
    site.seo.defaultOgImage;
  const ogTitlePreview =
    cfg.social.ogTitle?.trim() || cfg.global.siteTitle || defaults.global.siteTitle;
  const ogDescPreview =
    cfg.social.ogDescription?.trim() ||
    cfg.global.metaDescription ||
    defaults.global.metaDescription;

  const twitterCardIsLarge = cfg.social.twitterCardType === "summary_large_image";
  const twImg =
    cfg.social.twitterImageUrl?.trim() || ogForPreview;

  const checklist = [
    {
      ok: Boolean(cfg.global.canonicalBaseUrl?.trim()),
      label: "Canonical URLs configured",
      hint: "Set canonical base URL",
      go: () => scrollTo("seo-global"),
    },
    {
      ok: Boolean(cfg.global.robotsDefault?.trim()),
      label: "Meta robots set",
      hint: "Choose robots default",
      go: () => scrollTo("seo-global"),
    },
    {
      ok: Boolean(ogForPreview?.trim()),
      label: "OG tags present",
      hint: "Add OG image URL",
      go: () => scrollTo("seo-social"),
    },
    {
      ok: Boolean(cfg.social.twitterCardType),
      label: "Twitter cards present",
      hint: "Configure Twitter card",
      go: () => scrollTo("seo-social"),
    },
    {
      ok:
        cfg.technical.structuredData.person ||
        cfg.technical.structuredData.website ||
        cfg.technical.structuredData.blogPosting,
      label: "JSON-LD structured data enabled",
      hint: "Enable schema toggles",
      go: () => scrollTo("seo-technical-schema"),
    },
    {
      ok: Boolean(getGaMeasurementId()),
      label: "GA4 Measurement ID configured",
      hint: "Add GA4 ID",
      go: () => scrollTo("seo-global"),
    },
    {
      ok: Boolean(cfg.global.canonicalBaseUrl?.trim()),
      label: "Site URL set",
      hint: "Canonical base URL",
      go: () => scrollTo("seo-global"),
    },
  ];

  return (
    <div className="space-y-12 pb-24">
      <section id="seo-global" className="scroll-mt-28 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 md:p-8">
        <h2 className="font-display text-2xl text-[var(--text-primary)]">
          Global site SEO
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Site title">
            <input
              className={INPUT}
              value={cfg.global.siteTitle}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, siteTitle: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Title separator">
            <input
              className={INPUT}
              value={cfg.global.titleSeparator}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, titleSeparator: e.target.value },
                }))
              }
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Meta description">
              <textarea
                className={`${INPUT} min-h-[100px]`}
                maxLength={160}
                value={cfg.global.metaDescription}
                onChange={(e) =>
                  setCfg((c) => ({
                    ...c,
                    global: { ...c.global, metaDescription: e.target.value },
                  }))
                }
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {cfg.global.metaDescription.length}/160
              </p>
            </Field>
          </div>
          <div className="md:col-span-2">
            <span className={LABEL}>Site keywords</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(cfg.global.siteKeywords || []).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => removeKeyword(k)}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[#111] px-3 py-1 text-xs text-[var(--text-primary)]"
                >
                  {k}
                  <X className="h-3 w-3" aria-hidden />
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                className={`${INPUT} mt-0 flex-1 min-w-[200px]`}
                placeholder="comma-separated"
                value={kwDraft}
                onChange={(e) => setKwDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeywordsFromInput();
                  }
                }}
              />
              <button
                type="button"
                onClick={addKeywordsFromInput}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>
          <Field label="Canonical base URL">
            <input
              className={INPUT}
              value={cfg.global.canonicalBaseUrl}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, canonicalBaseUrl: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Author name">
            <input
              className={INPUT}
              value={cfg.global.authorName}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, authorName: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Twitter handle">
            <input
              className={INPUT}
              placeholder="@username"
              value={
                cfg.global.twitterHandle
                  ? `@${cfg.global.twitterHandle.replace(/^@/, "")}`
                  : "@"
              }
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: {
                    ...c.global,
                    twitterHandle: e.target.value.replace(/^@/, ""),
                  },
                }))
              }
            />
          </Field>
          <Field label="OG default image URL">
            <input
              className={INPUT}
              value={cfg.global.ogDefaultImageUrl}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, ogDefaultImageUrl: e.target.value },
                }))
              }
            />
          </Field>
          <div className="md:col-span-2">
            {cfg.global.ogDefaultImageUrl?.trim() ? (
              <img
                src={cfg.global.ogDefaultImageUrl}
                alt=""
                className="mt-2 max-h-40 rounded-xl border border-[var(--border)] object-cover"
              />
            ) : null}
          </div>
          <Field label="Robots default">
            <div className="mt-2 flex flex-col gap-2">
              {ROBOTS_OPTIONS.map((r) => (
                <label key={r.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="robotsdef"
                    checked={cfg.global.robotsDefault === r.value}
                    onChange={() =>
                      setCfg((c) => ({
                        ...c,
                        global: { ...c.global, robotsDefault: r.value },
                      }))
                    }
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Google Analytics ID">
            <input
              className={INPUT}
              placeholder="G-XXXXXXXXXX"
              value={cfg.global.googleAnalyticsId}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  global: { ...c.global, googleAnalyticsId: e.target.value.trim() },
                }))
              }
            />
          </Field>
        </div>

        <div className="rounded-2xl border border-[#1f1f1f] bg-[#111] p-5">
          <p className="text-xs text-[#6b6b6b]">
            {(cfg.global.canonicalBaseUrl || site.siteUrl).replace(/\/$/, "")}
          </p>
          <p className={`mt-2 text-[22px] font-medium leading-snug text-[#8ab4f8] ${titleTone}`}>
            {serpTitlePreview}
          </p>
          <p className={`mt-2 line-clamp-3 text-sm leading-relaxed text-[#bdc1c6] ${descTone}`}>
            {(cfg.global.metaDescription || "").slice(0, 160)}
          </p>
          <p className={`mt-3 text-xs ${titleTone}`}>
            Title: ~{titleLen} chars (green ≤60, yellow 61–70, red &gt;70)
          </p>
          <p className={`text-xs ${descTone}`}>Description: {descLen}/160</p>
        </div>

        <button
          type="button"
          onClick={saveGlobal}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a]"
        >
          Save Global SEO
        </button>
      </section>

      <section id="seo-social" className="scroll-mt-28 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 md:p-8">
        <h2 className="font-display text-2xl text-[var(--text-primary)]">
          Open Graph &amp; Social
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="OG title (optional)">
            <input
              className={INPUT}
              value={cfg.social.ogTitle}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  social: { ...c.social, ogTitle: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="OG description (optional)">
            <textarea
              className={`${INPUT} min-h-[80px]`}
              value={cfg.social.ogDescription}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  social: { ...c.social, ogDescription: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="OG image URL">
            <input
              className={INPUT}
              value={cfg.social.ogImageUrl}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  social: { ...c.social, ogImageUrl: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Twitter card type">
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="twcard"
                  checked={cfg.social.twitterCardType === "summary"}
                  onChange={() =>
                    setCfg((c) => ({
                      ...c,
                      social: { ...c.social, twitterCardType: "summary" },
                    }))
                  }
                />
                summary
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="twcard"
                  checked={cfg.social.twitterCardType === "summary_large_image"}
                  onChange={() =>
                    setCfg((c) => ({
                      ...c,
                      social: { ...c.social, twitterCardType: "summary_large_image" },
                    }))
                  }
                />
                summary_large_image
              </label>
            </div>
          </Field>
          <Field label="Twitter image URL">
            <input
              className={INPUT}
              value={cfg.social.twitterImageUrl}
              onChange={(e) =>
                setCfg((c) => ({
                  ...c,
                  social: { ...c.social, twitterImageUrl: e.target.value },
                }))
              }
            />
          </Field>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
              Facebook / LinkedIn preview
            </p>
            <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111]">
              <div className="aspect-[1200/630] w-full bg-[#1a1a1a]">
                {ogForPreview ? (
                  <img src={ogForPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6b6b6b]">
                    OG Image — 1200×630
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="text-[10px] uppercase text-[#6b6b6b]">
                  {(cfg.global.canonicalBaseUrl || "").replace(/^https?:\/\//, "")}
                </p>
                <p className="font-semibold text-[var(--text-primary)]">{ogTitlePreview}</p>
                <p className="line-clamp-2 text-sm text-[#6b6b6b]">{ogDescPreview}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
              Twitter preview
            </p>
            <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111]">
              <div
                className={
                  twitterCardIsLarge
                    ? "aspect-[2/1] w-full bg-[#1a1a1a]"
                    : "hidden"
                }
              >
                {twImg ? (
                  <img src={twImg} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6b6b6b]">
                    Twitter image — 2:1
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="font-semibold text-[var(--text-primary)]">{ogTitlePreview}</p>
                <p className="line-clamp-3 text-sm text-[#6b6b6b]">{ogDescPreview}</p>
                <p className="text-[10px] text-[#6b6b6b]">
                  {(cfg.global.canonicalBaseUrl || "").replace(/^https?:\/\//, "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={saveSocial}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a]"
        >
          Save social SEO
        </button>
      </section>

      <section id="seo-posts" className="scroll-mt-28 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 md:p-8">
        <h2 className="font-display text-2xl text-[var(--text-primary)]">
          Blog post SEO manager
        </h2>
        {bulkBar ? (
          <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[#111] p-3">
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
              onClick={() => runBulkNoIndex(false)}
            >
              Set all to index
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
              onClick={() => runBulkNoIndex(true)}
            >
              Set all to noindex
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
              onClick={exportBulkCsv}
            >
              Export SEO report CSV
            </button>
          </div>
        ) : null}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="min-w-full divide-y divide-[var(--border)] text-sm">
            <thead className="bg-[var(--surface)] text-left text-[var(--text-muted)]">
              <tr>
                <th className="px-3 py-2">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Meta title</th>
                <th className="px-3 py-2">Meta desc</th>
                <th className="px-3 py-2">OG image</th>
                <th className="px-3 py-2">Index?</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
              {posts.map((p) => {
                const { score, band } = calcPostSEOScore(p);
                const pill =
                  band === "Good"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : band === "Needs work"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-red-500/15 text-red-400";
                const bandLabel =
                  band === "Good"
                    ? dc.scoreGood
                    : band === "Needs work"
                      ? dc.scoreNeedsWork
                      : dc.scorePoor;
                return (
                  <tr key={p.id}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(bulkSel[p.id])}
                        onChange={(e) =>
                          setBulkSel((s) => ({ ...s, [p.id]: e.target.checked }))
                        }
                        aria-label={`Select ${p.title}`}
                      />
                    </td>
                    <td className="max-w-[140px] truncate px-3 py-2 font-medium">{p.title}</td>
                    <td className="max-w-[120px] truncate px-3 py-2 text-[var(--text-muted)]">
                      {(p.metaTitle || "—").slice(0, 40)}
                    </td>
                    <td className="max-w-[120px] truncate px-3 py-2 text-[var(--text-muted)]">
                      {(p.metaDescription || "—").slice(0, 40)}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-muted)]">
                      {p.ogImage?.trim() ? "✓" : "—"}
                    </td>
                    <td className="px-3 py-2">{p.noIndex ? "no" : "yes"}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pill}`}>
                        {score} · {bandLabel}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                        onClick={() => setDrawerPostId(p.id)}
                      >
                        Edit SEO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scroll-mt-28 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 md:p-8">
        <h2 className="font-display text-2xl text-[var(--text-primary)]">Technical SEO</h2>

        <div id="seo-robots-txt">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">robots.txt editor</h3>
          <textarea
            className={`${INPUT} mt-2 min-h-[180px] font-mono text-xs`}
            value={robotsDraft}
            onChange={(e) => setRobotsDraft(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#0a0a0a]"
              onClick={() => {
                saveRobotsTxt(robotsDraft);
                showToast("robots.txt saved locally", "success");
              }}
            >
              Save robots.txt
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              onClick={() => {
                fetch("/robots.txt")
                  .then((r) => (r.ok ? r.text() : ""))
                  .then(setRobotsDraft)
                  .catch(() => showToast("Reset failed", "error"));
              }}
            >
              Reset to default
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Stored in localStorage for reference/copy; live serving still uses{" "}
            <code className="font-mono">public/robots.txt</code> unless your host is configured
            otherwise.
          </p>
        </div>

        <div id="seo-sitemap">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Sitemap manager</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-full divide-y divide-[var(--border)] text-xs">
              <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-3 py-2 text-left">URL</th>
                  <th className="px-3 py-2 text-left">Last modified</th>
                  <th className="px-3 py-2 text-left">Change freq</th>
                  <th className="px-3 py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
                {sitemapRows.map((row) => (
                  <tr key={row.path}>
                    <td className="px-3 py-2 font-mono text-[var(--text-muted)]">{row.loc}</td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        className={INPUT}
                        value={row.lastmod.slice(0, 10)}
                        onChange={(e) =>
                          patchSitemapRow(row.path, { lastmod: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className={INPUT}
                        value={row.changefreq}
                        onChange={(e) =>
                          patchSitemapRow(row.path, { changefreq: e.target.value })
                        }
                      >
                        {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map(
                          (x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        max={1}
                        className={INPUT}
                        value={row.priority}
                        onChange={(e) =>
                          patchSitemapRow(row.path, {
                            priority: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyXml}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            >
              Copy Sitemap XML
            </button>
            <button
              type="button"
              onClick={downloadXml}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            >
              Download sitemap.xml
            </button>
          </div>
        </div>

        <div id="seo-technical-schema">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Structured data</h3>
          <div className="mt-3 space-y-3">
            {(
              [
                ["person", "Person schema"],
                ["website", "WebSite schema"],
                ["blogPosting", "BlogPosting on articles"],
              ]
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={cfg.technical.structuredData[key]}
                  onChange={(e) =>
                    setCfg((c) => ({
                      ...c,
                      technical: {
                        ...c.technical,
                        structuredData: {
                          ...c.technical.structuredData,
                          [key]: e.target.checked,
                        },
                      },
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs"
              onClick={() => setJsonModal("person")}
            >
              Preview Person JSON-LD
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs"
              onClick={() => setJsonModal("website")}
            >
              Preview WebSite JSON-LD
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs"
              onClick={() => setJsonModal("blog")}
            >
              Preview BlogPosting JSON-LD
            </button>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
            >
              Validate (Rich Results)
            </a>
          </div>
          <button
            type="button"
            onClick={saveTechnicalToggles}
            className="mt-4 rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          >
            Save structured data toggles
          </button>
        </div>

        <div id="seo-checklist">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Indexing checklist</h3>
          <ul className="mt-3 space-y-2">
            {checklist.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={item.go}
                  className="flex w-full items-start gap-3 rounded-xl border border-[var(--border)] bg-[#111] px-4 py-3 text-left text-sm hover:border-[var(--accent)]/40"
                >
                  <span className={item.ok ? "text-emerald-400" : "text-red-400"}>
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <span>
                    <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                    <span className="mt-1 block text-xs text-[var(--text-muted)]">{item.hint}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {drawerPost ? (
        <PostSeoDrawer
          post={drawerPost}
          baseUrl={baseUrl}
          onClose={() => setDrawerPostId(null)}
          onSaved={() => {
            refreshPosts();
            showToast("Post SEO saved ✦", "success");
            setDrawerPostId(null);
          }}
        />
      ) : null}

      {jsonModal ? (
        <JsonPreviewModal
          kind={jsonModal}
          merged={cfg}
          onClose={() => setJsonModal(null)}
        />
      ) : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

/**
 * @param {{
 *   post: import('@/lib/blogStorage').BlogPost;
 *   baseUrl: string;
 *   onClose: () => void;
 *   onSaved: () => void;
 * }} props
 */
function PostSeoDrawer({ post, baseUrl, onClose, onSaved }) {
  const [metaTitle, setMetaTitle] = useState(post.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(post.metaDescription || "");
  const [ogImage, setOgImage] = useState(post.ogImage || "");
  const [canonicalUrl, setCanonicalUrl] = useState(
    post.canonicalUrl || `${baseUrl}/blog/${post.slug}`,
  );
  const [noIndex, setNoIndex] = useState(Boolean(post.noIndex));
  const [focusKeyword, setFocusKeyword] = useState(post.focusKeyword || "");

  const titlePrev = metaTitle.trim() || post.title;
  const descPrev = metaDescription.trim();

  const hl = (/** @type {string} */ text) => {
    const kw = focusKeyword.trim();
    if (!kw) return text;
    const idx = text.toLowerCase().indexOf(kw.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="rounded bg-[var(--accent)]/30 px-0.5 text-[var(--text-primary)]">
          {text.slice(idx, idx + kw.length)}
        </mark>
        {text.slice(idx + kw.length)}
      </>
    );
  };

  const save = () => {
    upsertPost({
      ...post,
      metaTitle,
      metaDescription,
      ogImage,
      canonicalUrl,
      noIndex,
      focusKeyword,
    });
    onSaved();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-lg flex-col border-l border-[var(--border)] bg-[var(--bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h3 className="font-display text-lg">Edit SEO · {post.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] p-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <Field label={`Meta title (${metaTitle.length}/60)`}>
            <input
              className={INPUT}
              maxLength={60}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </Field>
          <Field label={`Meta description (${metaDescription.length}/160)`}>
            <textarea
              className={`${INPUT} min-h-[100px]`}
              maxLength={160}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </Field>
          <Field label="OG image URL">
            <input className={INPUT} value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
          </Field>
          {ogImage.trim() ? (
            <img src={ogImage} alt="" className="max-h-32 rounded-lg border border-[var(--border)]" />
          ) : null}
          <Field label="Canonical URL">
            <input
              className={INPUT}
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
            />
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Default: {`${baseUrl}/blog/${post.slug}`}
            </p>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={noIndex}
              onChange={(e) => setNoIndex(e.target.checked)}
            />
            noindex
          </label>
          <Field label="Focus keyword">
            <input
              className={INPUT}
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
            />
          </Field>

          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4">
            <p className="text-xs text-[#6b6b6b]">{canonicalUrl}</p>
            <p className="mt-2 text-lg font-medium text-[#8ab4f8]">{hl(titlePrev)}</p>
            <p className="mt-2 text-sm text-[#bdc1c6]">{hl(descPrev)}</p>
          </div>

          <div>
            <p className={`${LABEL} mb-2`}>Article preview</p>
            <div className="max-h-[min(40vh,22rem)] overflow-auto rounded-xl border border-violet-950/50 bg-black p-4 ring-1 ring-violet-500/10">
              <BlogMarkdownPreview
                markdown={post.bodyMarkdown || ""}
                metaLine={`Preview · ~${post.readTimeMinutes} ${site.sections.blog.minutesShort}`}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border)] p-4">
          <button
            type="button"
            onClick={save}
            className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-[#0a0a0a]"
          >
            Save post SEO
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * @param {{
 *   kind: 'person'|'website'|'blog';
 *   merged: ReturnType<typeof getSEOConfig>;
 *   onClose: () => void;
 * }} props
 */
function JsonPreviewModal({ kind, merged, onClose }) {
  const origin = site.siteUrl.replace(/\/$/, "");
  let payload;
  if (kind === "person") {
    payload = {
      "@context": site.seo.schemaOrgContext,
      "@type": "Person",
      name: merged.global.authorName || site.seo.personName,
      url: site.seo.jsonLdPersonUrl || origin,
    };
  } else if (kind === "website") {
    payload = {
      "@context": site.seo.schemaOrgContext,
      "@type": "WebSite",
      name: merged.global.siteTitle || site.seo.siteNameOg,
      url: `${origin}/`,
      description: merged.global.metaDescription || site.seo.defaultDescription,
    };
  } else {
    payload = {
      "@context": site.seo.schemaOrgContext,
      "@type": "BlogPosting",
      headline: "Example article title",
      description: "Example description for preview only.",
      author: {
        "@type": "Person",
        name: merged.global.authorName || site.seo.personName,
      },
    };
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-[100] bg-black/70"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[110] max-h-[80vh] w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[#111] p-4 shadow-2xl">
        <div className="mb-3 flex justify-between gap-2">
          <span className="font-semibold text-[var(--text-primary)]">JSON-LD preview</span>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)]">
            Close
          </button>
        </div>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-xl bg-[#0a0a0a] p-4 font-mono text-[11px] leading-relaxed text-emerald-200/90">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </>
  );
}
