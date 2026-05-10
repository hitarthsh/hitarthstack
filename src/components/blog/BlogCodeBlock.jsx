import { Check, Copy } from "lucide-react";
import { Children, isValidElement, useCallback, useState } from "react";

/**
 * Fenced code block with language badge + copy (react-markdown: pre > code).
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function BlogCodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const codeChild = Children.toArray(children).find(
    (c) => isValidElement(c) && c.type === "code",
  );
  const className =
    isValidElement(codeChild) && typeof codeChild.props.className === "string"
      ? codeChild.props.className
      : "";
  const match = /language-(\w+)/.exec(className);
  const lang = match ? match[1] : "";

  const rawText =
    isValidElement(codeChild) && codeChild.props.children != null
      ? flattenText(codeChild.props.children)
      : "";

  const copy = useCallback(async () => {
    if (!rawText) return;
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [rawText]);

  return (
    <pre className="blog-pre group relative my-8 overflow-x-auto rounded-2xl border border-[#1f1f1f] bg-[#0d0d0d] p-6 pt-10 font-mono text-sm">
      {lang ? (
        <span className="absolute right-12 top-3 rounded-md border border-[#2a2a2a] bg-[#111] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#6b6b6b]">
          {lang}
        </span>
      ) : null}
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111] text-[#d4d4d4] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <div className="overflow-x-auto">{children}</div>
    </pre>
  );
}

/** @param {import('react').ReactNode} node */
function flattenText(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) return flattenText(node.props.children);
  return "";
}
