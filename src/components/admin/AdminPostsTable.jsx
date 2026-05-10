import { site } from "@/config/site";

/**
 * Tabular list of posts with CRUD affordances.
 *
 * @param {{
 *   posts: import('@/lib/blogStorage').BlogPost[];
 *   onEdit: (post: import('@/lib/blogStorage').BlogPost) => void;
 *   onTogglePublish: (post: import('@/lib/blogStorage').BlogPost) => void;
 *   onDelete: (post: import('@/lib/blogStorage').BlogPost) => void;
 * }} props
 */
export function AdminPostsTable({ posts, onEdit, onTogglePublish, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
      <table className="min-w-full divide-y divide-[var(--border)] text-sm">
        <thead className="bg-[var(--surface)] text-left text-[var(--text-muted)]">
          <tr>
            <th className="px-4 py-3">{site.admin.editorTitleLabel}</th>
            <th className="px-4 py-3">{site.admin.statusLabel}</th>
            <th className="px-4 py-3">{site.admin.tableUpdatedLabel}</th>
            <th className="px-4 py-3 text-right">{site.admin.actionsColumnLabel}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-3 font-medium">{post.title}</td>
              <td className="px-4 py-3 capitalize">{post.status}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
                {new Date(post.updatedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                    onClick={() => onEdit(post)}
                  >
                    {site.admin.editLabel}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                    onClick={() => onTogglePublish(post)}
                  >
                    {site.admin.togglePublishLabel}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400"
                    onClick={() => onDelete(post)}
                  >
                    {site.admin.deleteLabel}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
