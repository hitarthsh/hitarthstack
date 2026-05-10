import { Link } from "react-router-dom";

/**
 * @param {{ tags: string[]; tagHref: (tag: string) => string }} props
 */
export function BlogPostTagsRow({ tags, tagHref }) {
  if (tags.length === 0) return null;
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={tagHref(tag)}
          className="rounded-full border border-[#1f1f1f] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

/**
 * @param {{
 *   tags: string[];
 *   tagHref: (tag: string) => string;
 *   taggedInPrefix: string;
 * }} props
 */
export function BlogPostTagsCloud({ tags, tagHref, taggedInPrefix }) {
  if (tags.length === 0) return null;
  return (
    <section className="mt-14 border-t border-[#1f1f1f] pt-10">
      <h2 className="font-display text-lg text-[#f0f0f0]">{taggedInPrefix}</h2>
      <p className="mt-3 flex flex-wrap gap-x-2 gap-y-2 text-base text-[#d4d4d4]">
        {tags.map((tag, i) => (
          <span key={tag}>
            {i > 0 ? <span className="text-[#3f3f3f]">, </span> : null}
            <Link
              to={tagHref(tag)}
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {tag}
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
