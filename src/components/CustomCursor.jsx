import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/**
 * Dot cursor for fine pointers only; disabled for reduced motion / coarse pointers.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return undefined;

    const root = document.documentElement;
    root.classList.add("cursor-dot-root");

    const dot = document.createElement("div");
    dot.className =
      "pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 rounded-full border border-[var(--accent)] bg-[var(--accent)]/85 will-change-transform";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    const move = (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("pointermove", move);
      root.classList.remove("cursor-dot-root");
      dot.remove();
    };
  }, [reduce]);

  return null;
}
