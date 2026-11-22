"use client";

import { LayoutGroup, motion } from "motion/react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const lines = [
  { id: "l1", payee: "Calder & Finch", amount: 6300, account: "Sales" },
  { id: "l2", payee: "Northwind Supplies", amount: -2480, account: "Purchases" },
  { id: "l3", payee: "Payroll — March", amount: -18340, account: "Wages" },
  { id: "l4", payee: "Meridian Retail", amount: 4200, account: "Sales" },
  { id: "l5", payee: "HMRC VAT", amount: -4115, account: "VAT" },
  { id: "l6", payee: "Atlas Logistics", amount: -1365, account: "Purchases" },
];
const accounts = ["Sales", "Purchases", "Wages", "VAT"] as const;

/** Bank transactions slide out of the feed and into the right accounts. */
export function BankToLedger() {
  const { ref, step, reduce } = useLoopStep(lines.length, 900);
  const coded = lines.slice(0, step);
  const waiting = lines.slice(step);

  return (
    <div ref={ref} role="img" aria-label="Illustration: bank transactions move from the bank feed into organised accounts — sales, purchases, wages and VAT." className="select-none">
      <Frame label="Bank feed → accounts" status={<Chip tone={waiting.length ? "info" : "positive"}>{coded.length}/{lines.length} coded</Chip>}>
        <LayoutGroup>
          <div className="grid grid-cols-[1fr_1.15fr] gap-3">
            <div className="min-h-[15rem] space-y-1.5 rounded-card bg-cream/70 p-2">
              <p className="px-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Bank feed</p>
              {waiting.map((l) => (
                <motion.div
                  key={l.id}
                  layoutId={l.id}
                  layout={!reduce}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  className="rounded-xs border border-hairline bg-white px-2 py-1.5"
                >
                  <p className="truncate text-[11px] text-ink">{l.payee}</p>
                  <p className={`tabular text-[11px] ${l.amount < 0 ? "text-negative" : "text-positive"}`}>
                    {l.amount < 0 ? "−" : "+"}
                    {gbp0(Math.abs(l.amount))}
                  </p>
                </motion.div>
              ))}
              {!waiting.length && <p className="px-1 pt-6 text-center text-[11px] text-positive">All transactions coded ✓</p>}
            </div>
            <div className="space-y-1.5">
              {accounts.map((a) => {
                const items = coded.filter((l) => l.account === a);
                const total = items.reduce((s, l) => s + l.amount, 0);
                return (
                  <div key={a} className="rounded-card border border-hairline bg-white p-2">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[11px] font-medium text-ink">{a}</p>
                      <p className="tabular text-[11px] text-muted">{items.length ? gbp0(Math.abs(total)) : "—"}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {items.map((l) => (
                        <motion.span
                          key={l.id}
                          layoutId={l.id}
                          layout={!reduce}
                          transition={{ type: "spring", stiffness: 240, damping: 26 }}
                          className="max-w-full truncate rounded-full bg-mist px-2 py-0.5 text-[10px] text-steel"
                        >
                          {l.payee}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </LayoutGroup>
      </Frame>
    </div>
  );
}
