import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareSidebar } from "@/components/ShareSidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { RelatedPosts } from "@/components/RelatedPosts";
import { AuthorCard } from "@/components/AuthorCard";
import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { BlogArticleMarkdown } from "@/components/blog/BlogArticleMarkdown";
import { BlogPostHero } from "@/components/blog/BlogPostHero";
import { BlogReadLaterBanner } from "@/components/blog/BlogReadLaterBanner";
import { BlogPostTagsCloud, BlogPostTagsRow } from "@/components/blog/BlogPostTags";
import { loadPosts } from "@/lib/blogStorage";
import { site } from "@/config/site";
import { extractTocFromMarkdown } from "@/utils/markdownToc";
import { getRelatedPosts } from "@/utils/relatedPosts";
import { useToast } from "@/context/ToastContext";

/**
 * @param {{ post: import('@/lib/blogStorage').BlogPost }} props
 */
export function BlogPost({ post }) {
  const reduce = useReducedMotion();
  const { showToast } = useToast();
  const [shareUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.href : "",
  );

  const tocItems = useMemo(
    () => extractTocFromMarkdown(post.bodyMarkdown),
    [post.bodyMarkdown],
  );

  const related = useMemo(() => {
    const published = loadPosts().filter((p) => p.status === "published");
    return getRelatedPosts(post, published, 3);
  }, [post]);

  const coverSrc = post.coverImageUrl?.trim() || site.seo.defaultOgImage;
  const datePublished = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dateUpdated = new Date(post.updatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const copy = site.sections.blog.post;

  const tagHref = (tag) => {
    if (site.blogCategories.includes(tag)) {
      return `/blog?category=${encodeURIComponent(tag)}`;
    }
    return `/blog?search=${encodeURIComponent(tag)}`;
  };

  const tags = post.tags?.length ? post.tags : [];

  const shareLabels = {
    shareHeading: copy.shareThisPost,
    copy: copy.copyLink,
    copied: copy.copied,
    readLater: copy.readLaterCta,
    savedToast: copy.savedToast,
    twitter: copy.twitterShareLabel,
    linkedin: copy.linkedinShareLabel,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[var(--text-primary)]">
      <ReadingProgress ariaLabel={copy.readingProgressAria} />
      <Navbar />

      {/* Hero heights + title clamp via descendant selectors; top padding clears fixed navbar */}
      <div className="pt-[4.5rem] sm:pt-20 md:pt-[5.25rem] [&>div>div:first-child]:h-[260px] md:[&>div>div:first-child]:h-[360px] lg:[&>div>div:first-child]:h-[480px] [&_h1]:!text-[clamp(1.75rem,5vw,4rem)]">
        <BlogPostHero
          title={post.title}
          category={post.category}
          readMinutes={post.readTimeMinutes}
          minutesShort={site.sections.blog.minutesShort}
          dateLabel={datePublished}
          coverSrc={coverSrc}
        />
      </div>

      <div className="mx-auto max-w-[1020px] px-4 pb-24 pt-2 md:px-6">
        <p className="mx-auto max-w-[min(720px,100%)] font-mono text-sm text-[#6b6b6b]">
          <span aria-hidden>{copy.estimatedReadPrefix}</span> {post.readTimeMinutes}{" "}
          {site.sections.blog.minutesShort}
          <span className="mx-2 text-[#2a2a2a]" aria-hidden>
            ·
          </span>
          {copy.lastUpdatedPrefix} {dateUpdated}
        </p>

        <motion.div
          className="mx-auto mt-8 max-w-[min(720px,100%)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.5 }}
        >
          <AuthorCard
            variant="compact"
            publishedLabel={datePublished}
            readMinutes={post.readTimeMinutes}
            minutesShort={site.sections.blog.minutesShort}
          />
        </motion.div>

        <div className="mt-2 grid gap-12 lg:grid-cols-[minmax(0,680px)_260px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <BlogPostTagsRow tags={tags} tagHref={tagHref} />

            {tocItems.length > 0 ? (
              <TableOfContents items={tocItems} variant="accordion" />
            ) : null}

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.6 }}
            >
              <div
                className="blog-post-body mx-auto w-full max-w-[min(720px,100%)] px-4 sm:px-0 [&_.blog-pre]:overflow-x-auto [&_.blog-pre]:[-webkit-overflow-scrolling:touch] [&_pre_code]:whitespace-pre [&_.blog-prose-img]:max-w-full [&_.blog-prose-img]:h-auto max-sm:[&_blockquote.blog-prose-blockquote]:ml-0"
              >
                <BlogArticleMarkdown markdown={post.bodyMarkdown} />
              </div>
            </motion.div>

            <BlogPostTagsCloud tags={tags} tagHref={tagHref} taggedInPrefix={copy.taggedInPrefix} />

            <div className="mt-12">
              <AuthorCard variant="expanded" />
            </div>

            <div className="max-sm:[&>div.relative.mt-10]:flex-col max-sm:[&>div.relative.mt-10]:items-stretch max-sm:[&>div.relative.mt-10>button:nth-child(3)]:mt-3 max-sm:[&>div.relative.mt-10>button:nth-child(3)]:w-full">
              <BlogReadLaterBanner
                slug={post.slug}
                post={{ id: post.id, title: post.title, slug: post.slug }}
                showToast={showToast}
              />
            </div>

            <div className="mt-12 lg:hidden [&>div]:!justify-center">
              <ShareSidebar
                url={shareUrl}
                title={post.title}
                post={{ id: post.id, title: post.title, slug: post.slug }}
                layout="horizontal"
                labels={shareLabels}
                showToast={showToast}
              />
            </div>

            <RelatedPosts posts={related} heading={copy.youMightAlsoLike} />

            <Link
              to="/blog"
              className="mt-12 flex w-full items-center justify-center gap-2 rounded-full border border-[#2a2a2a] bg-[#111] px-6 py-3 text-center text-sm font-medium text-[#6b6b6b] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--accent)] sm:inline-flex sm:w-auto sm:border-transparent sm:bg-transparent sm:px-0 sm:py-0 sm:text-left"
            >
              {copy.backToBlog}
            </Link>
          </div>

          <motion.aside
            className="hidden lg:block"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.4 }}
          >
            <div className="sticky top-24 space-y-10">
              {tocItems.length > 0 ? <TableOfContents items={tocItems} /> : null}
              <ShareSidebar
                url={shareUrl}
                title={post.title}
                post={{ id: post.id, title: post.title, slug: post.slug }}
                labels={shareLabels}
                showToast={showToast}
              />
            </div>
          </motion.aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
