import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { solutions, getSolution, getRelatedSolutions } from "@/data/solutions";
import { equipment, categoryLabels } from "@/data/equipment";
import { photoUrl } from "@/lib/photos";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const solution = getSolution(params.slug);
  if (!solution) return {};
  return {
    title: `${solution.name} — STAGEGRID`,
    description: solution.summary,
  };
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const solution = getSolution(params.slug);
  if (!solution) notFound();

  const examples = equipment
    .filter((e) => solution.equipmentCategories.includes(e.category))
    .slice(0, 4);
  const related = getRelatedSolutions(solution.slug);

  return (
    <main>
      <header className="relative overflow-hidden border-b border-border py-20">
        <Image
          src={photoUrl(`solution-${solution.slug}`, 1600, 800)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/85 to-bg" />
        <div className="grid-bg absolute inset-0" />
        <div className="relative mx-auto max-w-[1200px] px-6">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[2px] text-accent">
            <Link href="/solutions" className="text-text-faint hover:text-accent">
              Solutions
            </Link>
            <span className="text-text-faint">/</span>
            <span>{solution.name}</span>
          </div>
          <h1 className="max-w-[760px] font-display text-[clamp(32px,5.5vw,58px)] font-bold leading-[1.05] tracking-tight">
            {solution.tagline}
          </h1>
          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-text-dim">{solution.summary}</p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link href="/event-builder" className="btn btn-primary px-6 py-3.5 text-sm">
              Build Your Event
            </Link>
            <Link href="/request-quote" className="btn btn-ghost border border-border px-6 py-3.5 text-sm">
              Request a Technical Quote
            </Link>
          </div>
        </div>
      </header>

      {/* Use cases */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">Where {solution.name.toLowerCase()} fits</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {solution.useCases.map((uc) => (
              <div key={uc} className="rounded border border-border bg-surface p-5 text-[14px] leading-relaxed text-text-dim">
                {uc}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">Technical capabilities</h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {solution.capabilities.map((c) => (
              <div key={c} className="flex items-start gap-3 text-[14px] leading-relaxed text-text-dim">
                <Check size={16} className="mt-0.5 shrink-0 text-ok" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment examples */}
      {examples.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold">Equipment examples</h2>
              <Link href="/equipment" className="text-xs font-semibold text-accent hover:underline">
                View full catalog →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {examples.map((item) => (
                <div key={item.id} className="overflow-hidden rounded border border-border bg-surface">
                  <div className="relative h-24 w-full border-b border-border bg-surface2">
                    <Image
                      src={photoUrl(item.id, 320, 200)}
                      alt={item.name}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[11px] uppercase tracking-wide text-text-faint">
                      {categoryLabels[item.category]}
                    </div>
                    <h3 className="mt-2 text-[14px] font-semibold leading-snug">{item.name}</h3>
                    <div className="mt-3 font-display text-base font-bold">
                      R{item.dailyRate.toLocaleString()}
                      <span className="text-xs font-normal text-text-faint"> / day</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">How we deliver it</h2>
          <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-5">
            {solution.process.map((step, i) => (
              <div key={step.title} className="bg-bg p-5">
                <div className="font-display text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2.5 text-[13.5px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-text-dim">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical considerations */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Technical considerations</h2>
          <div className="flex flex-col gap-3 rounded border border-border bg-surface p-6">
            {solution.considerations.map((c) => (
              <div key={c} className="text-[13.5px] leading-relaxed text-text-dim">
                ⚠ {c}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-text-faint">
            These are general planning considerations, not a certified safety or engineering assessment. Final
            technical sign-off requires qualified STAGEGRID engineering review.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded border border-border bg-surface p-9 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">Ready to configure your {solution.name.toLowerCase()}?</h2>
              <p className="mt-2 max-w-[480px] text-[14px] text-text-dim">
                Build a full event configuration in the Event Builder, or talk to a technical specialist about
                your requirements.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/event-builder" className="btn btn-primary px-6 py-3.5 text-sm">
                Build Your Event
              </Link>
              <Link href="/contact" className="btn btn-ghost border border-border px-6 py-3.5 text-sm">
                Talk to a Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related solutions */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">Related solutions</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/solutions/${r.slug}`}
                className="group flex flex-col justify-between rounded border border-border bg-surface p-6"
              >
                <div>
                  <div className="font-display text-xs text-text-faint">{r.num}</div>
                  <h3 className="mt-2.5 text-[16px] font-semibold">{r.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-dim">{r.summary}</p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
