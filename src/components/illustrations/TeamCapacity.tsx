"use client";

import { LayoutGroup, motion } from "motion/react";
import { Chip, Frame, useLoopStep } from "./shared";

const tasks = ["Supplier bills", "Bank reconciliations", "Credit control", "Payroll", "VAT return", "Month-end journals"];
const KEEP = 2; // tasks the in-house team keeps

/** Routine tasks move from an overloaded in-house team to Reckonwell; capacity falls back to healthy. */
export function TeamCapacity() {
  const moves = tasks.length - KEEP;
  const { ref, step, reduce } = useLoopStep(moves, 1000);
  const moved = tasks.slice(0, step);
  const kept = tasks.slice(step);
  const load = Math.round(150 - (step / moves) * 80); // 150% → 70%
  const healthy = load <= 100;

  return (
    <div ref={ref} role="img" aria-label="Illustration: routine finance tasks move from an overloaded in-house finance team to Reckonwell, bringing the team's workload back to a healthy level." className="select-none">
      <Frame label="Finance workload" status={<Chip tone={healthy ? "positive" : "warning"}>Team at {load}%</Chip>}>
        <LayoutGroup>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-card bg-cream/70 p-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Your finance manager</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-oat">
                <motion.div
                  className={healthy ? "h-full bg-positive" : "h-full bg-[#c98d7f]"}
                  initial={false}
                  animate={{ width: `${Math.min(100, (load / 150) * 100)}%` }}
                  transition={{ duration: reduce ? 0 : 0.7 }}
                />
              </div>
              <div className="mt-3 min-h-[12rem] space-y-1.5">
                {kept.map((t) => (
                  <motion.div key={t} layoutId={t} layout={!reduce} transition={{ type: "spring", stiffness: 240, damping: 26 }} className="rounded-xs border border-hairline bg-white px-2.5 py-1.5 text-[12px] text-ink">
                    {t}
                  </motion.div>
                ))}
                {healthy && <p className="pt-2 text-[11px] text-positive">Time back for forecasting and decisions</p>}
              </div>
            </div>
            <div className="rounded-card bg-navy p-3 text-cream">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-cream/60">Reckonwell</p>
              <div className="mt-2 h-1.5 rounded-full bg-cream/15" />
              <div className="mt-3 min-h-[12rem] space-y-1.5">
                {moved.map((t) => (
                  <motion.div key={t} layoutId={t} layout={!reduce} transition={{ type: "spring", stiffness: 240, damping: 26 }} className="rounded-xs bg-cream/10 px-2.5 py-1.5 text-[12px] text-cream">
                    {t} <span className="text-steel-light">✓</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </LayoutGroup>
      </Frame>
    </div>
  );
}
