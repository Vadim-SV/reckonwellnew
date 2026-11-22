"use client";

import { LayoutGroup, motion } from "motion/react";
import { Check } from "lucide-react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const bills = [
  { supplier: "Northwind Supplies", ref: "NW-2291", amount: 2480 },
  { supplier: "Atlas Logistics", ref: "AT-1180", amount: 1365 },
  { supplier: "Brightline Energy", ref: "BE-77302", amount: 912 },
  { supplier: "Harbour Print Co.", ref: "HP-0458", amount: 3485 },
];
const columns = ["Received", "Checked & coded", "Ready to pay"] as const;

/** Supplier bills move from the inbox, through checking, into a payment run awaiting approval. */
export function AccountsPayableFlow() {
  const total = bills.length + columns.length - 1; // last bill reaches the last column
  const { ref, step, reduce } = useLoopStep(total, 900);
  const stageOf = (i: number) => Math.max(0, Math.min(columns.length - 1, step - i));
  const ready = bills.filter((_, i) => stageOf(i) === 2);
  const runTotal = ready.reduce((s, b) => s + b.amount, 0);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: supplier invoices move from received, to checked and coded, to ready to pay, building a payment run for approval."
      className="select-none"
    >
      <Frame label="Supplier bills · March" status={<Chip tone="info">{bills.length} bills</Chip>}>
        <LayoutGroup>
          <div className="grid grid-cols-3 gap-2">
            {columns.map((col, c) => (
              <div key={col} className="min-h-[13rem] rounded-card bg-cream/70 p-2">
                <p className="px-1 pb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">{col}</p>
                <div className="space-y-1.5">
                  {bills.map((b, i) =>
                    stageOf(i) === c ? (
                      <motion.div
                        key={b.ref}
                        layoutId={b.ref}
                        layout={!reduce}
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        className="rounded-xs border border-hairline bg-white px-2 py-1.5 shadow-sm"
                      >
                        <p className="truncate text-[11px] font-medium text-ink">{b.supplier}</p>
                        <p className="flex items-center justify-between text-[10px] text-muted">
                          <span className="truncate">{b.ref}</span>
                          <span className="tabular text-ink">{gbp0(b.amount)}</span>
                        </p>
                        {c === 2 && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-positive">
                            <Check className="size-3" strokeWidth={3} aria-hidden /> Matched to PO
                          </span>
                        )}
                      </motion.div>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </LayoutGroup>
        <div className="mt-3 flex items-center justify-between rounded-card bg-navy px-4 py-3 text-cream">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Payment run · Friday</p>
            <p className="tabular font-display text-xl">{gbp0(runTotal)}</p>
          </div>
          <Chip tone={ready.length === bills.length ? "positive" : "neutral"}>
            {ready.length === bills.length ? "Awaiting your approval" : `${ready.length}/${bills.length} ready`}
          </Chip>
        </div>
      </Frame>
    </div>
  );
}
