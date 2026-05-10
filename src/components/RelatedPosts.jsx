import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { BlogCard } from "@/components/BlogCard";

/**
 * @param {{
 *   posts: import('@/lib/blogStorage').BlogPost[];
 *   heading: string;
 * }} props
 */
export function RelatedPosts({ posts, heading }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  if (posts.length === 0) return null;

  return (
    <section ref={ref} className="mt-14">
      <h2 className="font-display text-xl text-[#f0f0f0]">{heading}</h2>
      <div
        className="related-posts-scroll mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            className="min-w-[280px] shrink-0 snap-start lg:min-w-0"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={
              reduce ? undefined : inView ? { opacity: 1, y: 0 } : undefined
            }
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <BlogCard post={post} variant="compact" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
