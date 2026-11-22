"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Steps through `steps` states while the element is on screen, then loops
 * after a pause. Under reduced motion it returns the final state, so the
 * illustration always shows a meaningful, completed picture.
 */
export function useLoopStep(steps: number, intervalMs = 1100) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const pauseTicks = 2; // hold the finished state briefly before looping
    const id = window.setInterval(() => setStep((s) => (s >= steps + pauseTicks ? 0 : s + 1)), intervalMs);
    return () => window.clearInterval(id);
  }, [inView, reduce, steps, intervalMs]);

  return { ref, step: reduce ? steps : Math.min(step, steps), reduce: Boolean(reduce), inView };
}

export function Frame({
  label,
  status,
  children,
  className,
  ...rest
}: {
  label: string;
  status?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div className={cn("rounded-panel border border-hairline bg-white p-5 shadow-float sm:p-6", className)} {...rest}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
        {status}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Chip({ tone, children }: { tone: "neutral" | "info" | "positive" | "warning"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors duration-500",
        tone === "neutral" && "bg-oat text-muted",
        tone === "info" && "bg-mist text-steel",
        tone === "positive" && "bg-positive text-white",
        tone === "warning" && "bg-negative-light text-negative",
      )}
    >
      {children}
    </span>
  );
}

export const gbp0 = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
