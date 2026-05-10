import { BookMarked, X } from "lucide-react";
import { useState } from "react";
import { addReadLater } from "@/utils/readLater";
import { site } from "@/config/site";

const dismissKey = (slug) => `hitarth_read_later_banner_dismiss_${slug}`;

/**
 * @param {{
 *   slug: string;
 *   post: { id: string; title: string; slug: string };
 *   showToast: (msg: string, variant?: 'success'|'error'|'info') => void;
 * }} props
 */
export function BlogReadLaterBanner({ slug, post, showToast }) {
  const [gone, setGone] = useState(() => {
    try {
      return localStorage.getItem(dismissKey(slug)) === "1";
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem(dismissKey(slug), "1");
    } catch {
      /* ignore */
    }
    setGone(true);
  };

  const save = () => {
    addReadLater({
      id: post.id,
      title: post.title,
      slug: post.slug,
      savedAt: new Date().toISOString(),
    });
    showToast(site.sections.blog.post.savedToast, "success");
  };

  if (gone) return null;

  const copy = site.sections.blog.post;

  return (
    <div className="relative mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--accent)]/35 bg-[#111] px-5 py-4 pr-12">
      <BookMarked className="h-6 w-6 shrink-0 text-[var(--accent)]" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold text-[#f0f0f0]">{copy.enjoyPrompt}</p>
        <p className="text-sm text-[#a3a3a3]">{copy.saveForLaterHint}</p>
      </div>
      <button
        type="button"
        onClick={save}
        className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[#0a0a0a]"
      >
        {copy.save}
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-[#6b6b6b] hover:text-[#f0f0f0]"
        aria-label={copy.dismissBannerAria}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
