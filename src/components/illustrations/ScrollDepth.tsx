"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/** Gentle depth: the content drifts upwards and settles a touch as the page scrolls. Reversible; off under reduced motion. */
export function ScrollDepth({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 24, mass: 0.5 });
  const y = useTransform(smooth, [0, 1], reduce ? [0, 0] : [36, -36]);
  const rotate = useTransform(smooth, [0, 0.5, 1], reduce ? [0, 0, 0] : [-1.2, 0, 0.8]);
  return (
    <motion.div ref={ref} style={{ y, rotate }}>
      {children}
    </motion.div>
  );
}
