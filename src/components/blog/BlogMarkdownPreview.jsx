import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Dark “reader” preview — black canvas, monospace body, violet accents (#8b5cf6).
 * Matches admin/post slide-over preview styling.
 *
 * @param {{
 *   markdown: string;
 *   metaLine?: string;
 *   className?: string;
 *   contentClassName?: string;
 * }} props
 */
export function BlogMarkdownPreview({
  markdown,
  metaLine,
  className = "",
  contentClassName = "",
}) {
  /** @type {import('react-markdown').Components} */
  const components = {
    h1: ({ children, ...props }) => (
      <h1
        className="mb-6 text-3xl font-bold tracking-tight text-white"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mt-10 mb-4 border-l-[3px] border-violet-500 pl-3 text-xl font-semibold text-white"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-8 mb-3 border-l-[3px] border-violet-500 pl-3 text-lg font-semibold text-white"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="mt-6 mb-2 border-l-[3px] border-violet-500/80 pl-3 text-base font-semibold text-white"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed text-[#d1d1d1]" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-[#d1d1d1]" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-[#d1d1d1]" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed marker:text-white [&>p]:mb-0" {...props}>
        {children}
      </li>
    ),
    code: ({ inline, className: codeCls, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="rounded-sm bg-violet-600 px-1.5 py-0.5 text-[0.9em] font-medium text-white"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className={`block font-mono text-sm text-zinc-100 ${codeCls ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre
        className="mb-4 overflow-x-auto rounded-xl border border-violet-500/25 bg-zinc-950 p-4 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-zinc-100"
        {...props}
      >
        {children}
      </pre>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="mb-4 border-l-[3px] border-violet-500/50 pl-4 text-zinc-400 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-white" {...props}>
        {children}
      </strong>
    ),
    hr: (props) => <hr className="my-8 border-zinc-800" {...props} />,
  };

  return (
    <div className={`bg-black ${className}`}>
      {metaLine ? (
        <p className="mb-6 font-mono text-xs text-zinc-500">{metaLine}</p>
      ) : null}
      <div
        className={`font-mono text-sm leading-relaxed text-[#d1d1d1] ${contentClassName}`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
