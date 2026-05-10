import { BlogMarkdownPreview } from "@/components/blog/BlogMarkdownPreview";
import { site } from "@/config/site";
import { AdminFormField } from "@/components/admin/AdminFormField";

/**
 * Markdown textarea + live preview column.
 *
 * @param {{
 *   bodyMarkdown: string;
 *   setBodyMarkdown: (v: string) => void;
 *   previewMinutes: number;
 * }} props
 */
export function AdminMarkdownPanel({
  bodyMarkdown,
  setBodyMarkdown,
  previewMinutes,
}) {
  return (
    <div className="flex min-h-[520px] flex-col gap-3">
      <AdminFormField label={site.admin.bodyLabel}>
        <textarea
          rows={14}
          value={bodyMarkdown}
          onChange={(e) => setBodyMarkdown(e.target.value)}
          className="min-h-[260px] w-full flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-[var(--accent)]"
        />
      </AdminFormField>
      <div className="overflow-hidden rounded-xl border border-violet-950/50 bg-black ring-1 ring-violet-500/10">
        <div className="max-h-[min(28rem,70vh)] overflow-auto p-5">
          <BlogMarkdownPreview
            markdown={bodyMarkdown || site.admin.previewPlaceholder}
            metaLine={`Preview · ~${previewMinutes} ${site.sections.blog.minutesShort}`}
          />
        </div>
      </div>
    </div>
  );
}
