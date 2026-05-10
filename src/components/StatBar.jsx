import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated skill / proficiency bar revealed on scroll.
 *
 * @param {{ label: string; value: number }} props
 */
export function StatBar({ label, value }) {
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)] sm:mb-1.5 sm:text-sm">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-[var(--accent)]">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]/60 sm:h-2">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={{ width: reduce ? `${value}%` : "0%" }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
