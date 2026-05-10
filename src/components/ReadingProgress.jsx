import { useEffect, useState } from "react";

/**
 * Fixed bottom scroll progress bar for the document.
 *
 * @param {{ ariaLabel: string }} props
 */
export function ReadingProgress({ ariaLabel }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const denom = Math.max(
        1,
        document.body.scrollHeight - window.innerHeight,
      );
      const raw = (window.scrollY / denom) * 100;
      setPct(Math.min(100, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const hidden = pct <= 0 || pct >= 100;

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 z-50 h-[3px] w-full bg-[#1f1f1f] transition-opacity duration-150 ease-linear ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="h-full bg-[#e8ff47] transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
