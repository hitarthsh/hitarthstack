/**
 * @param {import('@/lib/blogStorage').BlogPost} current
 * @param {import('@/lib/blogStorage').BlogPost[]} publishedOthers
 * @param {number} limit
 */
export function getRelatedPosts(current, publishedOthers, limit = 3) {
  const others = publishedOthers.filter((p) => p.id !== current.id && p.status === "published");
  const currentTags = new Set(current.tags ?? []);

  const scored = others.map((p) => {
    let score = 0;
    for (const t of p.tags ?? []) {
      if (currentTags.has(t)) score += 3;
    }
    if (p.category === current.category) score += 2;
    const ta = new Date(p.publishedAt).getTime();
    score += Math.min(1, ta / 1e13);
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const withOverlap = scored.filter((x) => x.score >= 2);
  const pool = withOverlap.length > 0 ? withOverlap : scored;
  return pool.slice(0, limit).map((x) => x.post);
}
