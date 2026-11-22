"use client";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import type { Estimate } from "@/lib/pricing/registry";
import { cn } from "@/lib/utils";

const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

function AnimatedAmount({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = gbp(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = gbp(Number.isInteger(value) ? Math.round(v) : Math.round(v * 100) / 100);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return (
    <span ref={ref} className={className}>
      {gbp(value)}
    </span>
  );
}

const amountText = (a: number | string) => (typeof a === "number" ? (a < 0 ? `−${gbp(-a)}` : `${gbp(a)}`) : a);

export function EstimatePanel({ estimate, className }: { estimate: Estimate; className?: string }) {
  const { monthly, oneOff, monthlyRange, lines, notes, comparison } = estimate;
  const empty = !monthly && !oneOff && !monthlyRange;
  return (
    <div className={cn("overflow-hidden rounded-panel bg-navy text-cream shadow-float", className)}>
      <div className="p-6 sm:p-8" aria-live="polite">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">Your indicative estimate</p>
        {empty ? (
          <p className="mt-4 font-display text-2xl text-cream/80">Choose your options to see a price.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {(monthly || monthlyRange) && (
              <div>
                <p className="text-sm text-cream/60">Monthly</p>
                <p className="tabular mt-1 font-display text-4xl leading-none text-cream sm:text-5xl">
                  {monthlyRange ? (
                    `${gbp(monthlyRange[0])}–${gbp(monthlyRange[1])}`
                  ) : (
                    <AnimatedAmount value={monthly as number} />
                  )}
                </p>
              </div>
            )}
            {oneOff ? (
              <div>
                <p className="text-sm text-cream/60">One-off</p>
                <p className="tabular mt-1 font-display text-4xl leading-none text-cream sm:text-5xl">
                  <AnimatedAmount value={oneOff} />
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {lines.length > 0 && (
        <div className="border-t border-cream/10 bg-navy-deep/60 px-6 py-5 sm:px-8">
          <ul className="space-y-2.5 text-sm">
            {lines.map((l, i) => (
              <li key={`${l.label}-${i}`} className="flex items-baseline justify-between gap-4">
                <span className="text-cream/85">
                  {l.label}
                  {l.note && <span className="ml-1.5 text-cream/50">{l.note}</span>}
                </span>
                <span className="tabular shrink-0 text-cream">
                  {amountText(l.amount)}
                  <span className="ml-1 text-xs text-cream/50">{l.period === "monthly" ? "/mo" : "one-off"}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {comparison && (
        <div className="border-t border-cream/10 px-6 py-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">Compared with hiring</p>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-cream/60">Employing people</dt>
              <dd className="tabular mt-1 font-display text-2xl">{gbp(comparison.hiringAnnual)}<span className="text-sm text-cream/50"> /yr</span></dd>
            </div>
            <div>
              <dt className="text-cream/60">Reckonwell</dt>
              <dd className="tabular mt-1 font-display text-2xl">{gbp(comparison.reckonwellAnnual)}<span className="text-sm text-cream/50"> /yr</span></dd>
            </div>
          </dl>
          {comparison.annualSavings > 0 && (
            <p className="mt-4 rounded-xs bg-positive/25 px-3 py-2 text-sm text-cream">
              Potential saving of <strong className="tabular">{gbp(comparison.annualSavings)}</strong> a year
            </p>
          )}
          <ul className="mt-3 space-y-1 text-xs text-cream/55">
            {comparison.roles.map((r) => (
              <li key={r.name}>
                {r.name}: {gbp(r.annual)} a year
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-cream/10 px-6 py-4 text-xs leading-relaxed text-cream/60 sm:px-8">
        {notes.map((n) => (
          <p key={n} className="mt-1 first:mt-0">
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}
