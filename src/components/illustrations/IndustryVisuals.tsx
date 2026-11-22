"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Industry } from "@/content/industries";
import { Chip, Frame, gbp0, useLoopStep } from "./shared";
import { ScrollDepth } from "./ScrollDepth";

const ease = [0.22, 1, 0.36, 1] as const;

/** Technology: recurring revenue builds month by month; deferred income released; runway tracked. */
function Technology() {
  const mrr = [31, 33.5, 35, 38, 40.5, 43, 45.8, 48.2];
  const { ref, step, reduce } = useLoopStep(mrr.length, 650);
  const shown = Math.max(1, step);
  return (
    <div ref={ref} role="img" aria-label="Illustration: monthly recurring revenue rises month by month, deferred income is released over time and cash runway is tracked." className="select-none">
      <Frame label="SaaS metrics · FY26" status={<Chip tone="positive">Runway 18 months</Chip>}>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] text-muted">Monthly recurring revenue</p>
            <p className="tabular font-display text-3xl text-navy">£{mrr[shown - 1].toFixed(1)}k</p>
          </div>
          <p className="text-[11px] text-positive">+{Math.round(((mrr[shown - 1] - mrr[0]) / mrr[0]) * 100)}% since April</p>
        </div>
        <div className="mt-3 flex h-28 items-end gap-1.5">
          {mrr.map((v, i) => (
            <motion.span
              key={i}
              className={i === shown - 1 ? "flex-1 rounded-t-[3px] bg-navy" : "flex-1 rounded-t-[3px] bg-steel-light"}
              initial={false}
              animate={{ height: i < shown ? `${(v / 50) * 100}%` : "4%" }}
              transition={{ duration: reduce ? 0 : 0.5, ease }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <div className="rounded-xs bg-cream/70 px-3 py-2">
            <p className="text-muted">Deferred income</p>
            <p className="tabular text-ink">£96,400</p>
          </div>
          <div className="rounded-xs bg-cream/70 px-3 py-2">
            <p className="text-muted">Released this month</p>
            <p className="tabular text-ink">£8,030</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/** E-commerce: each channel's payout is split into sales, fees and refunds, then reconciled. */
function Ecommerce() {
  const channels = [
    { name: "Shopify", sales: 42180, fees: -1265, refunds: -940 },
    { name: "Amazon", sales: 31560, fees: -4734, refunds: -1210 },
    { name: "Stripe", sales: 9840, fees: -246, refunds: 0 },
  ];
  const { ref, step } = useLoopStep(channels.length, 1200);
  return (
    <div ref={ref} role="img" aria-label="Illustration: payouts from Shopify, Amazon and Stripe are split into gross sales, platform fees and refunds, then reconciled to the bank." className="select-none">
      <Frame label="Channel payouts · March" status={<Chip tone={step >= channels.length ? "positive" : "info"}>{Math.min(step, channels.length)}/3 reconciled</Chip>}>
        <div className="space-y-2">
          {channels.map((c, i) => {
            const done = i < step;
            const payout = c.sales + c.fees + c.refunds;
            return (
              <div key={c.name} className={`rounded-card border p-3 transition-colors duration-500 ${done ? "border-positive/30 bg-positive-light/40" : "border-hairline bg-cream/60"}`}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="flex items-center gap-1 text-ink">
                    Payout <span className="tabular">{gbp0(payout)}</span>
                    {done && <Check className="size-3.5 text-positive" strokeWidth={3} aria-hidden />}
                  </span>
                </div>
                <motion.div initial={false} animate={{ opacity: done ? 1 : 0.35 }} className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <span className="text-muted">
                    Sales <span className="tabular block text-ink">{gbp0(c.sales)}</span>
                  </span>
                  <span className="text-muted">
                    Fees <span className="tabular block text-negative">{gbp0(c.fees)}</span>
                  </span>
                  <span className="text-muted">
                    Refunds <span className="tabular block text-negative">{c.refunds ? gbp0(c.refunds) : "£0"}</span>
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Frame>
    </div>
  );
}

/** Property: rent and costs reconciled for each SPV, rolling up to a portfolio view. */
function Property() {
  const spvs = [
    { name: "Elm Road SPV Ltd", rent: 6450, costs: 2310 },
    { name: "Harbour View SPV Ltd", rent: 9200, costs: 3875 },
    { name: "Mill Lane SPV Ltd", rent: 4800, costs: 1640 },
  ];
  const { ref, step } = useLoopStep(spvs.length + 1, 1100);
  const done = Math.min(step, spvs.length);
  const net = spvs.slice(0, done).reduce((s, p) => s + p.rent - p.costs, 0);
  return (
    <div ref={ref} role="img" aria-label="Illustration: rental income and costs are reconciled for three property companies and rolled up into a portfolio net income figure." className="select-none">
      <Frame label="Portfolio · March" status={<Chip tone={done === spvs.length ? "positive" : "info"}>{done}/3 SPVs closed</Chip>}>
        <ul className="space-y-2">
          {spvs.map((p, i) => (
            <li key={p.name} className="rounded-xs bg-cream/70 px-3 py-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{p.name}</span>
                {i < done ? <Chip tone="positive">Reconciled</Chip> : <Chip tone="neutral">Open</Chip>}
              </div>
              <div className="mt-1 flex gap-4 text-[11px] text-muted">
                <span>
                  Rent <span className="tabular text-positive">+{gbp0(p.rent)}</span>
                </span>
                <span>
                  Costs <span className="tabular text-negative">−{gbp0(p.costs)}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between rounded-card bg-navy px-4 py-3 text-cream">
          <span className="text-[11px] uppercase tracking-[0.12em] text-cream/60">Portfolio net income</span>
          <span className="tabular font-display text-xl">{gbp0(net)}</span>
        </div>
      </Frame>
    </div>
  );
}

/** Manufacturing: a product's cost builds from materials, labour and overheads to reveal the true margin. */
function Manufacturing() {
  const parts = [
    { label: "Materials", value: 41, colour: "bg-steel" },
    { label: "Direct labour", value: 18, colour: "bg-steel-light" },
    { label: "Production overheads", value: 12, colour: "bg-slate-blue" },
  ];
  const price = 96;
  const { ref, step, reduce } = useLoopStep(parts.length + 1, 1000);
  const shown = Math.min(step, parts.length);
  const cost = parts.slice(0, shown).reduce((s, p) => s + p.value, 0);
  const margin = Math.round(((price - cost) / price) * 100);
  return (
    <div ref={ref} role="img" aria-label="Illustration: the cost of a product builds up from materials, labour and production overheads, revealing its true margin against the selling price." className="select-none">
      <Frame label="Product costing · Unit A-220" status={<Chip tone={shown === parts.length ? "positive" : "info"}>{shown === parts.length ? `True margin ${margin}%` : "Costing"}</Chip>}>
        <div className="relative h-10 overflow-hidden rounded-xs bg-oat">
          <div className="flex h-full">
            {parts.map((p, i) => (
              <motion.span
                key={p.label}
                className={`h-full ${p.colour}`}
                initial={false}
                animate={{ width: i < shown ? `${(p.value / price) * 100}%` : "0%" }}
                transition={{ duration: reduce ? 0 : 0.7, ease }}
              />
            ))}
          </div>
          <span className="absolute inset-y-0 right-2 flex items-center text-[11px] text-ink">Price £{price}</span>
        </div>
        <ul className="mt-3 space-y-1.5 text-[12px]">
          {parts.map((p, i) => (
            <li key={p.label} className={`flex items-center justify-between rounded-xs px-3 py-1.5 ${i < shown ? "bg-cream/70 text-ink" : "text-muted"}`}>
              <span className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${p.colour}`} />
                {p.label}
              </span>
              <span className="tabular">£{p.value.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-card bg-navy p-3 text-cream">
          <div>
            <p className="text-[10px] text-cream/60">Full unit cost</p>
            <p className="tabular font-display text-xl">£{cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-cream/60">Margin per unit</p>
            <p className="tabular font-display text-xl">£{(price - cost).toFixed(2)}</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/** Hospitality: daily takings reconciled across the week, with food and labour costs in view. */
function Hospitality() {
  const days = [
    { d: "Mon", v: 2840 },
    { d: "Tue", v: 3120 },
    { d: "Wed", v: 3460 },
    { d: "Thu", v: 4210 },
    { d: "Fri", v: 6380 },
    { d: "Sat", v: 7150 },
    { d: "Sun", v: 5020 },
  ];
  const { ref, step, reduce } = useLoopStep(days.length, 550);
  const total = days.slice(0, step).reduce((s, x) => s + x.v, 0);
  return (
    <div ref={ref} role="img" aria-label="Illustration: daily takings for each day of the week are reconciled against card and cash records, with food and labour cost percentages shown." className="select-none">
      <Frame label="Takings · week 12" status={<Chip tone={step >= days.length ? "positive" : "info"}>{Math.min(step, days.length)}/7 days reconciled</Chip>}>
        <div className="flex h-28 items-end gap-2">
          {days.map((x, i) => (
            <div key={x.d} className="flex h-full flex-1 flex-col justify-end text-center">
              <motion.span
                className={`rounded-t-[3px] ${i < step ? "bg-navy" : "bg-oat"}`}
                initial={false}
                animate={{ height: `${(x.v / 7500) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.4 }}
              />
              <span className="mt-1 text-[10px] text-muted">{x.d}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
          <div className="rounded-xs bg-cream/70 px-3 py-2">
            <p className="text-muted">Takings</p>
            <p className="tabular text-ink">{gbp0(total)}</p>
          </div>
          <div className="rounded-xs bg-cream/70 px-3 py-2">
            <p className="text-muted">Food cost</p>
            <p className="tabular text-ink">29%</p>
          </div>
          <div className="rounded-xs bg-cream/70 px-3 py-2">
            <p className="text-muted">Labour</p>
            <p className="tabular text-ink">31%</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

const visuals: Record<Industry["slug"], () => React.ReactElement> = {
  technology: Technology,
  ecommerce: Ecommerce,
  property: Property,
  manufacturing: Manufacturing,
  hospitality: Hospitality,
};

export function IndustryVisual({ slug }: { slug: Industry["slug"] }) {
  const Visual = visuals[slug];
  return (
    <ScrollDepth>
      <Visual />
    </ScrollDepth>
  );
}
