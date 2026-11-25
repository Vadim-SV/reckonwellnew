"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Consent, Honeypot, SelectField, TextArea, TextField } from "@/components/forms/inputs";
import { track } from "@/lib/analytics";
import { anyBookingSchema, enquiryTypes, fieldErrors } from "@/lib/forms/schemas";
import { cn } from "@/lib/utils";

type Slot = { start: string; end: string };
type Availability =
  | { mode: "live"; timeZone: string; durationMinutes: number; days: { date: string; slots: Slot[] }[] }
  | { mode: "request"; timeZone: string; durationMinutes: number; days: string[]; reason: string };

type Result =
  | { mode: "live"; reference: string; when: string; meetingLink?: string; emailed?: boolean }
  | { mode: "request"; reference: string; emailed?: boolean };

const uuid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const dayLabel = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const at = new Date(Date.UTC(y, m - 1, d, 12));
  return {
    weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "Europe/London" }).format(at),
    day: new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "Europe/London" }).format(at),
    month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Europe/London" }).format(at),
    long: new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" }).format(at).replace(",", ""),
  };
};
const timeLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/London" }).format(new Date(iso));

const empty = { name: "", email: "", phone: "", company: "", enquiryType: "", message: "" };

function DayChip({ date, selected, onClick }: { date: string; selected: boolean; onClick: () => void }) {
  const l = dayLabel(date);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={l.long}
      onClick={onClick}
      className={cn(
        "flex w-[4.5rem] shrink-0 flex-col items-center rounded-card border px-2 py-3 transition-colors",
        selected ? "border-navy bg-navy text-cream" : "border-hairline bg-white text-ink hover:border-navy/40",
      )}
    >
      <span className={cn("text-xs uppercase tracking-[0.12em]", selected ? "text-cream/70" : "text-muted")}>{l.weekday}</span>
      <span className="tabular font-display text-2xl leading-tight">{l.day}</span>
      <span className={cn("text-xs", selected ? "text-cream/70" : "text-muted")}>{l.month}</span>
    </button>
  );
}

