import { useEffect, useState } from "react";

/**
 * Tracks which section id is most visible for nav highlighting.
 *
 * @param {string[]} sectionIds
 */
export function useActiveSection(sectionIds) {
  /** Empty string means “hero / page top” — Home stays highlighted until a section wins. */
  const [active, setActive] = useState("");

  useEffect(() => {
    const clearIfNearTop = () => {
      if (typeof window === "undefined") return;
      if (window.scrollY < 96) setActive("");
    };
    clearIfNearTop();
    window.addEventListener("scroll", clearIfNearTop, { passive: true });
    return () => window.removeEventListener("scroll", clearIfNearTop);
  }, []);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.05, 0.25, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
