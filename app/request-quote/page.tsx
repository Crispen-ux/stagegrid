import type { Metadata } from "next";
import { RequestQuoteForm } from "@/components/marketing/RequestQuoteForm";

export const metadata: Metadata = {
  title: "Request a Technical Quote — STAGEGRID",
  description: "Request an indicative technical quote for your event's infrastructure requirements.",
};

export default function RequestQuotePage() {
  return (
    <main className="mx-auto max-w-[800px] px-6 py-20">
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Request a Quote</div>
      <h1 className="font-display text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.1] tracking-tight">
        Get an indicative technical quote.
      </h1>
      <p className="mt-4 max-w-[520px] text-base leading-relaxed text-text-dim">
        Share the basics and a STAGEGRID technical specialist will follow up — or configure your event live in
        the Event Builder for an instant estimate.
      </p>
      <div className="mt-10">
        <RequestQuoteForm />
      </div>
    </main>
  );
}
