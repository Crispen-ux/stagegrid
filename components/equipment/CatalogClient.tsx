"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { equipment, categories, categoryLabels } from "@/data/equipment";
import type { EquipmentCategory } from "@/types";
import { EquipmentCard } from "./EquipmentCard";
import { BasketPanel } from "./BasketPanel";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";

export function CatalogClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | "all">("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    return equipment.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (availableOnly && !item.available) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, activeCategory, availableOnly]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search equipment…"
              className="w-full rounded border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <label className="flex items-center gap-2 whitespace-nowrap text-[13px] text-text-dim">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="accent-accent"
            />
            Available only
          </label>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          <button
            className={`chip ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>

        <div className="mb-4 text-[13px] text-text-faint">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded border border-border bg-surface p-10 text-center text-text-dim">
            No equipment matches your filters. Try a different search or category.
          </div>
        ) : (
          <RevealOnScroll className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </RevealOnScroll>
        )}
      </div>

      <div>
        <BasketPanel />
      </div>
    </div>
  );
}
