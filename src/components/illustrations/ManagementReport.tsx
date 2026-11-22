"use client";

import { motion } from "motion/react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const lines = [
  { label: "Sales", value: 186400 },
  { label: "Cost of sales", value: -98250 },
  { label: "Overheads", value: -51900 },
];
const trend = [22, 28, 25, 31, 34, 33, 39, 42];

/** Ledger lines flow into a monthly report: P&L summary, profit and a trend line. */
export function ManagementReport() {
  const { ref, step, reduce } = useLoopStep(lines.length + 2, 1000);
  const shownLines = Math.min(step, lines.length);
  const showChart = step > lines.length;
  const profit = lines.slice(0, shownLines).reduce((s, l) => s + l.value, 0);
  const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * 280 + 10},${80 - v * 1.5}`).join(" ");

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: sales, cost of sales and overheads come together into a monthly management report showing net profit and a rising trend."
      className="select-none"
    >
      <Frame label="Management accounts · March" status={<Chip tone={showChart ? "positive" : "neutral"}>{showChart ? "Report ready" : "Preparing"}</Chip>}>
        <div className="space-y-1.5">
          {lines.map((l, i) => (
            <motion.div
              key={l.label}
              initial={false}
              animate={{ opacity: i < shownLines ? 1 : 0.25, x: i < shownLines || reduce ? 0 : -8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between rounded-xs bg-cream/70 px-3 py-2 text-[13px]"
            >
              <span className="text-ink">{l.label}</span>
              <span className={`tabular ${l.value < 0 ? "text-negative" : "text-ink"}`}>
                {l.value < 0 ? `(${gbp0(-l.value)})` : gbp0(l.value)}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 rounded-card bg-navy p-4 text-cream">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Net profit</p>
            <p className="tabular font-display text-2xl">{gbp0(profit)}</p>
          </div>
          <svg viewBox="0 0 300 90" className="mt-2 h-20 w-full" aria-hidden>
            <motion.polyline
              points={pts}
              fill="none"
              stroke="var(--color-steel-light)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: showChart ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>
      </Frame>
    </div>
  );
}
