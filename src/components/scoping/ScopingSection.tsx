"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { scope, type ScopingInputs, type ScopingKey } from "@/lib/scoping/registry";
import { ScopePanel } from "./ScopePanel";
import { scopingDefaults, scopingForms } from "./forms";

type Props<K extends ScopingKey> = {
  tool: K;
  source: string;
  title: string;
  intro: string;
  formTitle?: string;
  formIntro?: string;
  submitLabel?: string;
};

/**
 * Requirements tool (answers + live summary) followed by the enquiry form.
 * Used where there is no approved pricing — it never shows a price.
 */
export function ScopingSection<K extends ScopingKey>({
  tool,
  source,
  title,
  intro,
  formTitle = "Send us your requirements",
  formIntro = "We'll email you a copy of this summary and come back with a tailored quote after a short call.",
  submitLabel = "Send my requirements & get in touch",
}: Props<K>) {
  const [inputs, setInputs] = useState<ScopingInputs<K>>(scopingDefaults[tool]);
  const summary = useMemo(() => scope(tool, inputs), [tool, inputs]);
  const Form = scopingForms[tool] as React.ComponentType<{
    value: ScopingInputs<K>;
    set: (patch: Partial<ScopingInputs<K>>) => void;
  }>;

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-24 bg-sand py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Requirements tool</Eyebrow>
          <h2 id="calculator-title" className="mt-4 text-4xl sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg">{intro}</p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-8">
            <Form value={inputs} set={(patch) => setInputs((v) => ({ ...v, ...patch }))} />
          </div>
          <ScopePanel summary={summary} className="lg:sticky lg:top-28" />
        </div>

        <div id="get-in-touch" className="mt-16 scroll-mt-24 rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-10">
          <div className="max-w-2xl">
            <h3 className="text-3xl">{formTitle}</h3>
            <p className="mt-3 text-body">{formIntro}</p>
          </div>
          <div className="mt-8">
            <EnquiryForm source={source} calculator={{ key: tool, inputs: inputs as Record<string, unknown> }} submitLabel={submitLabel} />
          </div>
        </div>
      </Container>
    </section>
  );
}
