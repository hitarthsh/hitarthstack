import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";
import { extractTocFromMarkdown } from "@/utils/markdownToc";

/**
 * Markdown body with blog typography (.blog-prose in CSS) + heading ids for TOC.
 *
 * @param {{ markdown: string }} props
 */
export function BlogArticleMarkdown({ markdown }) {
  const tocItems = useMemo(() => extractTocFromMarkdown(markdown), [markdown]);

  let qi = 0;
  const components = {
    h1: ({ children, ...rest }) => (
      <h1 className="blog-prose-h1" {...rest}>
        {children}
      </h1>
    ),
    h2: ({ children, ...rest }) => {
      let id;
      if (qi < tocItems.length && tocItems[qi].level === 2) {
        id = tocItems[qi++].id;
      }
      return (
        <h2 id={id} className="blog-prose-h2" {...rest}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...rest }) => {
      let id;
      if (qi < tocItems.length && tocItems[qi].level === 3) {
        id = tocItems[qi++].id;
      }
      return (
        <h3 id={id} className="blog-prose-h3" {...rest}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...rest }) => (
      <h4 className="blog-prose-h4" {...rest}>
        {children}
      </h4>
    ),
    p: ({ children, ...rest }) => (
      <p className="blog-prose-p" {...rest}>
        {children}
      </p>
    ),
    strong: ({ children, ...rest }) => (
      <strong className="blog-prose-strong" {...rest}>
        {children}
      </strong>
    ),
    em: ({ children, ...rest }) => (
      <em className="blog-prose-em" {...rest}>
        {children}
      </em>
    ),
    a: ({ children, ...rest }) => (
      <a className="blog-prose-a" {...rest}>
        {children}
      </a>
    ),
    blockquote: ({ children, ...rest }) => (
      <blockquote className="blog-prose-blockquote" {...rest}>
        {children}
      </blockquote>
    ),
    ul: ({ children, ...rest }) => (
      <ul className="blog-prose-ul" {...rest}>
        {children}
      </ul>
    ),
    ol: ({ children, ...rest }) => (
      <ol className="blog-prose-ol" {...rest}>
        {children}
      </ol>
    ),
    li: ({ children, ...rest }) => (
      <li className="blog-prose-li" {...rest}>
        {children}
      </li>
    ),
    hr: (props) => <hr className="blog-prose-hr" {...props} />,
    img: ({ alt, ...rest }) => (
      <img alt={alt ?? ""} className="blog-prose-img" {...rest} />
    ),
    code: ({ inline, className, children, ...rest }) => {
      if (inline ?? false) {
        return (
          <code className="blog-inline-code" {...rest}>
            {children}
          </code>
        );
      }
      return (
        <code
          className={`block whitespace-pre bg-transparent p-0 text-[0.875rem] text-[#e8ff47] ${className ?? ""}`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => <BlogCodeBlock>{children}</BlogCodeBlock>,
  };

  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
