import Link from "next/link";
import { equipment, categories, categoryLabels } from "@/data/equipment";

export function EquipmentTab() {
  const counts = categories.map((c) => ({
    category: c,
    count: equipment.filter((e) => e.category === c).length,
    available: equipment.filter((e) => e.category === c && e.available).length,
  }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Equipment Overview</h2>
        <Link href="/equipment" className="text-xs font-semibold text-accent hover:underline">
          Open full catalog →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <div key={c.category} className="rounded border border-border bg-surface p-5">
            <div className="text-[11px] uppercase tracking-wide text-text-faint">{categoryLabels[c.category]}</div>
            <div className="mt-2 font-display text-xl font-bold">{c.count} SKUs</div>
            <div className="mt-1 text-[11.5px] text-text-faint">{c.available} currently available</div>
          </div>
        ))}
      </div>
    </div>
  );
}
