import { useMemo, useState } from "react";
import { site } from "@/config/site";
import {
  estimateReadMinutes,
  excerptFromMarkdown,
  slugify,
} from "@/lib/blogStorage";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AdminMarkdownPanel } from "@/components/admin/AdminMarkdownPanel";
import { AdminSeoFields } from "@/components/admin/AdminSeoFields";

/**
 * Rich editor for a blog post (split markdown preview + SEO fields).
 *
 * @param {{
 *   initial: Partial<import('@/lib/blogStorage').BlogPost> | null;
 *   onSave: (post: Partial<import('@/lib/blogStorage').BlogPost>) => void;
 *   onCancel: () => void;
 * }} props
 */
export function AdminEditor({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slugManual, setSlugManual] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState(
    initial?.category ?? site.blogCategories[0],
  );
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [coverImageUrl, setCoverImageUrl] = useState(
    initial?.coverImageUrl ?? "",
  );
  const [bodyMarkdown, setBodyMarkdown] = useState(initial?.bodyMarkdown ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? "",
  );
  const [ogImage, setOgImage] = useState(initial?.ogImage ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonicalUrl ?? "");
  const [noIndex, setNoIndex] = useState(Boolean(initial?.noIndex));

  const previewMinutes = useMemo(
    () => estimateReadMinutes(bodyMarkdown),
    [bodyMarkdown],
  );

  const handleSave = () => {
    const slug = slugManual.trim() ? slugManual.trim() : slugify(title);
    onSave({
      ...(initial?.id ? { id: initial.id } : {}),
      title,
      slug,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImageUrl,
      bodyMarkdown,
      status,
      metaTitle,
      metaDescription,
      ogImage,
      canonicalUrl,
      noIndex,
      excerpt: excerptFromMarkdown(bodyMarkdown, 200),
      readTimeMinutes: previewMinutes,
    });
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <h2 className="font-display text-xl text-[var(--text-primary)]">
          {initial?.id ? site.admin.editLabel : site.admin.newPostLabel}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--text-primary)] hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {site.admin.cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-11 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-[#0a0a0a] hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {site.admin.saveLabel}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <AdminFormField label={site.admin.editorTitleLabel}>
            <input
              value={title}
              onChange={(e) => {
                const next = e.target.value;
                setTitle(next);
                if (!slugTouched) setSlugManual(slugify(next));
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </AdminFormField>
          <AdminFormField label={site.admin.slugLabel}>
            <input
              value={slugManual}
              onChange={(e) => {
                setSlugTouched(true);
                setSlugManual(e.target.value);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </AdminFormField>
          <AdminFormField label={site.admin.categoryLabel}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            >
              {site.blogCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label={site.admin.tagsLabel}>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </AdminFormField>
          <AdminFormField label={site.admin.coverLabel}>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </AdminFormField>
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt=""
              loading="lazy"
              className="max-h-48 w-full rounded-xl object-cover"
            />
          ) : null}

          <AdminFormField label={site.admin.statusLabel}>
            <label className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={status === "published"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "published" : "draft")
                }
                className="h-5 w-5 accent-[var(--accent)]"
              />
              {site.admin.publishLabel}
            </label>
          </AdminFormField>

          <AdminSeoFields
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            ogImage={ogImage}
            setOgImage={setOgImage}
            canonicalUrl={canonicalUrl}
            setCanonicalUrl={setCanonicalUrl}
            noIndex={noIndex}
            setNoIndex={setNoIndex}
          />
        </div>

        <AdminMarkdownPanel
          bodyMarkdown={bodyMarkdown}
          setBodyMarkdown={setBodyMarkdown}
          previewMinutes={previewMinutes}
        />
      </div>
    </div>
  );
}
