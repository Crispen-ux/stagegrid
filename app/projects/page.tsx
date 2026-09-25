import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { projects } from "@/data/projects";
import { photoUrl } from "@/lib/photos";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";

export const metadata: Metadata = {
  title: "Projects — STAGEGRID",
  description: "Selected event infrastructure projects delivered by STAGEGRID across South Africa.",
};

const typeLabels: Record<string, string> = {
  corporate: "Corporate",
  activation: "Brand Activation",
  conference: "Conference",
  festival: "Live Event",
};

export default function ProjectsPage() {
  return (
    <main>
      <header className="border-b border-border py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Projects</div>
          <h1 className="max-w-[720px] font-display text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-tight">
            Infrastructure delivered at scale.
          </h1>
          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-text-dim">
            A selection of events where STAGEGRID engineered the full technical infrastructure — sound,
            structure, staging, lighting and logistics — under one operating model.
          </p>
        </div>
      </header>

      <section className="py-4">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((p, idx) => (
              <RevealOnScroll key={p.id} delay={idx * 0.05} className="flex flex-col rounded border border-border bg-surface overflow-hidden">
                <div className="relative flex h-44 items-end border-b border-border bg-surface2 p-5">
                  <Image
                    src={photoUrl(p.id, 800, 440)}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
                  <span className="relative rounded border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {typeLabels[p.type]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <div className="mt-2 flex items-center gap-4 text-[13px] text-text-dim">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {p.guestCount.toLocaleString()} guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {p.region}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.infrastructure.map((i) => (
                      <span key={i} className="rounded border border-border px-2.5 py-1 text-[11.5px] text-text-dim">
                        {i}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-[13.5px] leading-relaxed text-text-dim">{p.outcome}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded border border-border bg-surface p-9 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">Planning something similar?</h2>
              <p className="mt-2 max-w-[480px] text-[14px] text-text-dim">
                Configure your event&apos;s infrastructure and get an indicative technical package in minutes.
              </p>
            </div>
            <Link href="/event-builder" className="btn btn-primary px-6 py-3.5 text-sm">
              Build Your Event
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
