import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact — STAGEGRID",
  description: "Talk to a STAGEGRID technical specialist about your event infrastructure requirements.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[800px] px-6 py-20">
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Contact</div>
      <h1 className="font-display text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.1] tracking-tight">
        Talk to a technical specialist.
      </h1>
      <p className="mt-4 max-w-[520px] text-base leading-relaxed text-text-dim">
        For anything the Event Builder can&apos;t answer directly — custom requirements, multi-site rollouts,
        or general enquiries — send us a message and a specialist will follow up.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
