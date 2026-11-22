"use client";

import { Check } from "lucide-react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const staff = [
  { name: "A. Patel", net: 2840 },
  { name: "J. Okafor", net: 2315 },
  { name: "S. Murray", net: 3120 },
  { name: "L. Chen", net: 2690 },
  { name: "R. Davies", net: 2475 },
];

/** A pay run: payslips produced one by one, then RTI and pension submissions. */
export function PayrollRun() {
  const total = staff.length + 2;
  const { ref, step } = useLoopStep(total, 800);
  const paid = Math.min(step, staff.length);
  const rti = step > staff.length;
  const pension = step > staff.length + 1;
  const netTotal = staff.slice(0, paid).reduce((s, e) => s + e.net, 0);

  return (
    <div ref={ref} role="img" aria-label="Illustration: a monthly pay run produces payslips for each employee, then the RTI submission to HMRC and the pension upload are completed." className="select-none">
      <Frame label="Pay run · 28 March" status={<Chip tone={pension ? "positive" : "info"}>{pension ? "Complete" : "Running"}</Chip>}>
        <ul className="space-y-1.5">
          {staff.map((e, i) => (
            <li key={e.name} className="flex items-center gap-3 rounded-xs bg-cream/70 px-3 py-2 text-[12px]">
              <span className="min-w-0 flex-1 text-ink">{e.name}</span>
              <span className="tabular text-ink">{gbp0(e.net)}</span>
              <span className="w-20 text-right">
                {i < paid ? <Chip tone="positive">Payslip</Chip> : <Chip tone="neutral">Pending</Chip>}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-card bg-navy p-3 text-cream">
          <div>
            <p className="text-[10px] text-cream/60">Net pay</p>
            <p className="tabular font-display text-lg">{gbp0(netTotal)}</p>
          </div>
          <div>
            <p className="text-[10px] text-cream/60">RTI to HMRC</p>
            <p className="flex items-center gap-1 text-[12px]">{rti ? <><Check className="size-3.5 text-steel-light" aria-hidden /> Sent</> : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-cream/60">Pension</p>
            <p className="flex items-center gap-1 text-[12px]">{pension ? <><Check className="size-3.5 text-steel-light" aria-hidden /> Uploaded</> : "—"}</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}
