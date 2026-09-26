"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "signin" | "request";

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | null;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[12px] text-warn">{error}</p>}
    </div>
  );
}

export function PortalLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailLooksValid = /^\S+@\S+\.\S+$/.test(email);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setFieldErrors({});
    setNotice(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const endpoint = mode === "signin" ? "/api/portal-session" : "/api/access-requests";
      const payload =
        mode === "signin"
          ? { email, password }
          : { name, email, password, company: company || undefined };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFieldErrors(data.errors ?? {});
        setError(data.error ?? null);
        setSubmitting(false);
        return;
      }
      if (mode === "request") {
        switchMode("signin");
        setNotice("Request received. A STAGEGRID admin activates your account from the portal, then you sign in here.");
        setSubmitting(false);
        return;
      }
      router.replace("/portal");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  if (mode === "signin") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Email" error={fieldErrors.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!fieldErrors.email}
            autoFocus
            placeholder="you@company.co.za"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={fieldErrors.password}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!fieldErrors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
        {(error || notice) && (
          <p className={`text-[12.5px] ${error ? "text-warn" : "text-ok"}`}>{error ?? notice}</p>
        )}
        <Button
          type="submit"
          size="lg"
          className="self-start"
          disabled={submitting || !emailLooksValid || !password}
        >
          {submitting ? "Checking…" : "Enter Portal"}
        </Button>
        <button
          type="button"
          onClick={() => switchMode("request")}
          className="self-start text-left text-[12.5px] text-text-faint underline underline-offset-4 hover:text-text-dim"
        >
          Need portal access? Request an account
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Your name" error={fieldErrors.name}>
        <Input value={name} onChange={(e) => setName(e.target.value)} invalid={!!fieldErrors.name} autoFocus placeholder="Thandi Mokoena" />
      </Field>
      <Field label="Company (optional)" error={fieldErrors.company}>
        <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Mokoena Events" />
      </Field>
      <Field label="Email" error={fieldErrors.email}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={!!fieldErrors.email}
          placeholder="you@company.co.za"
          autoComplete="email"
        />
      </Field>
      <Field label="Choose a password (8+ characters)" error={fieldErrors.password}>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          invalid={!!fieldErrors.password}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </Field>
      {error && <p className="text-[12.5px] text-warn">{error}</p>}
      <Button
        type="submit"
        size="lg"
        className="self-start"
        disabled={submitting || !name || !emailLooksValid || password.length < 8}
      >
        {submitting ? "Sending…" : "Request Access"}
      </Button>
      <button
        type="button"
        onClick={() => switchMode("signin")}
        className="self-start text-left text-[12.5px] text-text-faint underline underline-offset-4 hover:text-text-dim"
      >
        Already have access? Sign in
      </button>
    </form>
  );
}
