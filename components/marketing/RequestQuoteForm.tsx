"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface FormState {
  eventType: string;
  guestCount: string;
  eventDate: string;
  venue: string;
  name: string;
  email: string;
  notes: string;
}

const initial: FormState = {
  eventType: "corporate",
  guestCount: "",
  eventDate: "",
  venue: "",
  name: "",
  email: "",
  notes: "",
};

function reference() {
  return "SG-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function RequestQuoteForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [ref, setRef] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.guestCount || Number(form.guestCount) <= 0) next.guestCount = "Please enter an expected guest count.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setRef(reference());
  }

  if (ref) {
    return (
      <div className="rounded border border-ok/40 bg-ok/10 p-7">
        <h3 className="text-lg font-semibold text-ok">Quote request received</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-text-dim">
          Reference <span className="font-semibold text-text">{ref}</span>. A STAGEGRID technical specialist
          will review your requirements and follow up with an indicative technical quote.
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-text-faint">
          Want a live configuration instead of waiting? Use the Event Builder for an instant indicative
          estimate.
        </p>
        <Button asChild className="mt-4">
          <Link href="/event-builder">Open Event Builder</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">
            Event Type
          </label>
          <Select value={form.eventType} onValueChange={(v) => set("eventType", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corporate">Corporate Event</SelectItem>
              <SelectItem value="activation">Brand Activation</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="festival">Festival / Live Music</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field
          label="Expected Guest Count"
          type="number"
          value={form.guestCount}
          onChange={(v) => set("guestCount", v)}
          error={errors.guestCount}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Event Date" type="date" value={form.eventDate} onChange={(v) => set("eventDate", v)} optional />
        <Field label="Venue / Region" value={form.venue} onChange={(v) => set("venue", v)} optional />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">
          Notes <span className="normal-case text-text-faint">(optional)</span>
        </label>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="w-full rounded border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <Button type="submit" className="self-start" size="lg">
        Request Technical Quote
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">
        {label} {optional && <span className="normal-case text-text-faint">(optional)</span>}
      </label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} invalid={!!error} />
      {error && <p className="mt-1.5 text-[12px] text-warn">{error}</p>}
    </div>
  );
}
