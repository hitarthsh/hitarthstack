import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/**
 * Enables Lenis smooth scrolling when motion is allowed.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function LenisProvider({ children }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.09,
    });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return children;
}
