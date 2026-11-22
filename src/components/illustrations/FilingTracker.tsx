"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Chip, Frame, useLoopStep } from "./shared";

export type FilingItem = { label: string; meta: string };

/** A deadline tracker: each step completes in turn, ending well before the due date. */
export function FilingTracker({ title, items, doneLabel }: { title: string; items: FilingItem[]; doneLabel: string }) {
  const { ref, step, reduce } = useLoopStep(items.length, 900);
  const done = step >= items.length;

  return (
    <div ref={ref} role="img" aria-label={`Illustration: ${title} — ${items.map((i) => i.label).join(", ")} — completed in order before the deadline.`} className="select-none">
      <Frame label={title} status={<Chip tone={done ? "positive" : "info"}>{done ? doneLabel : "In progress"}</Chip>}>
        <ol className="relative space-y-3 pl-1">
          <span aria-hidden className="absolute top-2 bottom-2 left-[13px] w-px bg-oat" />
          <motion.span
            aria-hidden
            className="absolute top-2 bottom-2 left-[13px] w-px origin-top bg-positive"
            initial={false}
            animate={{ scaleY: Math.min(step, items.length - 1) / Math.max(1, items.length - 1) }}
            transition={{ duration: reduce ? 0 : 0.6 }}
          />
          {items.map((it, i) => {
            const ok = i < step;
            const current = i === step;
            return (
              <li key={it.label} className="relative flex items-start gap-3">
                <span
                  className={`relative z-10 flex size-[26px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    ok ? "border-positive bg-positive text-white" : current ? "border-navy bg-white" : "border-oat bg-white"
                  }`}
                >
                  {ok && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                </span>
                <span className="pt-0.5">
                  <span className={`block text-[13px] ${ok || current ? "text-ink" : "text-muted"}`}>{it.label}</span>
                  <span className="block text-[11px] text-muted">{it.meta}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Frame>
    </div>
  );
}
