import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

/**
 * @param {{
 *   items: { level: 2|3; text: string; id: string }[];
 *   showHeading?: boolean;
 *   variant?: 'sidebar' | 'accordion';
 * }} props
 */
export function TableOfContents({
  items,
  showHeading = true,
  variant = "sidebar",
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return undefined;
    const ids = items.map((i) => i.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) {
      obs.observe(el);
    }
    return () => obs.disconnect();
  }, [items]);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (items.length === 0) return null;

  const list = (
    <ul className="space-y-2 border-l border-[#1f1f1f] pl-3">
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollToId(item.id)}
              className={`flex w-full items-start gap-2 text-left transition-colors ${
                item.level === 3 ? "pl-3 text-xs text-[#6b6b6b]" : "text-sm text-[#d4d4d4]"
              } ${active ? "text-[var(--accent)]" : "hover:text-[#f0f0f0]"}`}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  active ? "bg-[var(--accent)]" : "bg-transparent"
                }`}
                aria-hidden
              />
              <span>{item.text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "accordion") {
    return (
      <details className="group mb-8 lg:hidden rounded-xl border border-[#1f1f1f] bg-[#111]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-[#f0f0f0] [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden>📋</span>
            {site.sections.blog.post.onThisPage}
          </span>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-[#6b6b6b] transition-transform duration-200 ease-out group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t border-[#1f1f1f] px-4 pb-4 pt-3">
          <nav
            aria-label="Table of contents"
            className="blog-toc-scroll max-h-[60vh] overflow-y-auto pr-1"
          >
            {list}
          </nav>
        </div>
      </details>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="blog-toc-scroll max-h-[60vh] overflow-y-auto pr-1"
    >
      {showHeading ? (
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
          {site.sections.blog.post.onThisPage}
        </p>
      ) : null}
      {list}
    </nav>
  );
}
