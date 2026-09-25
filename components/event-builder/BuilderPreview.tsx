"use client";

import { useState } from "react";
import Link from "next/link";
import { defaultConfiguration, calculateRecommendedPackage } from "@/lib/calculations";
import type { EventConfiguration, Environment } from "@/types";
import { Schematic } from "./Schematic";
import { RecommendationPanel } from "./RecommendationPanel";

export function BuilderPreview() {
  const [config, setConfig] = useState<EventConfiguration>(defaultConfiguration);
  const pkg = calculateRecommendedPackage(config);

  function set<K extends keyof EventConfiguration>(key: K, value: EventConfiguration[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  return (
    <section className="border-b border-border py-20" id="builder-preview">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-11 max-w-[600px]">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Signature Feature</div>
          <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-tight">
            Build your event.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-text-dim">
            Tell STAGEGRID what you&apos;re planning — we&apos;ll translate it into an indicative technical
            infrastructure package in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded border border-border md:grid-cols-2">
          <div className="border-b border-border bg-surface p-8 md:border-b-0 md:border-r">
            <Field label="Event Type">
              <select
                className="w-full rounded border border-border bg-bg px-3 py-2.5 text-sm"
                value={config.eventType}
                onChange={(e) => set("eventType", e.target.value as EventConfiguration["eventType"])}
              >
                <option value="corporate">Corporate Event</option>
                <option value="activation">Brand Activation</option>
                <option value="conference">Conference</option>
                <option value="festival">Festival / Live Music</option>
              </select>
            </Field>

            <Field label={`Guest Count — ${config.guestCount}`}>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={config.guestCount}
                onChange={(e) => set("guestCount", Number(e.target.value))}
                className="w-full"
              />
            </Field>

            <Field label="Environment">
              <ChipRow<Environment>
                options={[
                  { value: "indoor", label: "Indoor" },
                  { value: "outdoor", label: "Outdoor" },
                ]}
                value={config.environment}
                onChange={(v) => set("environment", v)}
              />
            </Field>

            <Field label="Stage Required">
              <ChipRow<boolean>
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={config.stageRequired}
                onChange={(v) => set("stageRequired", v)}
              />
            </Field>
          </div>

          <div className="flex flex-col bg-surface2 p-8">
            <Schematic config={config} />
            <div className="mt-5">
              <RecommendationPanel pkg={pkg} compact />
            </div>
            <Link href="/event-builder" className="btn btn-primary mt-5 self-start px-6 py-3.5 text-sm">
              Open Full Event Builder
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-faint">{label}</label>
      {children}
    </div>
  );
}

function ChipRow<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={`chip ${o.value === value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
