import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — STAGEGRID",
  description: "Why STAGEGRID exists, and how it brings event infrastructure together under one operating model.",
};

const principles = [
  { title: "One system, not six suppliers", description: "Sound, trussing, staging, lighting, AV and logistics are planned and deployed as a single coordinated build, not six separate bookings." },
  { title: "Indicative, then engineered", description: "Configurators give fast, honest estimates. Final technical sign-off always goes through qualified review — we never claim automated certification." },
  { title: "Technology in service of delivery", description: "Every tool we build — the Event Builder, asset tracking, logistics visibility — exists to make physical deployment more reliable, not to replace the crew on site." },
  { title: "Transparent by default", description: "Clients can see what's recommended, why, and what it costs — from first configuration through to delivery status on the day." },
];

export default function AboutPage() {
  return (
    <main>
      <header className="border-b border-border py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">About</div>
          <h1 className="max-w-[760px] font-display text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-tight">
            Event infrastructure, brought together.
          </h1>
        </div>
      </header>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[800px] px-6">
          <h2 className="mb-5 font-display text-2xl font-bold">The problem</h2>
          <p className="text-base leading-relaxed text-text-dim">
            Traditional event rental is fragmented. Clients are often left to coordinate sound, lighting, truss,
            staging, transport and crew across separate suppliers — each with their own quote, their own
            schedule, and their own point of failure. Nobody owns the whole picture, and the client absorbs the
            risk of anything falling between the cracks.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-dim">
            STAGEGRID brings that infrastructure together under one operating model, and progressively adds
            technology — configuration tools, asset tracking, logistics visibility — to make planning,
            deployment and equipment management more transparent for everyone involved.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Mission</div>
              <p className="text-lg leading-relaxed">
                Engineer the infrastructure behind exceptional events, so organisers can focus on the event
                itself instead of coordinating suppliers.
              </p>
            </div>
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Vision</div>
              <p className="text-lg leading-relaxed">
                STAGEGRID OS — a single operating platform connecting quoting, configuration, inventory, crew,
                logistics and asset management for event infrastructure across South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">Operating principles</h2>
          <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="bg-bg p-7">
                <h3 className="text-[16px] font-semibold">{p.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-text-dim">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
