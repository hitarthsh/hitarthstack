import { site } from "@/config/site";

/**
 * Skeleton placeholder grid for the blog index first paint.
 */
export function BlogSkeleton() {
  const count = site.blogPageSize >= 4 ? 4 : site.blogPageSize;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map(
        (_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          />
        ),
      )}
    </div>
  );
}
