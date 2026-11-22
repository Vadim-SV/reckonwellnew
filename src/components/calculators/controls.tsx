"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
  as = "div",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  as?: "div" | "fieldset";
}) {
  if (as === "fieldset") {
    return (
      <fieldset className="min-w-0">
        <legend className="text-[15px] font-medium text-ink">{label}</legend>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
        <div className="mt-3">{children}</div>
      </fieldset>
    );
  }
  return (
    <div className="min-w-0">
      <p className="text-[15px] font-medium text-ink">{label}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

type Option<T extends string> = { value: T; label: string; sub?: string };

/** Accessible single-choice group rendered as selectable cards. */
export function Choice<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  columns = 2,
}: {
  label: string;
  hint?: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const name = useId();
  return (
    <Field label={label} hint={hint} as="fieldset">
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-xs border bg-white px-4 py-3 transition-colors",
                checked ? "border-navy bg-mist/60 shadow-[inset_0_0_0_1px_var(--color-navy)]" : "border-hairline hover:border-navy/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-ink">{o.label}</span>
              {o.sub && <span className="mt-0.5 text-xs text-muted">{o.sub}</span>}
            </label>
          );
        })}
      </div>
    </Field>
  );
}

export function YesNo({
  label,
  hint,
  value,
  onChange,
  yes = "Yes",
  no = "No",
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  yes?: string;
  no?: string;
}) {
  return (
    <Choice
      label={label}
      hint={hint}
      value={value ? "yes" : "no"}
      onChange={(v) => onChange(v === "yes")}
      options={[
        { value: "yes", label: yes },
        { value: "no", label: no },
      ]}
    />
  );
}

/** On/off switch for optional add-ons. */
export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline py-3 last:border-b-0">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-[15px] text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-sm text-muted">{hint}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-navy" : "bg-oat",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 100_000,
  step = 1,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium text-ink">
        {label}
      </label>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-3 flex items-stretch">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(clamp(value - step))}
          className="flex w-11 items-center justify-center rounded-l-xs border border-hairline bg-white text-navy hover:bg-mist"
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <div className="relative flex-1">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
            className="tabular h-11 w-full border-y border-hairline bg-white px-3 text-center text-ink outline-none focus:border-navy"
          />
          {suffix && (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted">{suffix}</span>
          )}
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(clamp(value + step))}
          className="flex w-11 items-center justify-center rounded-r-xs border border-hairline bg-white text-navy hover:bg-mist"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function RangeField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="tabular font-display text-2xl text-navy">
          {format(value)}
        </output>
      </div>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-navy"
        style={{ background: `linear-gradient(to right, var(--color-navy) ${pct}%, var(--color-oat) ${pct}%)` }}
      />
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export const compactGBP = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}m` : n >= 1_000 ? `£${Math.round(n / 1_000)}k` : `£${n}`;

/** Accessible multi-select rendered as selectable chips. */
export function CheckboxGroup<T extends string>({
  label,
  hint,
  values,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  values: T[];
  options: { value: T; label: string }[];
  onChange: (v: T[]) => void;
}) {
  return (
    <Field label={label} hint={hint} as="fieldset">
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = values.includes(o.value);
          return (
            <label
              key={o.value}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                checked ? "border-navy bg-navy text-cream" : "border-hairline bg-white text-ink hover:border-navy/40",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onChange(checked ? values.filter((v) => v !== o.value) : [...values, o.value])}
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </Field>
  );
}
