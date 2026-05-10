import { BookPlus, Check, Copy, Linkedin } from "lucide-react";
import { useCallback, useState } from "react";
import { addReadLater, isInReadLater } from "@/utils/readLater";

/**
 * Share + read-later controls.
 *
 * @param {{
 *   url: string;
 *   title: string;
 *   post: { id: string; title: string; slug: string };
 *   layout?: 'vertical' | 'horizontal';
 *   labels: {
 *     shareHeading: string;
 *     copy: string;
 *     copied: string;
 *     readLater: string;
 *     savedToast: string;
 *     twitter: string;
 *     linkedin: string;
 *   };
 *   showToast: (msg: string, variant?: 'success'|'error'|'info') => void;
 * }} props
 */
export function ShareSidebar({
  url,
  title,
  post,
  layout = "vertical",
  labels,
  showToast,
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(() => isInReadLater(post.id));

  const tweet = useCallback(() => {
    const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(u, "_blank", "noopener,noreferrer");
  }, [title, url]);

  const linkedIn = useCallback(() => {
    const u = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(u, "_blank", "noopener,noreferrer");
  }, [url]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Could not copy", "error");
    }
  }, [url, showToast]);

  const readLater = useCallback(() => {
    addReadLater({
      id: post.id,
      title: post.title,
      slug: post.slug,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
    showToast(labels.savedToast, "success");
  }, [post.id, post.slug, post.title, labels.savedToast, showToast]);

  const btn =
    "inline-flex min-h-11 items-center gap-3 rounded-xl border border-[#1f1f1f] bg-[#111] px-4 py-2.5 text-sm text-[#d4d4d4] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  const stack =
    layout === "horizontal"
      ? "flex flex-row flex-wrap justify-center gap-3 sm:justify-start"
      : "flex flex-col gap-3";

  return (
    <div className={stack}>
      <p className="mb-1 w-full text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
        {labels.shareHeading}
      </p>
      <button type="button" className={btn} onClick={tweet} aria-label={labels.twitter}>
        <span className="w-5 text-center text-base font-semibold" aria-hidden>
          𝕏
        </span>
        <span>Twitter / X</span>
      </button>
      <button type="button" className={btn} onClick={linkedIn} aria-label={labels.linkedin}>
        <Linkedin className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
        <span>LinkedIn</span>
      </button>
      <button type="button" className={btn} onClick={copy} aria-label={labels.copy}>
        {copied ? (
          <Check className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
        ) : (
          <Copy className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
        )}
        <span>{copied ? labels.copied : labels.copy}</span>
      </button>
      <button
        type="button"
        className={btn}
        onClick={readLater}
        disabled={saved}
        aria-label={labels.readLater}
      >
        <BookPlus className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
        <span>{saved ? labels.savedToast : labels.readLater}</span>
      </button>
    </div>
  );
}
