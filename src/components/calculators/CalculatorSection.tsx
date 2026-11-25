"use client";

import { useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { estimate as computeEstimate, type CalculatorInputs, type CalculatorKey } from "@/lib/pricing/registry";
import { EstimatePanel } from "./EstimatePanel";
import { calculatorDefaults, calculatorForms } from "./forms";

type Props<K extends CalculatorKey> = {
  calculator: K;
  source: string;
  title: string;
  intro: string;
  formTitle?: string;
  formIntro?: string;
};

/**
 * Calculator (inputs + live estimate) followed by the enquiry form. The form
 * sends the calculator inputs, and the server recalculates the estimate.
 */
export function CalculatorSection<K extends CalculatorKey>({
  calculator,
  source,
  title,
  intro,
  formTitle = "Like the look of this? Let's talk.",
  formIntro = "Send us your details and we'll email you a copy of this estimate, then get in touch to confirm the details.",
}: Props<K>) {
  const [inputs, setInputs] = useState<CalculatorInputs<K>>(calculatorDefaults[calculator]);
  const result = useMemo(() => computeEstimate(calculator, inputs), [calculator, inputs]);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelVisible = useInView(panelRef, { amount: 0.25 });
  const gbp = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
  const summary = [result.monthly ? `${gbp(result.monthly)}/mo` : "", result.oneOff ? `${gbp(result.oneOff)} one-off` : ""]
    .filter(Boolean)
    .join(" + ");
  const Form = calculatorForms[calculator] as React.ComponentType<{
    value: CalculatorInputs<K>;
    set: (patch: Partial<CalculatorInputs<K>>) => void;
  }>;

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-24 bg-sand py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Price calculator</Eyebrow>
          <h2 id="calculator-title" className="mt-4 text-4xl sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg">{intro}</p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-8">
            <Form value={inputs} set={(patch) => setInputs((v) => ({ ...v, ...patch }))} />
          </div>
          {/* Phones: compact live price that stays in view while adjusting the inputs. */}
          <div
            aria-hidden={panelVisible}
            className={`sticky bottom-3 z-20 -mt-4 transition-opacity duration-300 lg:hidden ${panelVisible ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <a
              href="#estimate"
              tabIndex={panelVisible ? -1 : 0}
              className="flex min-h-14 items-center justify-between gap-3 rounded-full bg-navy px-5 py-2 text-cream shadow-float"
            >
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.14em] text-cream/60">Your estimate</span>
                <span className="tabular block truncate font-display text-lg">{summary || "Choose your options"}</span>
              </span>
              <span className="shrink-0 text-sm text-cream/80 underline underline-offset-4">Details</span>
            </a>
          </div>
          <div ref={panelRef} id="estimate" className="scroll-mt-24 lg:sticky lg:top-28">
            <EstimatePanel estimate={result} />
          </div>
        </div>

        <div id="get-in-touch" className="mt-16 scroll-mt-24 rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-10">
          <div className="max-w-2xl">
            <h3 className="text-3xl">{formTitle}</h3>
            <p className="mt-3 text-body">{formIntro}</p>
          </div>
          <div className="mt-8">
            <EnquiryForm
              source={source}
              calculator={{ key: calculator, inputs: inputs as Record<string, unknown> }}
              submitLabel="Send my estimate & get in touch"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
