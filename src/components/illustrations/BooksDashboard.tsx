"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, Check, FileText, Landmark, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Homepage hero: a finance-operations demo built from UI fragments.
 *
 * The story loops while visible:
 *   Capture   — invoices, supplier bills and bank lines arrive in a live feed
 *   Reconcile — bank lines are matched; the counter climbs
 *   Review    — balances are checked; outstanding customer invoices tracked
 *   Report    — the management report draws and the month is closed
 *
 * Layers move at different speeds on scroll for depth. Under reduced motion
 * the scene shows its completed state. All figures are fictional.
 */

type FeedItem = { kind: "invoice" | "bill" | "bank-in" | "bank-out"; title: string; meta: string; amount: string };

const feed: FeedItem[] = [
  { kind: "bill", title: "Northwind Supplies", meta: "Supplier bill · NW-2291", amount: "£2,480.00" },
  { kind: "bank-in", title: "Meridian Retail", meta: "Bank receipt · INV-1038", amount: "+£4,200.00" },
  { kind: "invoice", title: "Calder & Finch", meta: "Sales invoice · INV-1047", amount: "£6,300.00" },
  { kind: "bank-out", title: "HMRC VAT", meta: "Bank payment · Q4", amount: "−£4,115.20" },
  { kind: "bill", title: "Atlas Logistics", meta: "Supplier bill · AT-1180", amount: "£1,365.00" },
  { kind: "bank-in", title: "Oakfield Studio", meta: "Bank receipt · INV-1041", amount: "+£1,850.00" },
  { kind: "bank-out", title: "Payroll — March", meta: "Bank payment · 24 staff", amount: "−£48,340.00" },
  { kind: "invoice", title: "Harbour Print Co.", meta: "Sales invoice · INV-1048", amount: "£3,120.00" },
];

const phases = ["Capture", "Reconcile", "Review", "Report"] as const;
const TICKS_PER_PHASE = 4;
const CYCLE = phases.length * TICKS_PER_PHASE; // 16 ticks, then a short hold
const HOLD = 3;
const FINAL = CYCLE - 1;

const bars = [46, 52, 49, 58, 63, 61, 70, 76];

const icons = {
  invoice: FileText,
  bill: Receipt,
  "bank-in": ArrowDownLeft,
  "bank-out": ArrowUpRight,
} as const;

function FeedRow({ item }: { item: FeedItem }) {
  const Icon = icons[item.kind];
  const tone =
    item.kind === "bank-in" ? "bg-positive-light text-positive" : item.kind === "bank-out" ? "bg-negative-light text-negative" : "bg-mist text-steel";
  return (
    <div className="flex items-center gap-2.5 rounded-xs bg-cream/70 px-2.5 py-2">
      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", tone)}>
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium text-ink">{item.title}</span>
        <span className="block truncate text-[10px] text-muted">{item.meta}</span>
      </span>
      <span className="tabular shrink-0 text-[12px] text-ink">{item.amount}</span>
    </div>
  );
}

