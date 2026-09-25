import type { Metadata } from "next";
import { PortalShell } from "@/components/dashboard/PortalShell";

export const metadata: Metadata = {
  title: "Portal — STAGEGRID",
  description: "STAGEGRID OS — events, equipment, quotes, invoices, crew, logistics and assets in one dashboard.",
};

export default function PortalPage() {
  return (
    <main>
      <div className="border-b border-border px-6 py-8 sm:px-10">
        <div className="text-xs font-semibold uppercase tracking-[2px] text-accent">Portal</div>
        <h1 className="mt-2 font-display text-2xl font-bold">Welcome back.</h1>
        <p className="mt-1 text-[13.5px] text-text-dim">
          A preview of the STAGEGRID OS dashboard — events, equipment, quotes, crew and logistics in one place.
        </p>
      </div>
      <PortalShell />
    </main>
  );
}
