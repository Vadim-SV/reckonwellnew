"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

const subsidiaries = [
  { name: "Retail Ltd", revenue: 412000, cash: 96000 },
  { name: "Property Ltd", revenue: 188000, cash: 54000 },
  { name: "Services Ltd", revenue: 276000, cash: 71000 },
];
const fmt = (n: number) => `£${Math.round(n / 1000).toLocaleString("en-GB")}k`;

// Card centres in a 0–100 coordinate space (shared by the SVG connectors and the cards).
const HOLDING = { x: 50, y: 10 };
const SUBS = [
  { x: 17, y: 46 },
  { x: 50, y: 46 },
  { x: 83, y: 46 },
];
const OVERVIEW = { x: 50, y: 86 };

function Connector({ from, to, progress }: { from: { x: number; y: number }; to: { x: number; y: number }; progress: MotionValue<number> }) {
  const midY = (from.y + to.y) / 2;
  const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  return (
    <>
      <path d={d} fill="none" stroke="var(--color-oat)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
      <motion.path d={d} fill="none" stroke="var(--color-steel)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" style={{ pathLength: progress }} />
    </>
  );
}

function Counter({ value, progress }: { value: number; progress: MotionValue<number> }) {
  const text = useTransform(progress, (p) => fmt(value * p));
  return <motion.span className="tabular">{text}</motion.span>;
}

/**
 * A holding company connected to its subsidiaries, with each company's
 * figures flowing into a group overview. Driven by scroll position, so it
 * builds as you scroll down and unwinds as you scroll back up.
 */
export function GroupStructure() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.6"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const full = useTransform(smooth, () => 1);
  const p = reduce ? full : smooth;

  const down = useTransform(p, [0, 0.4], [0, 1], { clamp: true });
  const subsIn = useTransform(p, [0.15, 0.45], [0, 1], { clamp: true });
  const flow = useTransform(p, [0.45, 0.8], [0, 1], { clamp: true });
  const totals = useTransform(p, [0.6, 1], [0, 1], { clamp: true });
  const subsY = useTransform(subsIn, [0, 1], [16, 0]);
  const overviewOpacity = useTransform(flow, [0, 0.4], [0.35, 1]);

  const totalRevenue = subsidiaries.reduce((s, c) => s + c.revenue, 0);
  const totalCash = subsidiaries.reduce((s, c) => s + c.cash, 0);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: a holding company connected to three subsidiaries, whose revenue and cash figures flow into a single group overview."
      className="relative mx-auto aspect-[4/5] w-full max-w-xl select-none sm:aspect-[5/4]"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        {SUBS.map((s, i) => (
          <Connector key={`d${i}`} from={HOLDING} to={s} progress={down} />
        ))}
        {SUBS.map((s, i) => (
          <Connector key={`f${i}`} from={s} to={OVERVIEW} progress={flow} />
        ))}
      </svg>

      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${HOLDING.x}%`, top: `${HOLDING.y}%` }}>
        <div className="rounded-card bg-navy px-5 py-3 text-center text-cream shadow-float">
          <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Holding company</p>
          <p className="font-display text-lg whitespace-nowrap">Holdings Ltd</p>
        </div>
      </div>

      {subsidiaries.map((c, i) => (
        <motion.div
          key={c.name}
          className="absolute w-[30%] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${SUBS[i].x}%`, top: `${SUBS[i].y}%`, opacity: subsIn, y: subsY }}
        >
          <div className="rounded-card border border-hairline bg-white p-3 shadow-card">
            <p className="truncate text-[11px] font-medium text-ink sm:text-xs">{c.name}</p>
            <dl className="mt-2 space-y-1 text-[10px] sm:text-[11px]">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Revenue</dt>
                <dd className="text-ink">
                  <Counter value={c.revenue} progress={subsIn} />
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Cash</dt>
                <dd className="text-ink">
                  <Counter value={c.cash} progress={subsIn} />
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-[10px] text-positive">✓ Reconciled</p>
          </div>
        </motion.div>
      ))}

      <motion.div
        className="absolute w-[78%] -translate-x-1/2 -translate-y-1/2 sm:w-[64%]"
        style={{ left: `${OVERVIEW.x}%`, top: `${OVERVIEW.y}%`, opacity: overviewOpacity }}
      >
        <div className="rounded-card bg-navy p-4 text-cream shadow-float">
          <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Group overview · March</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-cream/60">Revenue</p>
              <p className="font-display text-lg sm:text-xl">
                <Counter value={totalRevenue} progress={totals} />
              </p>
            </div>
            <div>
              <p className="text-[10px] text-cream/60">Cash</p>
              <p className="font-display text-lg sm:text-xl">
                <Counter value={totalCash} progress={totals} />
              </p>
            </div>
            <div>
              <p className="text-[10px] text-cream/60">Intercompany</p>
              <motion.p className="font-display text-lg sm:text-xl" style={{ opacity: totals }}>
                Balanced
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
