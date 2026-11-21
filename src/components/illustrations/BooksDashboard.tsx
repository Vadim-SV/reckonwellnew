"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";

/**
 * Hero illustration: a finance "control room" built from UI fragments.
 * Bank lines reconcile one by one, an invoice moves to paid, and a cash
 * chart draws in. Loops slowly while visible; parallax on scroll.
 * Figures are illustrative only.
 */
const bankLines = [
  { date: "03 Mar", payee: "Northwind Supplies", amount: "−£2,480.00" },
  { date: "04 Mar", payee: "Client receipt · INV-1042", amount: "+£12,600.00" },
  { date: "05 Mar", payee: "HMRC VAT", amount: "−£4,115.20" },
  { date: "06 Mar", payee: "Payroll — March", amount: "−£18,340.00" },
];

const bars = [38, 52, 46, 61, 58, 72, 80];

export function BooksDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setStep((s) => (s >= bankLines.length + 3 ? 0 : s + 1)), 1100);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);
  const yFront = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  // Reduced motion: show the finished state rather than the loop.
  const shown = reduce ? bankLines.length + 1 : step;
  const reconciled = Math.min(shown, bankLines.length);
  const invoicePaid = shown > bankLines.length;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration of a finance dashboard: bank transactions being reconciled, an invoice marked as paid, and a cash balance chart rising."
      className="relative mx-auto aspect-[4/5] w-full max-w-xl select-none sm:aspect-[5/4]"
    >
      {/* Reconciliation panel */}
      <motion.div
        style={{ y: yBack }}
        className="absolute inset-x-0 top-0 rounded-panel border border-hairline bg-white p-5 shadow-float sm:right-10"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Bank reconciliation</p>
          <p className="tabular text-xs text-positive">
            {reconciled}/{bankLines.length} matched
          </p>
        </div>
        <ul className="mt-4 space-y-2">
          {bankLines.map((l, i) => {
            const done = i < reconciled;
            return (
              <li
                key={l.payee}
                className={`flex items-center gap-3 rounded-xs px-3 py-2 text-[13px] transition-colors duration-500 ${
                  done ? "bg-positive-light/60" : "bg-cream/70"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    done ? "border-positive bg-positive text-white" : "border-hairline bg-white"
                  }`}
                >
                  {done && <Check className="size-3" strokeWidth={3} aria-hidden />}
                </span>
                <span className="w-12 shrink-0 text-muted">{l.date}</span>
                <span className="min-w-0 flex-1 truncate text-ink">{l.payee}</span>
                <span className="tabular shrink-0 text-ink">{l.amount}</span>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* Invoice card */}
      <motion.div
        style={{ y: yFront }}
        className="absolute bottom-[4%] left-0 w-[54%] rounded-card border border-hairline bg-white p-4 shadow-float"
      >
        <div className="flex items-center justify-between">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-muted">INV-1042</p>
          <motion.span
            key={invoicePaid ? "paid" : "due"}
            initial={reduce ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              invoicePaid ? "bg-positive text-white" : "bg-oat text-muted"
            }`}
          >
            {invoicePaid ? "Paid" : "Due 14 Mar"}
          </motion.span>
        </div>
        <p className="tabular mt-3 font-display text-3xl text-navy">£12,600</p>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-oat" />
          <div className="h-1.5 w-3/4 rounded-full bg-oat" />
        </div>
      </motion.div>

      {/* Cash chart */}
      <motion.div
        style={{ y: yFront }}
        className="absolute right-0 bottom-0 w-[44%] rounded-card bg-navy p-4 text-cream shadow-float"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/60">Cash position</p>
        <p className="tabular mt-1 font-display text-2xl">£248,310</p>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-t-[2px] bg-steel-light"
              initial={reduce ? false : { height: 0 }}
              animate={inView || reduce ? { height: `${h}%` } : { height: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
