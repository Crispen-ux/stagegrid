import Link from "next/link";

const nodes = [
  "CRM", "Quotes", "Event Builder", "Inventory", "Asset Tracking",
  "Crew", "Logistics", "Pricing", "Maintenance", "Billing", "Analytics", "AI",
];

export function OSArchitecture() {
  return (
    <div>
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">
        Coming to STAGEGRID OS
      </div>
      <h2 className="mb-3 font-display text-lg font-bold">The next generation of event infrastructure.</h2>
      <p className="mb-8 max-w-[560px] text-[13.5px] leading-relaxed text-text-dim">
        STAGEGRID OS will eventually connect every part of the business — from first quote to final billing —
        into one operating platform. This is a conceptual architecture view, not a live system.
      </p>

      <div className="rounded border border-border bg-surface p-8">
        <div className="mb-6 flex justify-center">
          <div className="rounded border border-accent bg-accent-dim px-6 py-3 font-display text-sm font-bold text-accent">
            STAGEGRID OS
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {nodes.map((n) => (
            <div
              key={n}
              className="rounded border border-border bg-bg px-3 py-3 text-center text-[12.5px] text-text-dim"
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-text-faint">
        Dynamic pricing, predictive maintenance and AI-assisted configuration are planned capabilities — not
        currently live features of this prototype.
      </p>
      <Link href="/pricing" className="mt-3 inline-block text-[12px] font-semibold text-accent hover:underline">
        Read about Dynamic Pricing →
      </Link>
    </div>
  );
}
