import Link from "next/link";
import { solutions } from "@/data/solutions";
import { RevealOnScroll } from "./RevealOnScroll";

const capabilities = [
  "Professional PA Systems",
  "Modular Trussing",
  "Staging & Risers",
  "Architectural Lighting",
  "Event AV",
  "Delivery & Crew",
  "Asset Tracking",
];

export function TrustStrip() {
  return (
    <section className="border-b border-border py-14">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-9 text-center text-[22px] font-semibold text-text-dim">
          Built for events where failure isn&apos;t an option.
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {capabilities.map((c) => (
            <span key={c} className="rounded border border-border px-4 py-2.5 text-[13px] text-text-dim">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionsGrid() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-11 max-w-[600px]">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Solutions</div>
          <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-tight">
            Six disciplines. One infrastructure system.
          </h2>
        </div>
        <RevealOnScroll className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
          {solutions.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="bg-bg p-7 transition-colors hover:bg-surface"
            >
              <div className="font-display text-xs text-text-faint">{s.num}</div>
              <h3 className="mt-3.5 text-[19px] font-semibold">{s.name}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-text-dim">{s.summary}</p>
              <div className="mt-4.5 text-xs font-semibold text-accent">Explore {s.name} →</div>
            </Link>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
