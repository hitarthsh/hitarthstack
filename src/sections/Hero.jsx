import {
  ArrowRight,
  ChevronDown,
  FileDown,
  Github,
  Linkedin,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import { HeroSkillMarquee } from "@/components/HeroSkillMarquee";
import { HeroTypewriter } from "@/components/HeroTypewriter";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import {
  ACT_RESUME_DOWNLOAD,
  ACT_SOCIAL_CLICK,
  ACT_VIEW_PROJECTS,
  CAT_NAV,
} from "@/analytics/eventConstants";

/**
 * Full-viewport hero with typewriter name, motion accents, and marquee skills.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [taglineOn, setTaglineOn] = useState(false);

  const socials = [
    { icon: Github, href: site.urls.github, label: "GitHub" },
    { icon: Linkedin, href: site.urls.linkedin, label: "LinkedIn" },
  ];

  const resumeHref = site.urls.resume?.trim() || "/resume.pdf";

  return (
    <section className="relative flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
          loading="eager"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/30 via-[var(--bg)]/85 to-[var(--bg)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(28).keys()].map((i) => (
          <div
            key={i}
            className="hero-bg-dot absolute h-1.5 w-1.5 rounded-full opacity-70"
            style={{
              backgroundColor: "var(--accent)",
              left: `${((i * 47) % 97)}%`,
              top: `${((i * 73) % 93)}%`,
              ["--drift-duration"]: `${15 + ((i * 13) % 20)}s`,
              ["--drift-delay"]: `${((i * 7) % 50) / 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-5 px-6 pb-2 pt-[calc(5.25rem+env(safe-area-inset-top,0px))] sm:gap-6 sm:pt-28 md:gap-7 lg:flex-row lg:items-center lg:gap-10 lg:pb-3 lg:pt-[calc(6rem+env(safe-area-inset-top,0px))]">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-3 sm:space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)] backdrop-blur-xl sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs sm:tracking-[0.18em]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            {site.hero.floatingBadgeLabel}
          </motion.span>

          <div className="min-h-0 space-y-2 sm:space-y-3">
            <p className="text-[11px] uppercase leading-snug tracking-[0.2em] text-[var(--text-muted)] sm:text-xs sm:tracking-[0.25em]">
              {site.badgeLabel}
            </p>
            <h1 className="font-display text-[clamp(2.25rem,6.5vw,4.75rem)] leading-[1.06] tracking-tight text-[var(--text-primary)] lg:text-[clamp(2.5rem,5.5vw,5rem)]">
              <span className="block pb-[0.06em] text-[var(--text-muted)]">
                {site.hero.headlineLead}
              </span>
              <span className="text-[var(--accent)]">{site.hero.decorativeLine1}</span>{" "}
              <span className="text-[var(--text-primary)]">{site.hero.headlineMid}</span>
              <br />
              <span className="text-[var(--text-muted)]">{site.hero.decorativeLine2}</span>
            </h1>

            <div className="font-display text-[clamp(1.65rem,4.5vw,2.65rem)] leading-tight text-[var(--text-primary)]">
              <HeroTypewriter text={site.fullName} onComplete={() => setTaglineOn(true)} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={
                taglineOn ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
              }
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl text-sm leading-snug text-[var(--text-muted)] sm:text-[0.9375rem] sm:leading-relaxed"
            >
              {site.shortTagline}
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? false : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.12 }}
            className="flex flex-wrap gap-2.5 sm:gap-3"
          >
            <Link
              to="/#projects"
              onClick={() =>
                trackEvent({
                  category: CAT_NAV,
                  action: ACT_VIEW_PROJECTS,
                  label: site.hero.primaryCtaLabel,
                })
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[var(--accent)]/20 transition-transform hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:min-h-11 sm:px-6 sm:text-base"
            >
              {site.hero.primaryCtaLabel}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </Link>
            <AnimatedBorderButton
              href={resumeHref}
              external={false}
              download
              className="!px-5 !py-2.5 !text-sm sm:!px-6 sm:!text-base"
              onClick={() =>
                trackEvent({
                  category: CAT_NAV,
                  action: ACT_RESUME_DOWNLOAD,
                  label: site.resumeCtaLabel,
                })
              }
            >
              <FileDown className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              {site.resumeCtaLabel}
            </AnimatedBorderButton>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="text-xs text-[var(--text-muted)] sm:text-sm">{site.hero.followLabel}</span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                onClick={() =>
                  trackEvent({
                    category: CAT_NAV,
                    action: ACT_SOCIAL_CLICK,
                    label: s.label,
                  })
                }
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:min-h-10 sm:min-w-10"
              >
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 justify-center lg:max-w-[38%] lg:flex-1 lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="relative w-full max-w-[240px] sm:max-w-[260px] lg:max-h-[min(52vh,420px)] lg:w-auto lg:max-w-[min(40vw,320px)]"
          >
            <div className="absolute inset-4 rounded-[28px] bg-[radial-gradient(circle_at_top,var(--accent)_0%,transparent_55%)] opacity-40 blur-3xl sm:inset-5" />
            <div className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/70 p-2 backdrop-blur-xl sm:rounded-[28px] sm:p-2.5 lg:max-h-[min(52vh,420px)]">
              <img
                src={site.aboutPortrait.src}
                alt={site.aboutPortrait.alt}
                loading="lazy"
                className="aspect-[4/5] max-h-[min(34vh,320px)] w-full rounded-xl object-cover sm:max-h-[min(38vh,340px)] lg:max-h-[min(52vh,400px)] lg:rounded-2xl"
              />
              {/* Single corner badge — avoids duplicating “Open to work” chip that sits in the copy column */}
              <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-[var(--border)] bg-[var(--bg)]/92 px-2 py-1.5 text-center shadow-lg backdrop-blur-xl sm:left-3 sm:top-3 sm:rounded-xl sm:px-3 sm:py-2">
                <div className="font-display text-lg text-[var(--accent)] sm:text-xl">
                  {site.hero.cornerBadgeTitle}
                </div>
                <div className="text-[9px] text-[var(--text-muted)] sm:text-[10px]">
                  {site.hero.cornerBadgeSubtitle}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2">
        <motion.div
          className="pointer-events-auto"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.6 }}
        >
          <Link
            to={`/#${site.hero.scrollTargetId}`}
            className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label={`${site.hero.scrollCueLabel} to ${site.hero.scrollTargetId}`}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em]">
              {site.hero.scrollCueLabel}
            </span>
            <ChevronDown className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>

      <HeroSkillMarquee reduceMotion={reduce} />
    </section>
  );
}
