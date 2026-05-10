import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

/**
 * Adds subtle 3D tilt on pointer move with perspective.
 *
 * @param {{ children: import('react').ReactNode; className?: string }} props
 */
export function ProjectTiltCard({ children, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hover, setHover] = useState(false);

  const style = useMemo(
    () =>
      reduce
        ? {}
        : {
            rotateX: tilt.rx,
            rotateY: tilt.ry,
            transformPerspective: 1000,
          },
    [reduce, tilt.rx, tilt.ry],
  );

  const onMove = (e) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 12 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={ref}
      className={`${hover ? "will-change-transform" : ""} ${className}`}
      style={style}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        reset();
      }}
      onPointerMove={onMove}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
