import { motion, useReducedMotion } from "framer-motion";

/**
 * Full-bleed cover + overlapping title (magazine-style).
 *
 * @param {{
 *   title: string;
 *   category: string;
 *   readMinutes: number;
 *   minutesShort: string;
 *   dateLabel: string;
 *   coverSrc: string;
 * }} props
 */
export function BlogPostHero({
  title,
  category,
  readMinutes,
  minutesShort,
  dateLabel,
  coverSrc,
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#0a0a0a]">
      <div className="relative h-[280px] overflow-hidden md:h-[480px]">
        <motion.img
          src={coverSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={reduce ? false : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)",
          }}
        />
        <div className="absolute bottom-6 left-6 flex flex-wrap items-center gap-2 md:bottom-10 md:left-10">
          <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md">
            {category}
          </span>
          <span className="rounded-full bg-black/65 px-3 py-1 font-mono text-xs text-[#d4d4d4] backdrop-blur-md">
            ~{readMinutes} {minutesShort}
          </span>
          <span className="rounded-full bg-black/65 px-3 py-1 font-mono text-xs text-[#a3a3a3] backdrop-blur-md">
            {dateLabel}
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[720px] px-6">
        <motion.h1
          className="-mt-14 pb-10 font-display text-[clamp(1.75rem,6vw,2.5rem)] font-extrabold leading-[1.1] text-white md:-mt-24 md:pb-10 md:text-[clamp(2rem,5vw,4rem)]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.3 }}
        >
          {title}
        </motion.h1>
      </div>
    </div>
  );
}
