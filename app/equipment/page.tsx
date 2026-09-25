import type { Metadata } from "next";
import { CatalogClient } from "@/components/equipment/CatalogClient";

export const metadata: Metadata = {
  title: "Equipment — STAGEGRID",
  description: "Browse STAGEGRID's professional sound, trussing, staging, lighting and AV equipment catalog.",
};

export default function EquipmentPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="mb-10 max-w-[600px]">
        <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Equipment</div>
        <h1 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-tight">
          Discover and configure your equipment.
        </h1>
        <p className="mt-3.5 text-base leading-relaxed text-text-dim">
          Search and filter professional production equipment. Add items directly to your event — your basket
          carries through to the Event Builder.
        </p>
      </div>
      <CatalogClient />
    </main>
  );
}
