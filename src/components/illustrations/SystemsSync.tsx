"use client";

import { motion } from "motion/react";
import { Chip, Frame, useLoopStep } from "./shared";

const apps = [
  { name: "Bank feeds", x: 18, y: 18 },
  { name: "Invoicing", x: 82, y: 18 },
  { name: "Payroll", x: 10, y: 62 },
  { name: "Payments", x: 90, y: 62 },
  { name: "Receipts", x: 50, y: 92 },
];
const centre = { x: 50, y: 48 };

/** Connected apps send data into the accounting ledger; links light up as they sync. */
export function SystemsSync() {
  const { ref, step, reduce } = useLoopStep(apps.length, 800);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration: bank feeds, invoicing, payroll, payments and receipt capture connect to the accounting software and sync automatically."
      className="select-none"
    >
      <Frame label="Accounting systems" status={<Chip tone={step === apps.length ? "positive" : "info"}>{step}/{apps.length} connected</Chip>}>
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
            {apps.map((a, i) => (
              <line
                key={a.name}
                x1={a.x}
                y1={a.y}
                x2={centre.x}
                y2={centre.y}
                stroke={i < step ? "var(--color-steel)" : "var(--color-oat)"}
                strokeWidth={0.8}
                strokeDasharray={i < step ? "0" : "2 2"}
                vectorEffect="non-scaling-stroke"
                style={{ transition: "stroke 0.5s" }}
              />
            ))}
          </svg>
          {!reduce &&
            apps.map((a, i) =>
              i < step ? (
                <motion.span
                  key={`dot-${a.name}`}
                  aria-hidden
                  className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel"
                  initial={{ left: `${a.x}%`, top: `${a.y}%`, opacity: 0 }}
                  animate={{ left: [`${a.x}%`, `${centre.x}%`], top: [`${a.y}%`, `${centre.y}%`], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                />
              ) : null,
            )}
          {apps.map((a, i) => (
            <div
              key={a.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium shadow-sm transition-colors duration-500 ${
                i < step ? "border-steel/40 bg-white text-ink" : "border-hairline bg-cream text-muted"
              }`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
            >
              {a.name}
            </div>
          ))}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-card bg-navy px-4 py-3 text-center text-cream shadow-float"
            style={{ left: `${centre.x}%`, top: `${centre.y}%` }}
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-cream/60">Your ledger</p>
            <p className="font-display text-lg">Xero · QuickBooks</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}
