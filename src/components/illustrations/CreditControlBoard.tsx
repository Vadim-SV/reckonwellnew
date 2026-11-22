"use client";

import { motion } from "motion/react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const invoices = [
  { customer: "Meridian Retail", ref: "INV-1038", amount: 4200, days: 21 },
  { customer: "Oakfield Studio", ref: "INV-1041", amount: 1850, days: 12 },
  { customer: "Calder & Finch", ref: "INV-1044", amount: 6300, days: 5 },
];
const stages = [
  { label: "Overdue", tone: "warning" as const },
  { label: "Reminder sent", tone: "neutral" as const },
  { label: "Promised Fri", tone: "info" as const },
  { label: "Paid", tone: "positive" as const },
];

/** Overdue invoices move from reminder to paid, and the aged balance shrinks. */
export function CreditControlBoard() {
  const total = invoices.length + stages.length - 2;
  const { ref, step } = useLoopStep(total, 1000);
  const stageOf = (i: number) => Math.max(0, Math.min(stages.length - 1, step - i));
  const outstanding = invoices.reduce((s, inv, i) => s + (stageOf(i) === 3 ? 0 : inv.amount), 0);
  const start = invoices.reduce((s, inv) => s + inv.amount, 0);
  const aged = [
    { label: "Current", value: 9400 },
    { label: "1–30", value: Math.round(outstanding * 0.7) + 600 },
    { label: "31–60", value: Math.round(outstanding * 0.3) },
    { label: "60+", value: step > 2 ? 0 : 1200 },
  ];
  const max = 12000;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: overdue customer invoices are chased with reminders until they are paid, and the aged debtors chart shrinks."
      className="select-none"
    >
      <Frame label="Credit control" status={<Chip tone={outstanding === 0 ? "positive" : "warning"}>{gbp0(outstanding)} overdue</Chip>}>
        <ul className="space-y-2">
          {invoices.map((inv, i) => {
            const s = stages[stageOf(i)];
            return (
              <li key={inv.ref} className="flex items-center gap-3 rounded-xs bg-cream/70 px-3 py-2 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-ink">{inv.customer}</p>
                  <p className="text-[11px] text-muted">
                    {inv.ref} · {inv.days} days late
                  </p>
                </div>
                <span className="tabular text-ink">{gbp0(inv.amount)}</span>
                <motion.span key={s.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                  <Chip tone={s.tone}>{s.label}</Chip>
                </motion.span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 rounded-card bg-navy p-4 text-cream">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Aged debtors</p>
            <p className="text-[11px] text-cream/60">Collected {gbp0(start - outstanding)}</p>
          </div>
          <div className="mt-3 grid h-20 grid-cols-4 items-end gap-3">
            {aged.map((a) => (
              <div key={a.label} className="flex h-full flex-col justify-end">
                <motion.div
                  className={a.label === "60+" || a.label === "31–60" ? "rounded-t-[2px] bg-[#c98d7f]" : "rounded-t-[2px] bg-steel-light"}
                  animate={{ height: `${Math.max(4, (a.value / max) * 100)}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <p className="mt-1 text-center text-[10px] text-cream/60">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </div>
  );
}
