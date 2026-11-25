"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-2 w-full min-w-0 rounded-xs border bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-navy";

type Common = { label: string; error?: string; optional?: boolean };

function Label({ htmlFor, label, optional }: { htmlFor: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {label}
      {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-negative">
      {error}
    </p>
  );
}

export function TextField({
  label,
  error,
  optional,
  className,
  ...props
}: Common & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} />
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputClass, "h-12", error ? "border-negative" : "border-hairline")}
        {...props}
      />
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

export function TextArea({
  label,
  error,
  optional,
  className,
  ...props
}: Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} />
      <textarea
        id={id}
        rows={4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputClass, "py-3", error ? "border-negative" : "border-hairline")}
        {...props}
      />
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

export function SelectField({
  label,
  error,
  optional,
  className,
  options,
  placeholder,
  ...props
}: Common & React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder: string }) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} />
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputClass, "h-12", error ? "border-negative" : "border-hairline")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

export function Consent({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          className="mt-1 size-4 shrink-0 accent-navy"
        />
        <label htmlFor={id} className="text-sm text-body">
          I&apos;m happy for Reckonwell to contact me about this enquiry. We&apos;ll only use your details to reply, as set
          out in our{" "}
          <a href="/privacy-policy" className="text-steel underline underline-offset-2">
            privacy policy
          </a>
          .
        </label>
      </div>
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

/** Hidden from people, tempting to bots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
