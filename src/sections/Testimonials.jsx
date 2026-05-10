import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionReveal } from "@/components/SectionReveal";
import { site } from "@/config/site";

/**
 * Drag-friendly testimonial carousel with keyboard controls.
 */
export function Testimonials() {
  const testimonials = site.testimonials;
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const measure = () => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      setConstraints({ left: -max, right: 0 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [testimonials.length]);

  const go = (dir) => {
    setActiveIdx((prev) => {
      const next = (prev + dir + testimonials.length) % testimonials.length;
      return next;
    });
  };

  const active = testimonials[activeIdx];

  return (
    <SectionReveal
      id="testimonials"
      className="relative overflow-hidden scroll-mt-24 py-24 md:scroll-mt-28 md:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            {site.sections.testimonials.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl text-[var(--text-primary)] md:text-5xl">
            {site.sections.testimonials.title}{" "}
            <span className="text-[var(--text-muted)]">
              {site.sections.testimonials.titleAccent}
            </span>
          </h2>
        </div>

        <div className="mx-auto max-w-6xl overflow-hidden">
          <motion.div
            ref={trackRef}
            drag={reduce ? false : "x"}
            dragConstraints={constraints}
            dragElastic={0.06}
            className="flex cursor-grab gap-5 active:cursor-grabbing"
          >
            {testimonials.map((t, idx) => (
              <article
                key={t.author}
                className="min-w-[min(90vw,440px)] shrink-0 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/85 p-8 shadow-xl backdrop-blur-xl"
                aria-hidden={idx !== activeIdx}
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[#0a0a0a]">
                  <Quote className="h-6 w-6" aria-hidden />
                </div>
                <p className="text-lg leading-relaxed text-[var(--text-primary)] md:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--accent)]/30"
                  />
                  <div>
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-sm text-[var(--text-muted)]">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={site.sections.testimonials.prevLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label={site.sections.testimonials.tabsLabel}
          >
            {testimonials.map((t, idx) => (
              <button
                key={t.author}
                type="button"
                role="tab"
                aria-selected={idx === activeIdx}
                aria-label={`Show testimonial from ${t.author}`}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  idx === activeIdx
                    ? "w-9 bg-[var(--accent)]"
                    : "w-2 bg-[var(--text-muted)]/35 hover:bg-[var(--text-muted)]/55"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label={site.sections.testimonials.nextLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="sr-only" aria-live="polite">
          {active.author}: {active.quote}
        </div>
      </div>
    </SectionReveal>
  );
}
