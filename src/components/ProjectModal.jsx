import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * @param {{
 *   project: {
 *     id: string;
 *     title: string;
 *     fullDescription: string;
 *     coverImage: string;
 *     tags: string[];
 *     liveUrl: string;
 *     githubUrl: string;
 *   } | null;
 *   open: boolean;
 *   onClose: () => void;
 *   labels: {
 *     modalCloseLabel: string;
 *     modalLiveDemoLabel: string;
 *     modalGithubLabel: string;
 *   };
 * }} props
 */
export function ProjectModal({ project, open, onClose, labels }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const prevActive = useRef(null);

  const paragraphs = useMemo(() => {
    if (!project?.fullDescription?.trim()) return [];
    return project.fullDescription.trim().split(/\n\n+/);
  }, [project]);

  useEffect(() => {
    if (!open) return undefined;
    prevActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      const el = prevActive.current;
      if (el instanceof HTMLElement) el.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !panelRef.current) return undefined;
    const root = panelRef.current;
    const sel =
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(root.querySelectorAll(sel)).filter(
        (node) =>
          node instanceof HTMLElement &&
          node.getAttribute("aria-hidden") !== "true",
      );

    const nodes = focusables();
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    const focusTimer = window.requestAnimationFrame(() => {
      first?.focus();
    });

    const trap = (e) => {
      if (e.key !== "Tab" || nodes.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    root.addEventListener("keydown", trap);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      root.removeEventListener("keydown", trap);
    };
  }, [open, project?.id]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && project ? (
        <motion.div
          ref={panelRef}
          key={project.id}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-modal-title-${project.id}`}
          className="fixed inset-0 z-[120] flex flex-col bg-[#0a0a0a]"
          initial={reduce ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduce ? false : { y: "100%" }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 32 }
          }
        >
          <div className="flex shrink-0 items-center justify-end border-b border-[var(--border)] px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={labels.modalCloseLabel}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <img
                  src={project.coverImage}
                  alt=""
                  loading="eager"
                  className="aspect-video w-full object-cover"
                />
              </div>

              <h2
                id={`project-modal-title-${project.id}`}
                className="mt-8 font-display text-3xl tracking-tight text-[var(--text-primary)] md:text-4xl"
              >
                {project.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--text-primary)] md:text-lg">
                {paragraphs.map((block, i) => (
                  <p key={i}>{block}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-transform hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {labels.modalLiveDemoLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Github className="h-4 w-4" aria-hidden />
                  {labels.modalGithubLabel}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
