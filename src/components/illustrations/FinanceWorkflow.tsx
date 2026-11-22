"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Check, FileText, Landmark, Receipt, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Documents arrive",
    text: "Supplier bills, sales invoices, receipts and bank statements come in by email, upload or bank feed. Nothing sits forgotten in someone's inbox.",
  },
  {
    title: "Transactions are processed",
    text: "Each item is checked, coded to the right account and given the right VAT treatment — every week, not in a rush at month-end.",
  },
  {
    title: "Accounts are reconciled",
    text: "Bank, card and payment accounts are matched line by line to your records, so the balances are right.",
  },
  {
    title: "Records are reviewed",
    text: "A second person checks balances, VAT and anything unusual before the numbers go anywhere.",
  },
  {
    title: "Reports are prepared",
    text: "You get a clear monthly report: profit, cash, what customers owe and what you owe — with a short note on what changed.",
  },
  {
    title: "Month-end completed",
    text: "The month is closed on an agreed working day. Everything is ready for the next one, and for year-end.",
  },
];

const docs = [
  { icon: FileText, label: "INV-1047.pdf" },
  { icon: Receipt, label: "Bill AT-1180" },
  { icon: Landmark, label: "March statement" },
];

const rows = [
  { payee: "Atlas Logistics", code: "5100 · Carriage", amount: "−£1,365.00" },
  { payee: "Calder & Finch", code: "4000 · Sales", amount: "+£6,300.00" },
  { payee: "Brightline Energy", code: "7200 · Utilities", amount: "−£912.40" },
  { payee: "Payroll — March", code: "7000 · Wages", amount: "−£48,340.00" },
];

const reviewChecks = ["VAT control", "Accruals", "Payroll journals"];
const bars = [40, 48, 45, 56, 61, 59, 68, 74];

/** The visual for a given step (0–5). Each step adds to what came before. */
function Scene({ step, reduce }: { step: number; reduce: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const d = reduce ? 0 : 0.5;
  return (
    <div className="relative overflow-hidden rounded-panel border border-hairline bg-white p-4 shadow-float sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">March books</p>
        <p className="tabular text-[11px] text-muted">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      {/* 1. Inbox */}
      <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
        {docs.map((doc, i) => {
          const Icon = doc.icon;
          const processed = step >= 1;
          return (
            <motion.span
              key={doc.label}
              initial={false}
              animate={{ opacity: 1, y: 0, scale: processed ? 0.94 : 1 }}
              transition={{ duration: d, delay: reduce ? 0 : i * 0.08, ease }}
              className={cn(
                "items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-500",
                i === 2 ? "hidden sm:flex" : "flex",
                processed ? "border-hairline bg-cream text-muted" : "border-steel/40 bg-mist text-ink",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {doc.label}
              {processed && <Check className="size-3 text-positive" strokeWidth={3} aria-hidden />}
            </motion.span>
          );
        })}
      </div>

      {/* 2–4. Ledger */}
      <div className="mt-3 space-y-1.5 sm:mt-4">
        {rows.map((r, i) => {
          const shown = step >= 1;
          const reconciled = step >= 2;
          return (
            <motion.div
              key={r.payee}
              initial={false}
              animate={{ opacity: shown ? 1 : 0.2, x: shown ? 0 : -10 }}
              transition={{ duration: d, delay: reduce || !shown ? 0 : i * 0.07, ease }}
              className={cn(
                "items-center gap-3 rounded-xs px-3 py-1.5 text-[12px] transition-colors duration-500 sm:py-2",
                i === 3 ? "hidden sm:flex" : "flex",
                reconciled ? "bg-positive-light/55" : "bg-cream/70",
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                  reconciled ? "border-positive bg-positive text-white" : "border-hairline bg-white",
                )}
              >
                {reconciled && <Check className="size-2.5" strokeWidth={3} aria-hidden />}
              </span>
              <span className="min-w-0 flex-1 truncate text-ink">{r.payee}</span>
              <span className={cn("hidden truncate text-muted transition-opacity sm:block", shown ? "opacity-100" : "opacity-0")}>{r.code}</span>
              <span className="tabular shrink-0 text-ink">{r.amount}</span>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Review */}
      <motion.div
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, height: step >= 3 ? "auto" : 0 }}
        transition={{ duration: d, ease }}
        className="overflow-hidden"
      >
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-card border border-hairline bg-cream/60 px-3 py-2.5">
          <ShieldCheck className="size-4 text-steel" aria-hidden />
          <span className="text-[12px] font-medium text-ink">Reviewed</span>
          {reviewChecks.map((c, i) => (
            <span
              key={c}
              className={cn("items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] text-muted", i === 0 ? "flex" : "hidden sm:flex")}
            >
              <Check className="size-3 text-positive" strokeWidth={3} aria-hidden />
              {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 5. Report */}
      <motion.div
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0.15 }}
        transition={{ duration: d }}
        className="mt-3 grid grid-cols-[auto_1fr] items-end gap-4 rounded-card bg-navy p-3 text-cream sm:p-4"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Net profit</p>
          <p className="tabular font-display text-2xl">{step >= 4 ? "£36,250" : "—"}</p>
          <p className="text-[10px] text-cream/60">Cash £248,310</p>
        </div>
        <div className="flex h-10 items-end gap-1 sm:h-14">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-t-[2px] bg-steel-light"
              initial={false}
              animate={{ height: step >= 4 ? `${h}%` : "6%" }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.05, ease }}
            />
          ))}
        </div>
      </motion.div>

      {/* 6. Closed stamp */}
      <AnimatePresence>
        {step >= 5 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.25, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="pointer-events-none absolute top-6 right-5 rounded-xs border-2 border-positive bg-white/90 px-3 py-1.5 text-center text-positive shadow-card"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">March closed</p>
            <p className="text-[10px]">Working day 5</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Six-step monthly workflow driven by scroll position. The visual is sticky
 * while the steps scroll past; scrolling back up reverses the sequence.
 * No scroll hijacking — the page scrolls normally.
 */
export function FinanceWorkflow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(usePrefersReducedMotion());
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.3", "end 0.8"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.max(0, Math.min(steps.length - 1, Math.floor(p * steps.length)));
    setActive((cur) => (cur === next ? cur : next));
  });

  const step = reduce ? steps.length - 1 : active;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      {/* Sticky visual (above the steps on mobile, beside them on desktop) */}
      <div className="sticky top-16 z-10 -mx-4 bg-mist/95 px-4 pt-3 pb-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:top-28 lg:order-2 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div role="img" aria-label={`Illustration of the monthly finance workflow, currently showing: ${steps[step].title}.`}>
          <Scene step={step} reduce={reduce} />
        </div>
      </div>

      <ol className="lg:order-1">
        {steps.map((s, i) => {
          const isActive = i === step || reduce;
          const done = i < step;
          return (
            <li key={s.title} className="flex min-h-[38vh] gap-5 py-6 lg:min-h-[52vh] lg:items-center">
              <span
                className={cn(
                  "tabular flex size-11 shrink-0 items-center justify-center rounded-full border font-display text-lg transition-colors duration-500",
                  isActive ? "border-navy bg-navy text-cream" : done ? "border-navy/40 bg-white text-navy" : "border-hairline bg-white text-muted",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : String(i + 1).padStart(2, "0")}
              </span>
              <div className={cn("transition-opacity duration-500", isActive ? "opacity-100" : "opacity-45")}>
                <Eyebrow>{String(i + 1).padStart(2, "0")}</Eyebrow>
                <h3 className="mt-2 text-3xl">{s.title}</h3>
                <p className="mt-3 max-w-md text-lg leading-relaxed">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
