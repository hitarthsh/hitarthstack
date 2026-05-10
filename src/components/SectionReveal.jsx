import { motion, useReducedMotion } from "framer-motion";

/**
 * Fade-up section reveal on scroll; respects reduced motion.
 *
 * @param {{ id?: string; className?: string; children: import('react').ReactNode }} props
 */
export function SectionReveal({ id, className = "", children, ...rest }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id={id} className={className} {...rest}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      {...rest}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