export function BooksDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setTick((t) => (t >= CYCLE + HOLD ? 0 : t + 1)), 1150);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  // Scroll depth: back layer drifts slowly, front cards faster.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.5 });
  const yBack = useTransform(smooth, [0, 1], reduce ? [0, 0] : [24, -24]);
  const yFrontA = useTransform(smooth, [0, 1], reduce ? [0, 0] : [70, -50]);
  const yFrontB = useTransform(smooth, [0, 1], reduce ? [0, 0] : [50, -70]);

  const t = reduce ? FINAL : Math.min(tick, FINAL);
  const phase = Math.min(phases.length - 1, Math.floor(t / TICKS_PER_PHASE));
  const visibleFeed = [0, 1, 2].map((i) => feed[(t + i) % feed.length]);
  const matched = Math.min(48, 31 + Math.round((t / FINAL) * 17));
  const outstanding = Math.max(9_120, 18_450 - Math.max(0, t - 6) * 1_040);
  const reportReady = phase >= 3;
  const closed = t >= FINAL;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration of Reckonwell's finance operations: invoices, supplier bills and bank transactions arrive, are reconciled and reviewed, and become a monthly management report with the month closed."
      className="relative mx-auto aspect-[4/5] w-full max-w-xl select-none sm:aspect-[6/5]"
    >
      {/* Back panel: phases + feed + reconciliation */}
      <motion.div
        style={{ y: yBack }}
        className="absolute inset-x-0 top-0 rounded-panel border border-hairline bg-white p-4 shadow-float sm:right-6 sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Finance operations · March</p>
          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="relative flex size-2">
              {!reduce && <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive/60" />}
              <span className="relative inline-flex size-2 rounded-full bg-positive" />
            </span>
            Live
          </span>
        </div>

        {/* Phase tracker */}
        <ol className="mt-3 grid grid-cols-4 gap-1.5">
          {phases.map((p, i) => {
            const done = i < phase || closed;
            const active = i === phase && !closed;
            return (
              <li key={p} className="relative overflow-hidden rounded-xs bg-cream/80 px-2 py-1.5">
                <span className={cn("flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.08em]", done || active ? "text-navy" : "text-muted")}>
                  {done && <Check className="size-3 text-positive" strokeWidth={3} aria-hidden />}
                  {p}
                </span>
                <motion.span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-0.5 bg-navy"
                  initial={false}
                  animate={{ width: done ? "100%" : active ? `${(((t % TICKS_PER_PHASE) + 1) / TICKS_PER_PHASE) * 100}%` : "0%" }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: "linear" }}
                />
              </li>
            );
          })}
        </ol>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Incoming</p>
            <div className="relative h-[10.6rem] space-y-1.5 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleFeed.map((item) => (
                  <motion.div
                    key={item.meta}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: -18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <FeedRow item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden flex-col justify-between rounded-card bg-cream/70 p-3 sm:flex">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Bank reconciliation</p>
              <p className="tabular mt-1 font-display text-3xl text-navy">
                {matched}
                <span className="text-base text-muted">/48</span>
              </p>
              <p className="text-[11px] text-muted">lines matched</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-oat">
              <motion.div
                className="h-full rounded-full bg-positive"
                initial={false}
                animate={{ width: `${(matched / 48) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Front-left: customers owing */}
      <motion.div
        style={{ y: yFrontA }}
        className="absolute bottom-[3%] left-0 w-[52%] rounded-card border border-hairline bg-white p-4 shadow-float sm:w-[46%]"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Customers owe</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-500",
              phase >= 2 ? "bg-positive text-white" : "bg-oat text-muted",
            )}
          >
            {phase >= 2 ? "Chased" : "Due"}
          </span>
        </div>
        <p className="tabular mt-2 font-display text-2xl text-navy sm:text-3xl">
          £{outstanding.toLocaleString("en-GB")}
        </p>
        <div className="mt-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          <motion.span className="bg-steel" initial={false} animate={{ flexGrow: 6 }} />
          <motion.span className="bg-steel-light" initial={false} animate={{ flexGrow: phase >= 2 ? 2 : 4 }} transition={{ duration: 0.8 }} />
          <motion.span className="bg-[#c98d7f]" initial={false} animate={{ flexGrow: phase >= 2 ? 0.4 : 2 }} transition={{ duration: 0.8 }} />
        </div>
        <p className="mt-1.5 text-[10px] text-muted">Current · 1–30 days · Overdue</p>
      </motion.div>

      {/* Front-right: management report */}
      <motion.div
        style={{ y: yFrontB }}
        className="absolute right-0 bottom-0 w-[46%] rounded-card bg-navy p-4 text-cream shadow-float sm:w-[44%]"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-cream/60">Management report</p>
          <AnimatePresence>
            {closed && (
              <motion.span
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 rounded-full bg-positive px-2 py-0.5 text-[10px] font-medium text-white"
              >
                <Check className="size-3" strokeWidth={3} aria-hidden /> March closed
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[10px] text-cream/60">Net profit</p>
        <p className="tabular font-display text-2xl sm:text-3xl">{reportReady ? "£36,250" : "—"}</p>
        <div className="mt-2 flex h-14 items-end gap-1">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className={cn("flex-1 rounded-t-[2px]", i === bars.length - 1 ? "bg-cream" : "bg-steel-light")}
              initial={false}
              animate={{ height: reportReady ? `${h}%` : "6%" }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-cream/60">
          <Landmark className="size-3" aria-hidden /> Cash £248,310
        </p>
      </motion.div>
    </div>
  );
}
