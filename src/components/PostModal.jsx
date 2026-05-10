import { X, Share2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { BlogMarkdownPreview } from "@/components/blog/BlogMarkdownPreview";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import { ACT_POST_SHARE, CAT_BLOG } from "@/analytics/eventConstants";
import { absoluteUrl } from "@/lib/seo";

/**
 * Full-viewport slide-over for reading a post.
 *
 * @param {{ post: import('@/lib/blogStorage').BlogPost; onClose: () => void }} props
 */
export function PostModal({ post, onClose }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const closeEl = closeRef.current;
    closeEl?.focus();

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const root = panelRef.current;
    const focusable = root?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const trap = (e) => {
      if (e.key !== "Tab" || !focusable?.length) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    root?.addEventListener("keydown", trap);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      root?.removeEventListener("keydown", trap);
    };
  }, [onClose]);

  const share = async () => {
    const url = absoluteUrl(`/blog/${post.slug}`);
    trackEvent({
      category: CAT_BLOG,
      action: ACT_POST_SHARE,
      label: post.title,
    });
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* noop */
    }
  };

  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`post-title-${post.slug}`}
          className="flex h-full w-full max-w-3xl flex-col border-l border-violet-950/80 bg-black shadow-2xl"
          initial={reduce ? false : { x: "100%" }}
          animate={{ x: 0 }}
          exit={reduce ? undefined : { x: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
        >
          <header className="flex items-center justify-between gap-3 border-b border-zinc-900 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-mono text-zinc-500">
                {post.category} · {date} · ~{post.readTimeMinutes}{" "}
                {site.sections.blog.minutesShort}
              </p>
              <h2
                id={`post-title-${post.slug}`}
                className="truncate font-mono text-2xl font-bold tracking-tight text-white"
              >
                {post.title}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={share}
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-zinc-800 px-4 text-sm text-zinc-200 transition-colors hover:border-violet-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Share2 className="mr-2 h-4 w-4" aria-hidden />
                {site.sections.blog.shareLabel}
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-zinc-200 transition-colors hover:border-violet-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label="Close article"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </header>

          <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-zinc-900">
            <img
              src={post.coverImageUrl || site.seo.defaultOgImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-8">
            <BlogMarkdownPreview markdown={post.bodyMarkdown} />
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