export function BookingWidget() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [preferred, setPreferred] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<"Morning" | "Afternoon" | "Any time">("Any time");
  const [values, setValues] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(uuid);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/booking/availability", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Availability;
      setAvailability(data);
      if (data.mode === "live") setDate((d) => (d && data.days.some((x) => x.date === d) ? d : (data.days[0]?.date ?? "")));
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount; the state update happens after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const slots = useMemo(
    () => (availability?.mode === "live" ? (availability.days.find((d) => d.date === date)?.slots ?? []) : []),
    [availability, date],
  );

  const update = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!availability) return;
    const payload =
      availability.mode === "live"
        ? { mode: "live" as const, slotStart: slot, ...values, consent, website, idempotencyKey }
        : { mode: "request" as const, preferredDates: preferred, timeOfDay, ...values, consent, website, idempotencyKey };
    const parsed = anyBookingSchema.safeParse(payload);
    if (!parsed.success) {
      const f = fieldErrors(parsed.error);
      if (availability.mode === "live" && !slot) f.slotStart = "Please choose a time";
      setErrors(f);
      return;
    }
    setErrors({});
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        if (data.retry) {
          // The slot was taken or the booking failed: fresh key, fresh availability.
          setIdempotencyKey(uuid());
          setSlot("");
          await load();
        }
        if (data.fallback === "request") await load();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setResult(availability.mode === "live" ? { mode: "live", ...data } : { mode: "request", ...data });
      setStatus("done");
      track(availability.mode === "live" ? "booking_completed" : "booking_requested", { source: "book", mode: availability.mode });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done" && result) {
    return (
      <div role="status" className="rounded-panel border border-hairline bg-white p-8 text-center shadow-card sm:p-10">
        {result.mode === "live" ? (
          <>
            <CalendarCheck className="mx-auto size-11 text-positive" aria-hidden />
            <h2 className="mt-4 text-3xl">You&apos;re booked in.</h2>
            <p className="mt-3 text-lg text-ink">{result.when}</p>
            {result.meetingLink && (
              <p className="mt-2">
                <a href={result.meetingLink} className="text-steel underline underline-offset-4">
                  {result.meetingLink}
                </a>
              </p>
            )}
            <p className="mx-auto mt-4 max-w-md text-body">
              {result.emailed
                ? `A confirmation and calendar invitation are on their way to ${values.email}.`
                : `We'll email your confirmation to ${values.email}.`}
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto size-11 text-positive" aria-hidden />
            <h2 className="mt-4 text-3xl">Request received.</h2>
            <p className="mx-auto mt-3 max-w-md text-body">
              Your call isn&apos;t booked yet — we&apos;ll reply to {values.email} to confirm a time from the days you chose.
            </p>
          </>
        )}
        <p className="mt-4 text-sm text-muted">
          Your reference: <strong className="text-ink">{result.reference}</strong>
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-panel border border-hairline bg-white p-8 text-center">
        <p className="text-lg">We couldn&apos;t load available times.</p>
        <Button className="mt-4" onClick={() => void load()}>
          Try again
        </Button>
        <p className="mt-4 text-sm text-muted">Or call us on 020 3818 6205.</p>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="flex min-h-[20rem] items-center justify-center rounded-panel border border-hairline bg-white" aria-busy="true">
        <Loader2 className="size-6 animate-spin text-navy" aria-hidden />
        <span className="ml-3 text-muted">Loading available times…</span>
      </div>
    );
  }

  const isLive = availability.mode === "live";

  return (
    <form onSubmit={submit} noValidate className="relative space-y-8 rounded-panel border border-hairline bg-white p-6 shadow-card sm:p-8">
      {!isLive && (
        <div className="flex gap-3 rounded-card bg-mist px-4 py-3 text-[15px] text-ink">
          <Info className="mt-0.5 size-5 shrink-0 text-steel" aria-hidden />
          <p>
            <strong>Request a call.</strong> Choose up to three days that suit you and we&apos;ll reply by email to confirm a time.
            Your call isn&apos;t booked until we confirm it.
          </p>
        </div>
      )}

      {/* Step 1: day(s) */}
      <fieldset className="min-w-0">
        <legend className="text-[15px] font-medium text-ink">
          {isLive ? "1. Choose a day" : "1. Which days suit you? (up to three)"}
        </legend>
        <p className="mt-1 text-sm text-muted">All times are UK time. Calls last {availability.durationMinutes} minutes.</p>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
          {isLive
            ? availability.days.map((d) => (
                <DayChip key={d.date} date={d.date} selected={d.date === date} onClick={() => (setDate(d.date), setSlot(""))} />
              ))
            : availability.days.map((d) => (
                <DayChip
                  key={d}
                  date={d}
                  selected={preferred.includes(d)}
                  onClick={() =>
                    setPreferred((p) => (p.includes(d) ? p.filter((x) => x !== d) : p.length < 3 ? [...p, d] : p))
                  }
                />
              ))}
        </div>
        {isLive && availability.days.length === 0 && (
          <p className="mt-2 text-muted">There are no free times in the next three weeks. Please call us on 020 3818 6205.</p>
        )}
        {errors.preferredDates && <p className="mt-1.5 text-sm text-negative">{errors.preferredDates}</p>}
      </fieldset>

      {/* Step 2: time */}
      {isLive ? (
        <fieldset className="min-w-0">
          <legend className="text-[15px] font-medium text-ink">2. Choose a time</legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {slots.map((s) => (
              <button
                key={s.start}
                type="button"
                aria-pressed={slot === s.start}
                onClick={() => setSlot(s.start)}
                className={cn(
                  "tabular min-h-11 rounded-xs border text-sm transition-colors",
                  slot === s.start ? "border-navy bg-navy text-cream" : "border-hairline bg-white text-ink hover:border-navy/40",
                )}
              >
                {timeLabel(s.start)}
              </button>
            ))}
          </div>
          {errors.slotStart && <p className="mt-1.5 text-sm text-negative">{errors.slotStart}</p>}
        </fieldset>
      ) : (
        <fieldset className="min-w-0">
          <legend className="text-[15px] font-medium text-ink">2. What time of day?</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["Morning", "Afternoon", "Any time"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={timeOfDay === t}
                onClick={() => setTimeOfDay(t)}
                className={cn(
                  "min-h-11 rounded-xs border text-sm transition-colors",
                  timeOfDay === t ? "border-navy bg-navy text-cream" : "border-hairline bg-white text-ink hover:border-navy/40",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Step 3: details */}
      <fieldset className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        <legend className="mb-1 text-[15px] font-medium text-ink sm:col-span-2">3. Your details</legend>
        <TextField label="Your name" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
        <TextField label="Email address" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
        <TextField label="Phone" type="tel" autoComplete="tel" optional value={values.phone} onChange={update("phone")} error={errors.phone} />
        <TextField label="Company" autoComplete="organization" optional value={values.company} onChange={update("company")} error={errors.company} />
        <SelectField
          className="sm:col-span-2"
          label="What would you like to discuss?"
          placeholder="Choose one…"
          options={enquiryTypes}
          value={values.enquiryType}
          onChange={update("enquiryType")}
          error={errors.enquiryType}
        />
        <TextArea
          className="sm:col-span-2"
          label="Anything we should know before the call?"
          optional
          value={values.message}
          onChange={update("message")}
          error={errors.message}
        />
        <div className="sm:col-span-2">
          <Consent checked={consent} onChange={setConsent} error={errors.consent} />
        </div>
      </fieldset>
      <Honeypot value={website} onChange={setWebsite} />

      {status === "error" && (
        <p role="alert" className="text-sm text-negative">
          {message}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Booking…" : isLive ? "Confirm booking" : "Send request"}
        </Button>
        {isLive && slot && (
          <p className="text-sm text-muted">
            {dayLabel(date).long} at {timeLabel(slot)} (UK time)
          </p>
        )}
      </div>
    </form>
  );
}
