import { Search } from "lucide-react";
import { site } from "@/config/site";

/**
 * Category tabs + search input for the blog index.
 *
 * @param {{
 *   query: string;
 *   onQueryChange: (v: string) => void;
 *   activeCategory: string;
 *   onCategoryChange: (name: string) => void;
 * }} props
 */
export function BlogToolbar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
}) {
  const tabs = ["All", ...site.blogCategories];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={site.sections.blog.filtersAriaLabel}
      >
        {tabs.map((name) => {
          const selected = activeCategory === name;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onCategoryChange(name)}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#0a0a0a]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <label className="relative flex w-full max-w-md items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={site.sections.blog.searchPlaceholder}
          className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          type="search"
          aria-label={site.sections.blog.searchPlaceholder}
        />
      </label>
    </div>
  );
}
