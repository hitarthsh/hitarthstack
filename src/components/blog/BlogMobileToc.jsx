import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TableOfContents } from "@/components/TableOfContents";
import { site } from "@/config/site";

/**
 * @param {{ items: { level: 2|3; text: string; id: string }[] }} props
 */
export function BlogMobileToc({ items }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-[#1f1f1f] bg-[#111] px-4 py-3 text-left text-sm font-medium text-[#f0f0f0]"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>📋</span>
          {site.sections.blog.post.contentsAccordion}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#6b6b6b] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="mt-3 rounded-xl border border-[#1f1f1f] bg-[#111] p-4">
          <TableOfContents items={items} showHeading={false} />
        </div>
      ) : null}
    </div>
  );
}
