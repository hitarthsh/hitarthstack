import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import { ACT_SOCIAL_CLICK, CAT_NAV } from "@/analytics/eventConstants";

/**
 * Vertical timeline with animated nodes and alternating layout on desktop.
 */
export function Experience() {
  const experiences = site.experience;

  return (
    <SectionReveal
      id="experience"
      className="relative overflow-hidden scroll-mt-24 py-24 md:scroll-mt-28 md:py-32"
    >
      <div className="pointer-events-none absolute left-1/3 top-40 h-96 w-96 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-14 flex max-w-5xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              {site.sections.experience.kicker}
            </p>
            <h2 className="mt-4 font-display text-4xl text-[var(--text-primary)] md:text-5xl">
              {site.sections.experience.title}{" "}
              <span className="text-[var(--text-muted)]">
                {site.sections.experience.titleAccent}
              </span>
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">{site.experienceIntro}</p>
          </div>
          <a
            href={site.urls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            onClick={() =>
              trackEvent({
                category: CAT_NAV,
                action: ACT_SOCIAL_CLICK,
                label:
                  site.socialPlatforms.find((s) => s.key === "linkedin")
                    ?.label ?? "",
              })
            }
          >
            <Linkedin className="h-4 w-4" aria-hidden />
            {site.sections.experience.linkedInCta}
          </a>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/35 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <div
                key={`${exp.role}-${exp.period}`}
                className="relative grid gap-8 md:grid-cols-2"
              >
                <motion.div
                  className="absolute left-0 top-3 z-10 md:left-1/2 md:-translate-x-1/2"
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                >
                  <div className="relative flex h-3 w-3 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-35" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)]" />
                    {exp.current ? (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                    ) : null}
                  </div>
                </motion.div>

                <div
                  className={`pl-8 md:pl-0 ${idx % 2 === 0 ? "md:pr-14 md:text-right" : "md:col-start-2 md:pl-14"}`}
                >
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 backdrop-blur-xl transition-colors hover:border-[var(--accent)]/35">
                    <p className="text-xs font-mono uppercase tracking-wide text-[var(--accent)]">
                      {exp.period}
                    </p>
                    <h3 className="mt-3 font-display text-xl text-[var(--text-primary)]">{exp.role}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{exp.company}</p>
                    {exp.location ? (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{exp.location}</p>
                    ) : null}
                    <p className="mt-4 text-sm text-[var(--text-muted)]">{exp.description}</p>
                    <div
                      className={`mt-4 flex flex-wrap gap-2 ${idx % 2 === 0 ? "md:justify-end" : ""}`}
                    >
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
