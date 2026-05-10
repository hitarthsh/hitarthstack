import { Helmet } from "react-helmet-async";
import { site } from "@/config/site";
import { getSEOConfig } from "@/utils/seo";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.image
 * @param {string} props.url Absolute canonical URL
 * @param {"website"|"article"} props.type
 * @param {string} [props.publishedAt]
 * @param {string} [props.updatedAt]
 * @param {string} props.author
 * @param {string[]} props.tags
 * @param {boolean} [props.noIndex]
 * @param {"home"|"blog"|"other"} [props.breadcrumbVariant]
 */
export function SEOHead({
  title,
  description,
  image,
  url,
  type,
  publishedAt,
  updatedAt,
  author,
  tags,
  noIndex = false,
  breadcrumbVariant = "home",
}) {
  const merged = getSEOConfig();

  const brandTitle =
    merged.global.siteTitle?.trim() || site.seo.siteNameOg;
  const sep = merged.global.titleSeparator?.trim() || " | ";
  const fullTitle = `${title}${sep}${brandTitle}`;

  const authorEffective =
    author?.trim() ||
    merged.global.authorName?.trim() ||
    site.seo.personName;

  const descriptionEffective =
    description?.trim() ||
    merged.global.metaDescription?.trim() ||
    site.seo.defaultDescription;

  const robotsEffective = noIndex
    ? site.seo.robotsNoIndex
    : merged.global.robotsDefault?.trim() || site.seo.robotsIndexFollow;

  const imageEffective =
    (image && image.trim()) ||
    merged.social.ogImageUrl?.trim() ||
    merged.global.ogDefaultImageUrl?.trim() ||
    site.seo.defaultOgImage;

  const ogTitleEffective =
    merged.social.ogTitle?.trim() || title;
  const ogDescEffective =
    merged.social.ogDescription?.trim() || descriptionEffective;

  const twitterCardRaw = merged.social.twitterCardType;
  const twitterCardEffective =
    twitterCardRaw === "summary"
      ? "summary"
      : "summary_large_image";

  const twitterImageEffective =
    merged.social.twitterImageUrl?.trim() || imageEffective;

  const twRaw =
    merged.global.twitterHandle?.trim() ||
    site.twitterHandle.replace(/^@/, "");
  const twHandle = `@${twRaw.replace(/^@/, "")}`;

  const keywordsFromSite =
    Array.isArray(merged.global.siteKeywords) &&
    merged.global.siteKeywords.length > 0
      ? merged.global.siteKeywords.filter(Boolean).join(", ")
      : undefined;
  const keywords =
    Array.isArray(tags) && tags.length > 0
      ? tags.join(", ")
      : keywordsFromSite;

  const jsonLd = buildJsonLd({
    type,
    title,
    description: descriptionEffective,
    image: imageEffective,
    url,
    publishedAt,
    updatedAt,
    author: authorEffective,
    tags,
    breadcrumbVariant,
    merged,
  });

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={descriptionEffective} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta name="robots" content={robotsEffective} />
      <meta name="author" content={authorEffective} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitleEffective} />
      <meta property="og:description" content={ogDescEffective} />
      <meta property="og:image" content={imageEffective} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={brandTitle} />

      {type === "article" && publishedAt ? (
        <meta property="article:published_time" content={publishedAt} />
      ) : null}
      {type === "article" && updatedAt ? (
        <meta property="article:modified_time" content={updatedAt} />
      ) : null}
      {type === "article" ? (
        <meta property="article:author" content={authorEffective} />
      ) : null}
      {type === "article" && Array.isArray(tags)
        ? tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))
        : null}

      <meta name="twitter:card" content={twitterCardEffective} />
      <meta name="twitter:site" content={twHandle} />
      <meta name="twitter:title" content={ogTitleEffective} />
      <meta name="twitter:description" content={ogDescEffective} />
      <meta name="twitter:image" content={twitterImageEffective} />
      <meta name="twitter:creator" content={twHandle} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

/**
 * @param {object} opts
 * @param {import('@/utils/seo').MergedSEOConfig} opts.merged
 */
function buildJsonLd({
  type,
  title,
  description,
  image,
  url,
  publishedAt,
  updatedAt,
  author,
  tags,
  breadcrumbVariant,
  merged,
}) {
  const sd = merged.technical.structuredData;
  const siteUrl = site.siteUrl.replace(/\/$/, "");
  const keywords =
    Array.isArray(tags) && tags.length > 0 ? tags.join(", ") : "";

  if (type === "article" && sd.blogPosting !== false) {
    return {
      "@context": site.seo.schemaOrgContext,
      "@type": "BlogPosting",
      headline: title,
      description,
      image,
      datePublished: publishedAt || updatedAt,
      dateModified: updatedAt || publishedAt,
      author: {
        "@type": "Person",
        name: author,
        url: site.seo.jsonLdPersonUrl || siteUrl,
      },
      publisher: {
        "@type": "Person",
        name: author,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      keywords,
    };
  }

  if (type === "article" && sd.blogPosting === false) {
    return {
      "@context": site.seo.schemaOrgContext,
      "@type": "WebPage",
      name: title,
      description,
      url,
    };
  }

  const crumbs = [];
  crumbs.push({
    "@type": "ListItem",
    position: 1,
    name: site.seo.breadcrumbHome,
    item: `${siteUrl}/`,
  });
  if (breadcrumbVariant === "blog") {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: site.seo.breadcrumbBlog,
      item: `${siteUrl}/blog`,
    });
  }

  /** @type {object[]} */
  const graph = [];

  if (sd.website !== false) {
    graph.push({
      "@type": "WebSite",
      name: merged.global.siteTitle || site.seo.siteNameOg,
      url: `${siteUrl}/`,
      description:
        merged.global.metaDescription || site.seo.defaultDescription,
    });
  }

  if (sd.person !== false) {
    graph.push({
      "@type": "Person",
      name: merged.global.authorName || site.seo.personName,
      url: site.seo.jsonLdPersonUrl || siteUrl,
    });
  }

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: crumbs,
  });

  return {
    "@context": site.seo.schemaOrgContext,
    "@graph": graph,
  };
}
