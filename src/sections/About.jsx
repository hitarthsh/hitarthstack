import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { StatBar } from "@/components/StatBar";
import { StatCounter } from "@/components/StatCounter";
import { site } from "@/config/site";

const ICONS = {
  code: Code2,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
};

/**
 * Asymmetric about section with portrait, narrative, stats, and skill bars.
 */
export function About() {
  return (
    <SectionReveal
      id="about"
      className="relative overflow-hidden scroll-mt-24 py-14 md:scroll-mt-28 md:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute right-0 top-16 h-56 w-56 rounded-full bg-[var(--accent)]/5 blur-3xl md:h-64 md:w-64 lg:top-20" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative pb-14 sm:pb-16 lg:pb-0"
          >
            <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-xl sm:rounded-[28px]">
              <img
                src={site.aboutPortrait.src}
                alt={site.aboutPortrait.alt}
                loading="lazy"
                className="aspect-[4/5] max-h-[min(72vh,520px)] w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-6 left-4 right-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]/92 p-3 backdrop-blur-xl sm:left-5 sm:right-5 sm:p-3.5 lg:hidden">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {site.aboutStats.map((s) => (
                  <StatCounter key={s.label} {...s} />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-5 md:space-y-6 lg:space-y-5 lg:pt-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs sm:tracking-[0.25em]">
                {site.sections.about.kicker}
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] tracking-tight text-[var(--text-primary)] md:mt-2.5 lg:text-[clamp(1.85rem,3.25vw,3rem)]">
                {site.sections.about.title}{" "}
                <span className="text-[var(--text-muted)]">
                  {site.sections.about.titleAccent}
                </span>
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-[var(--text-muted)] md:text-[0.9375rem] md:leading-relaxed">
              {site.aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="hidden gap-3 lg:grid lg:grid-cols-3">
              {site.aboutStats.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>

            <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:rounded-2xl sm:p-5">
              {site.skillBars.map((bar) => (
                <StatBar key={bar.label} {...bar} />
              ))}
            </div>

            <div className="rounded-xl border border-[var(--accent)]/35 bg-[var(--surface)]/80 p-4 sm:rounded-2xl sm:p-5">
              <p className="text-sm font-medium italic leading-snug text-[var(--text-primary)] md:text-base">
                &ldquo;{site.missionQuote}&rdquo;
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {site.aboutHighlights.map((item) => {
                const Icon = ICONS[item.iconKey] ?? Code2;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-xl sm:rounded-2xl"
                  >
                    <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] sm:mb-2.5 sm:h-10 sm:w-10 sm:rounded-xl">
                      <Icon className="h-4 w-4 text-[var(--accent)] sm:h-5 sm:w-5" aria-hidden />
                    </div>
                    <h3 className="font-display text-base text-[var(--text-primary)] sm:text-[1.05rem]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)] sm:mt-2 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
