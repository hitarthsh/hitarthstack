import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Letter-by-letter reveal for hero display names.
 *
 * @param {{ text: string; onComplete?: () => void }} props
 */
export function HeroTypewriter({ text, onComplete }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);

  useEffect(() => {
    if (reduce) {
      onComplete?.();
      return undefined;
    }
    if (count >= text.length) {
      onComplete?.();
      return undefined;
    }
    const id = window.setTimeout(() => setCount((c) => c + 1), 42);
    return () => clearTimeout(id);
  }, [count, onComplete, reduce, text.length]);

  const done = count >= text.length;
  const visible = text.slice(0, count);

  return (
    <span className="inline-flex items-end gap-1">
      <span>{visible}</span>
      {!done ? (
        <span className="mb-1 inline-block h-8 w-[3px] animate-pulse bg-[var(--accent)]" />
      ) : null}
    </span>
  );
}
