import { ArrowUpRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { site } from "@/config/site";

/**
 * @param {{ post: import('@/lib/blogStorage').BlogPost; variant?: 'default' | 'compact' }} props
 */
export function BlogCard({ post, variant = "default" }) {
  const compact = variant === "compact";
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      layout
      className="group h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/40"
      whileHover={compact ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      >
        <div
          className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}
        >
          <img
            src={post.coverImageUrl || site.seo.defaultOgImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] will-change-transform"
          />
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {post.category}
          </div>
        </div>
        <div className={`flex flex-1 flex-col gap-3 ${compact ? "p-4" : "p-5"}`}>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
            <time dateTime={post.publishedAt}>{date}</time>
            <span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readTimeMinutes} {site.sections.blog.minutesShort}
            </span>
          </div>
          <h3
            className={`font-display text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] ${compact ? "text-lg leading-snug" : "text-xl"}`}
          >
            {post.title}
          </h3>
          {compact ? null : (
            <p className="line-clamp-3 text-sm text-[var(--text-muted)]">{post.excerpt ?? ""}</p>
          )}
          {compact ? null : (
            <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
              {site.sections.blog.readArticle}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
