"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const initial: FormState = { name: "", email: "", phone: "", company: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.message.trim()) next.message = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // No backend in this prototype — this simulates a successful submission.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded border border-ok/40 bg-ok/10 p-7">
        <h3 className="text-lg font-semibold text-ok">Message sent</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-text-dim">
          Thanks, {form.name.split(" ")[0]} — a STAGEGRID technical specialist will get back to you shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setForm(initial);
            setSubmitted(false);
          }}
          className="mt-5"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
        <Field label="Company" value={form.company} onChange={(v) => set("company", v)} optional />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
        <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} optional />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">Message</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`w-full rounded border bg-bg px-3 py-2.5 text-sm outline-none ${
            errors.message ? "border-warn" : "border-border focus:border-accent"
          }`}
        />
        {errors.message && <p className="mt-1.5 text-[12px] text-warn">{errors.message}</p>}
      </div>
      <Button type="submit" className="self-start" size="lg">
        Send Message
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
