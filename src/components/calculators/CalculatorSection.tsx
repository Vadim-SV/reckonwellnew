"use client";

import { useMemo, useState } from "react";
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
          <EstimatePanel estimate={result} className="lg:sticky lg:top-28" />
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
