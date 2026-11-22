import { Check } from "lucide-react";
import type { ScopeSummary } from "@/lib/scoping/registry";
import { cn } from "@/lib/utils";

export function ScopePanel({ summary, className }: { summary: ScopeSummary; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-panel bg-navy text-cream shadow-float", className)}>
      <div className="p-6 sm:p-8" aria-live="polite">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">Your requirements</p>
        <p className="mt-4 font-display text-2xl leading-snug text-cream sm:text-3xl">{summary.headline}</p>
      </div>
      <div className="border-t border-cream/10 bg-navy-deep/60 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">What we&apos;d look after</p>
        <ul className="mt-3 space-y-2.5 text-sm">
          {summary.focus.map((f) => (
            <li key={f} className="flex gap-2.5 text-cream/90">
              <Check className="mt-0.5 size-4 shrink-0 text-steel-light" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-cream/10 px-6 py-4 sm:px-8">
        <p className="inline-flex rounded-full bg-cream/10 px-3 py-1 text-xs font-medium tracking-wide text-cream">Tailored quote</p>
        <p className="mt-2 text-xs leading-relaxed text-cream/60">{summary.pricingNote}</p>
      </div>
    </div>
  );
}
