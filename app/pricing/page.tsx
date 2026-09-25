import type { Metadata } from "next";
import Link from "next/link";
import { pricingFactors, sampleBreakdown } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dynamic Pricing — STAGEGRID",
  description: "How STAGEGRID OS will price event infrastructure — and how indicative pricing works today.",
};

const sampleTotal = sampleBreakdown.reduce((sum, r) => sum + r.amount, 0);

export default function PricingPage() {
  return (
    <main>
      <header className="border-b border-border py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Badge variant="accent" className="mb-3.5">
            Coming to STAGEGRID OS
          </Badge>
          <h1 className="max-w-[720px] font-display text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-tight">
            Intelligent pricing.
          </h1>
          <p className="mt-5 max-w-[600px] text-base leading-relaxed text-text-dim">
            Today, the Event Builder gives you a rules-based indicative estimate the moment you configure your
            event. STAGEGRID OS will extend this into a fuller dynamic pricing model that accounts for demand,
            timing and fleet-wide availability in real time. This page explains both — what&apos;s live today,
            and what&apos;s planned.
          </p>
        </div>
      </header>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-2 font-display text-2xl font-bold">What future pricing will consider</h2>
          <p className="mb-8 max-w-[560px] text-[14px] text-text-dim">
            None of these factors are live pricing inputs yet — the Event Builder&apos;s estimate today is a
            deterministic rules engine, not an AI or demand-based system. This is the roadmap.
          </p>
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {pricingFactors.map((f) => (
              <div key={f.label} className="bg-bg p-6">
                <h3 className="text-[14px] font-semibold">{f.label}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-text-dim">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-2 font-display text-2xl font-bold">A sample price breakdown</h2>
          <p className="mb-8 max-w-[560px] text-[14px] text-text-dim">
            Illustrative only, for a mid-size corporate configuration — not a live quote. Use the Event Builder
            for a real indicative estimate based on your own event.
          </p>
          <div className="max-w-[520px] rounded border border-border bg-surface p-6">
            {sampleBreakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-border py-3 text-[13.5px] last:border-b-0">
                <span className="text-text-dim">{row.label}</span>
                <span className="font-semibold">R{row.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold">Indicative Total</span>
              <span className="font-display text-xl font-bold text-accent">R{sampleTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded border border-border bg-surface p-9 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">Get your own indicative estimate today</h2>
              <p className="mt-2 max-w-[480px] text-[14px] text-text-dim">
                The Event Builder&apos;s rules-based engine is live right now — configure your event and see a real
                estimate in seconds.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/event-builder">Open Event Builder</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
