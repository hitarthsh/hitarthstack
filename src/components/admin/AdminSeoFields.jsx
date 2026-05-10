import { site } from "@/config/site";
import { AdminFormField } from "@/components/admin/AdminFormField";

/**
 * SEO inputs persisted onto each post.
 *
 * @param {{
 *   metaTitle: string;
 *   setMetaTitle: (v: string) => void;
 *   metaDescription: string;
 *   setMetaDescription: (v: string) => void;
 *   ogImage: string;
 *   setOgImage: (v: string) => void;
 *   canonicalUrl: string;
 *   setCanonicalUrl: (v: string) => void;
 *   noIndex: boolean;
 *   setNoIndex: (v: boolean) => void;
 * }} props
 */
export function AdminSeoFields({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  ogImage,
  setOgImage,
  canonicalUrl,
  setCanonicalUrl,
  noIndex,
  setNoIndex,
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {site.admin.seoHeading}
      </p>
      <div className="mt-4 space-y-3">
        <AdminFormField label={site.admin.metaTitleLabel}>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </AdminFormField>
        <AdminFormField label={site.admin.metaDescriptionLabel}>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </AdminFormField>
        <AdminFormField label={site.admin.ogImageLabel}>
          <input
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </AdminFormField>
        <AdminFormField label={site.admin.canonicalUrlLabel}>
          <input
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--accent)]"
          />
        </AdminFormField>
        <label className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
          <input
            type="checkbox"
            checked={noIndex}
            onChange={(e) => setNoIndex(e.target.checked)}
            className="h-5 w-5 accent-[var(--accent)]"
          />
          {site.admin.noIndexLabel}
        </label>
      </div>
    </div>
  );
}
