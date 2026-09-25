import type { Metadata } from "next";
import { BuilderShell } from "@/components/event-builder/BuilderShell";

export const metadata: Metadata = {
  title: "Event Builder — STAGEGRID",
  description: "Configure your event's sound, trussing, staging, lighting, AV and logistics infrastructure.",
};

export default function EventBuilderPage() {
  return (
    <main>
      <BuilderShell />
    </main>
  );
}
