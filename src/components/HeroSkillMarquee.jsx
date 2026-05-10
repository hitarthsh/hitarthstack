import { motion } from "framer-motion";
import { site } from "@/config/site";

/**
 * Infinite marquee (or static chips) for hero technologies.
 *
 * @param {{ reduceMotion: boolean }} props
 */
export function HeroSkillMarquee({ reduceMotion }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl shrink-0 px-6 pb-11 pt-1 sm:pb-12 md:pb-14">
      <p className="mb-1.5 text-center text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)] sm:mb-2 sm:text-xs sm:tracking-[0.25em]">
        {site.hero.techMarqueeTitle}
      </p>
      <div className="relative isolate overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 py-2 backdrop-blur-xl sm:rounded-2xl sm:py-2.5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-20" />
        {reduceMotion ? (
          <div className="flex flex-wrap justify-center gap-2 px-3 font-mono text-[11px] text-[var(--text-muted)] sm:gap-3 sm:px-4 sm:text-xs">
            {site.heroSkillsMarquee.map((skill) => (
              <span key={skill} className="whitespace-nowrap">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-6 px-4 font-mono text-[11px] text-[var(--text-muted)] sm:gap-8 sm:px-5 sm:text-xs"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          >
            {[...site.heroSkillsMarquee, ...site.heroSkillsMarquee].map((skill, idx) => (
              <span key={`${skill}-${idx}`} className="whitespace-nowrap">
                {skill}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
