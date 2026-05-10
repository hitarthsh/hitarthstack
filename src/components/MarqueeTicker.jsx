import { Children, cloneElement, useCallback, useState } from "react";

/**
 * Full-width infinite horizontal marquee. Duplicates children once for a seamless loop.
 *
 * @param {{
 *   children: import("react").ReactNode;
 *   durationSec?: number;
 *   className?: string;
 * }} props
 */
export function MarqueeTicker({ children, durationSec = 40, className = "" }) {
  const [paused, setPaused] = useState(false);
  const items = Children.toArray(children);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div
        className="marquee-track-animate flex w-max gap-8"
        style={{
          ["--marquee-duration"]: `${durationSec}s`,
        }}
        data-paused={paused ? "true" : "false"}
      >
        {items.map((child, i) =>
          cloneElement(child, { key: `marquee-a-${i}` }),
        )}
        {items.map((child, i) =>
          cloneElement(child, { key: `marquee-b-${i}` }),
        )}
      </div>
    </div>
  );
}
