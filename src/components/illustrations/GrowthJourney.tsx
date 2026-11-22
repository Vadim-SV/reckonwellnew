"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export type JourneyStage = { title: string; text: string };

function Stage({ stage, index, count, progress }: { stage: JourneyStage; index: number; count: number; progress: MotionValue<number> }) {
  const start = index / count;
  const active = useTransform(progress, [start, start + 0.12], [0, 1], { clamp: true });
  const scale = useTransform(active, [0, 1], [0.85, 1]);
  const bg = useTransform(active, (a) => (a > 0.5 ? "var(--color-navy)" : "var(--color-cream)"));
  const fg = useTransform(active, (a) => (a > 0.5 ? "var(--color-cream)" : "var(--color-muted)"));
  const textOpacity = useTransform(active, [0, 1], [0.45, 1]);
  return (
    <li className="relative flex gap-5 lg:flex-col lg:gap-0">
      <motion.span
        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-navy/30 font-display text-lg shadow-card"
        style={{ scale, backgroundColor: bg, color: fg }}
      >
        {index + 1}
      </motion.span>
      <motion.div style={{ opacity: textOpacity }} className="pb-8 lg:mt-6 lg:pr-6 lg:pb-0">
        <h3 className="text-2xl">{stage.title}</h3>
        <p className="mt-2 leading-relaxed">{stage.text}</p>
      </motion.div>
    </li>
  );
}

/**
 * A growth journey whose progress line and stages follow the scroll position,
 * reversing when scrolling back up. Vertical on mobile, horizontal on desktop.
 */
export function GrowthJourney({ stages, className }: { stages: JourneyStage[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const full = useTransform(smooth, () => 1);
  const p = reduce ? full : smooth;
  const line = useTransform(p, [0, 0.9], [0, 1], { clamp: true });

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* track + progress: vertical (mobile) */}
      <div aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-navy/15 lg:hidden">
        <motion.div className="h-full w-full origin-top bg-navy" style={{ scaleY: line }} />
      </div>
      {/* track + progress: horizontal (desktop) */}
      <div aria-hidden className="absolute top-6 left-6 hidden h-px bg-navy/15 lg:block" style={{ right: `calc(${100 / stages.length}% - 1.5rem)` }}>
        <motion.div className="h-full w-full origin-left bg-navy" style={{ scaleX: line }} />
      </div>
      <ol className="relative grid lg:[grid-template-columns:repeat(var(--stages),minmax(0,1fr))]" style={{ ["--stages" as string]: stages.length }}>
        {stages.map((s, i) => (
          <Stage key={s.title} stage={s} index={i} count={stages.length} progress={p} />
        ))}
      </ol>
    </div>
  );
}
