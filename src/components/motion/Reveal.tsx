"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the element travels upwards as it appears. */
  y?: number;
};

/**
 * Fades and lifts content into view as it enters the viewport, and reverses
 * when it leaves (once: false), matching the brief's "animations reverse on
 * scroll up".
 *
 * Accessibility: visibility never depends on JavaScript. The `data-reveal`
 * attribute is forced visible by CSS for reduced-motion users (globals.css)
 * and for visitors without JavaScript (<noscript> rule in layout.tsx).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
