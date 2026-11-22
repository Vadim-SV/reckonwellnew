"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Chip, Frame, useLoopStep } from "./shared";

const tasks = [
  "Bank and card reconciliations",
  "Supplier and customer ledgers",
  "Accruals and prepayments",
  "Payroll journals",
  "VAT control account",
  "Balance sheet review",
];

/** Close tasks tick off one by one while a progress ring fills to "Month closed". */
export function MonthEndClose() {
  const { ref, step, reduce } = useLoopStep(tasks.length, 750);
  const done = step;
  const pct = done / tasks.length;
  const r = 38;
  const c = 2 * Math.PI * r;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: month-end tasks are completed one by one until the month is closed."
      className="select-none"
    >
      <Frame label="Month-end close · March" status={<Chip tone={done === tasks.length ? "positive" : "info"}>Working day {Math.max(1, Math.ceil(pct * 5))}</Chip>}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-5">
          <ul className="space-y-2">
            {tasks.map((t, i) => {
              const ok = i < done;
              return (
                <li key={t} className="flex items-center gap-2.5 text-[13px]">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      ok ? "border-positive bg-positive text-white" : "border-hairline bg-white"
                    }`}
                  >
                    {ok && <Check className="size-3" strokeWidth={3} aria-hidden />}
                  </span>
                  <span className={ok ? "text-ink" : "text-muted"}>{t}</span>
                </li>
              );
            })}
          </ul>
          <div className="relative size-28">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-oat)" strokeWidth="9" />
              <motion.circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="var(--color-positive)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={c}
                initial={false}
                animate={{ strokeDashoffset: c * (1 - pct) }}
                transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="tabular font-display text-2xl text-navy">{Math.round(pct * 100)}%</span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{done === tasks.length ? "Closed" : "Closing"}</span>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}
