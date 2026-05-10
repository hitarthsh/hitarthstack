import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import {
  excerptFromMarkdown,
  findPublishedBySlug,
} from "@/lib/blogStorage";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { getSEOConfig } from "@/utils/seo";
import { BlogPost } from "@/sections/BlogPost";
import { trackEvent } from "@/analytics/analytics";
import { ACT_POST_VIEW, CAT_BLOG } from "@/analytics/eventConstants";

/**
 * Single published post route with full-page layout + SEO.
 */
export function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? findPublishedBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    trackEvent({
      category: CAT_BLOG,
      action: ACT_POST_VIEW,
      label: post.title,
    });
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription || excerptFromMarkdown(post.bodyMarkdown);
  const image = absoluteUrl(
    post.ogImage || post.coverImageUrl || site.seo.defaultOgImage,
  );
  const url = absoluteUrl(post.canonicalUrl || `/blog/${post.slug}`);
  const noIndex = Boolean(post.noIndex) || post.status === "draft";
  const authorName =
    getSEOConfig().global.authorName?.trim() || site.seo.personName;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        image={image}
        url={url}
        type="article"
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={authorName}
        tags={post.tags}
        noIndex={noIndex}
      />
      <BlogPost key={post.slug} post={post} />
    </>
  );
}
