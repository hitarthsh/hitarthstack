import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import { MarqueeProjectCard } from "@/components/MarqueeProjectCard";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { ProjectModal } from "@/components/ProjectModal";
import { SectionReveal } from "@/components/SectionReveal";
import { site } from "@/config/site";

function cardAriaLabel(title) {
  return site.sections.projects.cardAriaLabelTemplate.replace(
    /\{\{title\}\}/g,
    title,
  );
}

function githubAriaLabel(title) {
  return site.sections.projects.cardGithubAriaLabelTemplate.replace(
    /\{\{title\}\}/g,
    title,
  );
}

/**
 * Projects showcase: infinite marquee ticker or static grid when reduced motion is preferred.
 */
export function Projects() {
  const reduce = useReducedMotion();
  const [detail, setDetail] = useState(null);

  const modalLabels = useMemo(
    () => ({
      modalCloseLabel: site.sections.projects.modalCloseLabel,
      modalLiveDemoLabel: site.sections.projects.modalLiveDemoLabel,
      modalGithubLabel: site.sections.projects.modalGithubLabel,
    }),
    [],
  );

  const openModal = useCallback((p) => {
    setDetail(p);
  }, []);

  const closeModal = useCallback(() => setDetail(null), []);

  const proj = site.sections.projects;
  const projectsCopy = site.projects;
  const count = projectsCopy.length;

  const tickerContent = useMemo(
    () =>
      projectsCopy.map((project) => (
        <MarqueeProjectCard
          key={project.id}
          project={project}
          reducedMotion={Boolean(reduce)}
          ariaLabel={cardAriaLabel(project.title)}
          githubAriaLabel={githubAriaLabel(project.title)}
          holdArrowAriaLabel={proj.holdArrowAriaLabel}
          onOpen={openModal}
        />
      )),
    [openModal, proj.holdArrowAriaLabel, projectsCopy, reduce],
  );

  return (
    <>
      <SectionReveal
        id="projects"
        aria-label={proj.showcaseAriaLabel}
        className="relative overflow-x-hidden scroll-mt-24 py-14 md:scroll-mt-28 md:py-16 lg:py-20"
      >
        <div className="pointer-events-none absolute left-6 top-14 h-52 w-52 rounded-full bg-[var(--accent)]/5 blur-3xl md:left-10 md:top-16 md:h-60 md:w-60 lg:h-64 lg:w-64" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-6 max-w-3xl text-left md:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs sm:tracking-[0.25em]">
              {proj.kicker}
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-[var(--text-primary)] md:mt-2.5">
              {proj.title}{" "}
              <span className="text-[var(--text-muted)]">{proj.titleAccent}</span>
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 md:mt-4">
              <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)] md:text-[0.9375rem]">
                {proj.marqueeSubtitle}
              </p>
              <span className="inline-flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-[var(--accent)]">
                {count} {proj.projectCountSuffix}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-[1] ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-16 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/85 to-transparent md:w-24"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-16 bg-gradient-to-l from-[var(--bg)] via-[var(--bg)]/85 to-transparent md:w-24"
            aria-hidden
          />

          {reduce ? (
            <div className="container mx-auto px-6 pb-2">
              <div className="grid gap-8 sm:grid-cols-2">
                {tickerContent}
              </div>
            </div>
          ) : (
            <MarqueeTicker durationSec={40}>
              {tickerContent}
            </MarqueeTicker>
          )}
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="mt-8 flex justify-center md:mt-10">
            <AnimatedBorderButton
              href={site.urls.github}
              className="!px-5 !py-2.5 !text-sm sm:!px-6 sm:!text-base"
            >
              {proj.githubCta}
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </AnimatedBorderButton>
          </div>
        </div>
      </SectionReveal>

      <ProjectModal
        project={detail}
        open={detail != null}
        onClose={closeModal}
        labels={modalLabels}
      />
    </>
  );
}
