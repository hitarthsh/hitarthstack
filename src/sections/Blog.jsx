import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { SectionReveal } from "@/components/SectionReveal";
import { BlogToolbar } from "@/components/BlogToolbar";
import { BlogSkeleton } from "@/components/BlogSkeleton";
import { BlogCard } from "@/components/BlogCard";
import { loadPosts } from "@/lib/blogStorage";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { getSEOConfig } from "@/utils/seo";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { trackEvent } from "@/analytics/analytics";
import { ACT_FILTER_CLICK, ACT_SEARCH, CAT_BLOG } from "@/analytics/eventConstants";

/**
 * Blog listing with filters, debounced search, and pagination.
 */
export function Blog() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 320);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const c = searchParams.get("category");
      const s = searchParams.get("search");
      if (c && site.blogCategories.includes(c)) setCategory(c);
      if (s) setQuery(s);
    });
    return () => cancelAnimationFrame(id);
  }, [searchParams]);

  const posts = loadPosts().filter((p) => p.status === "published");

  useEffect(() => {
    if (!debounced.trim()) return;
    trackEvent({
      category: CAT_BLOG,
      action: ACT_SEARCH,
      label: debounced.trim(),
    });
  }, [debounced]);

  const filtered = useMemo(() => {
    let list = posts;
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.excerpt, p.bodyMarkdown, ...(p.tags ?? [])].some((field) =>
          String(field).toLowerCase().includes(q),
        ),
      );
    }
    return list;
  }, [posts, category, debounced]);

  const pageSize = site.blogPageSize;
  const slice = filtered.slice(0, page * pageSize);
  const hasMore = slice.length < filtered.length;

  const onCategoryChange = (name) => {
    setCategory(name);
    setPage(1);
    if (name !== "All") {
      trackEvent({
        category: CAT_BLOG,
        action: ACT_FILTER_CLICK,
        label: name,
      });
    }
  };

  const seoMerged = getSEOConfig();
  const blogMetaDesc =
    seoMerged.global.metaDescription?.trim() ||
    site.seo.blogIndexDescription;
  const blogOg =
    seoMerged.global.ogDefaultImageUrl?.trim() || site.seo.defaultOgImage;

  return (
    <>
      <SEOHead
        title={site.seo.blogIndexTitle}
        description={blogMetaDesc}
        image={absoluteUrl(blogOg)}
        url={absoluteUrl("/blog")}
        type="website"
        author={site.seo.personName}
        tags={[]}
        breadcrumbVariant="blog"
      />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        <Navbar />
        <main className="container mx-auto px-6 pb-24 pt-28 md:pt-32">
          <SectionReveal className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {site.sections.blog.kicker}
            </p>
            <h1 className="mt-4 font-display text-4xl text-[var(--text-primary)] md:text-5xl">
              {site.sections.blog.title}
              <span className="text-[var(--text-muted)]">
                {" "}
                {site.sections.blog.titleAccent}
              </span>
            </h1>
            <p className="mt-4 text-[var(--text-muted)]">
              {site.sections.blog.description}
            </p>
          </SectionReveal>

          <div className="mb-10">
            <BlogToolbar
              query={query}
              onQueryChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              activeCategory={category}
              onCategoryChange={onCategoryChange}
            />
          </div>

          {!ready ? (
            <BlogSkeleton />
          ) : slice.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
              <p className="font-display text-2xl text-[var(--text-primary)]">
                {site.sections.blog.emptyTitle}
              </p>
              <p className="mt-2 text-[var(--text-muted)]">
                {site.sections.blog.emptyBody}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {slice.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="min-h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {site.sections.blog.loadMore}
              </button>
            </div>
          ) : null}
        </main>
        <Footer />
      </div>
    </>
  );
}
