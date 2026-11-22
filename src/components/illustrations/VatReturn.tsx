"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";

const boxes = [
  { box: "1", label: "VAT due on sales", value: 28640 },
  { box: "4", label: "VAT reclaimed on purchases", value: 11305 },
  { box: "5", label: "Net VAT to pay", value: 17335 },
  { box: "6", label: "Total sales (ex VAT)", value: 143200 },
  { box: "7", label: "Total purchases (ex VAT)", value: 56525 },
];

/** VAT boxes fill from reconciled records, then the return is submitted under MTD. */
export function VatReturn() {
  const { ref, step, reduce } = useLoopStep(boxes.length + 1, 800);
  const filled = Math.min(step, boxes.length);
  const submitted = step > boxes.length;

  return (
    <div ref={ref} role="img" aria-label="Illustration: a quarterly VAT return's boxes fill in from reconciled records and the return is submitted to HMRC through Making Tax Digital software." className="select-none">
      <Frame label="VAT return · Jan–Mar" status={<Chip tone={submitted ? "positive" : "info"}>{submitted ? "Submitted" : "Preparing"}</Chip>}>
        <ul className="space-y-1.5">
          {boxes.map((b, i) => (
            <li key={b.box} className={`flex items-center gap-3 rounded-xs px-3 py-2 text-[12px] ${b.box === "5" ? "bg-mist" : "bg-cream/70"}`}>
              <span className="tabular flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-medium text-navy">{b.box}</span>
              <span className="min-w-0 flex-1 truncate text-ink">{b.label}</span>
              <motion.span
                className="tabular text-ink"
                initial={false}
                animate={{ opacity: i < filled ? 1 : 0.25 }}
                transition={{ duration: reduce ? 0 : 0.4 }}
              >
                {i < filled ? gbp0(b.value) : "£—"}
              </motion.span>
            </li>
          ))}
        </ul>
        <motion.div
          initial={false}
          animate={{ opacity: submitted ? 1 : 0.35 }}
          className="mt-3 flex items-center justify-between rounded-card bg-navy px-4 py-3 text-cream"
        >
          <span className="text-[12px]">Submitted to HMRC via MTD</span>
          <span className="flex items-center gap-1 text-[12px] text-steel-light">
            {submitted ? <><Check className="size-3.5" aria-hidden /> Receipt saved</> : "Waiting"}
          </span>
        </motion.div>
      </Frame>
    </div>
  );
}
