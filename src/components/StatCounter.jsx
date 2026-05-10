import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation when scrolled into view.
 *
 * @param {{ label: string; value: number; suffix?: string }} props
 */
export function StatCounter({ label, value, suffix = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 950;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(value * p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [reduce, value]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-3.5"
    >
      <div className="font-display text-2xl text-[var(--accent)] sm:text-3xl lg:text-[2rem]">
        {display}
        {suffix ? (
          <span className="text-base text-[var(--text-muted)] sm:text-lg">{suffix}</span>
        ) : null}
      </div>
      <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-muted)] sm:mt-1 sm:text-xs">
        {label}
      </p>
    </div>
  );
}
