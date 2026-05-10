import { ArrowUpRight, Github } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 1200;
const RING_R = 10;
const RING_C = 2 * Math.PI * RING_R;

/**
 * @param {{
 *   project: {
 *     id: string;
 *     title: string;
 *     description: string;
 *     coverImage: string;
 *     tags: string[];
 *     githubUrl: string;
 *   };
 *   reducedMotion: boolean;
 *   ariaLabel: string;
 *   githubAriaLabel: string;
 *   holdArrowAriaLabel: string;
 *   onOpen: (project: object) => void;
 * }} props
 */
export function MarqueeProjectCard({
  project,
  reducedMotion,
  ariaLabel,
  githubAriaLabel,
  holdArrowAriaLabel,
  onOpen,
}) {
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearHold = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  const startHold = useCallback(
    (e) => {
      if (reducedMotion) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      clearHold();
      setHolding(true);
      setProgress(0);
      startTimeRef.current = performance.now();
      intervalRef.current = window.setInterval(() => {
        const t0 = startTimeRef.current;
        if (t0 == null) return;
        const p = Math.min(1, (performance.now() - t0) / HOLD_MS);
        setProgress(p);
        if (p >= 1) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          startTimeRef.current = null;
          setHolding(false);
          setProgress(0);
          onOpen(project);
        }
      }, 16);
    },
    [clearHold, onOpen, project, reducedMotion],
  );

  const endHoldCancel = useCallback(() => {
    clearHold();
  }, [clearHold]);

  useEffect(() => () => clearHold(), [clearHold]);

  const onCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(project);
    }
  };

  const onCardClick = () => {
    if (reducedMotion) onOpen(project);
  };

  const stopActivateCard = (e) => {
    e.stopPropagation();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={onCardKeyDown}
      onClick={onCardClick}
      className={`group flex min-h-[380px] w-[min(92vw,480px)] shrink-0 flex-col gap-3 rounded-2xl border border-[#1f1f1f] bg-[#111] p-6 shadow-none transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#e8ff47] hover:shadow-[0_0_28px_-8px_rgba(232,255,71,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:w-[480px] ${reducedMotion ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-[220px] min-h-[200px] w-full shrink-0 overflow-hidden rounded-xl bg-[var(--border)]">
        <img
          src={project.coverImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full rounded-xl object-cover"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={githubAriaLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)]/85 text-[var(--text-muted)] backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            onClick={stopActivateCard}
            onPointerDown={stopActivateCard}
          >
            <Github className="h-4 w-4" aria-hidden />
          </a>
          <span
            className={`relative flex h-9 w-9 items-center justify-center text-[var(--accent)] ${reducedMotion ? "pointer-events-none" : "touch-none"}`}
            onPointerDown={reducedMotion ? undefined : startHold}
            onPointerUp={reducedMotion ? undefined : endHoldCancel}
            onPointerLeave={reducedMotion ? undefined : endHoldCancel}
            onPointerCancel={reducedMotion ? undefined : endHoldCancel}
            onClick={
              reducedMotion
                ? undefined
                : (ev) => {
                    ev.stopPropagation();
                  }
            }
            aria-hidden={reducedMotion ? true : undefined}
          >
            {!reducedMotion ? (
              <>
                <svg
                  className="pointer-events-none absolute inset-0 h-9 w-9"
                  viewBox="0 0 36 36"
                  aria-hidden
                >
                  <circle
                    cx="18"
                    cy="18"
                    r={RING_R}
                    fill="none"
                    stroke="color-mix(in srgb, var(--border) 80%, transparent)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r={RING_R}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - progress)}
                    transform="rotate(-90 18 18)"
                    style={{
                      opacity: holding || progress > 0 ? 1 : 0,
                    }}
                  />
                </svg>
                <span className="sr-only">{holdArrowAriaLabel}</span>
              </>
            ) : null}
            <ArrowUpRight
              className={`relative z-[1] h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5 ${reducedMotion ? "" : "group-hover:scale-110"}`}
              aria-hidden
            />
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-2 pb-5 pt-4">
        <div className="min-w-0">
          <h3 className="font-display text-[1.4rem] leading-snug text-[var(--text-primary)]">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {project.description}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
