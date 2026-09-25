"use client";

import { useState } from "react";
import Image from "next/image";
import type { Equipment } from "@/types";
import { categoryLabels } from "@/data/equipment";
import { useBasket } from "@/lib/basket-context";
import { photoUrl } from "@/lib/photos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EquipmentCard({ item }: { item: Equipment }) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToEvent } = useBasket();

  function handleAdd() {
    if (!item.available) return;
    addToEvent(item.id, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:border-text-faint">
      <div className="relative h-32 w-full border-b border-border bg-surface2">
        <Image
          src={photoUrl(item.id, 480, 320)}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 360px"
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug">{item.name}</h3>
          <Badge variant={item.available ? "ok" : "warn"} className="shrink-0">
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <div className="mb-2.5 text-[11px] uppercase tracking-wide text-text-faint">
          {categoryLabels[item.category]}
        </div>
        <p className="mb-3.5 text-[13px] leading-relaxed text-text-dim">{item.description}</p>

        <dl className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px] text-text-dim">
          {Object.entries(item.specs).slice(0, 4).map(([k, v]) => (
            <div key={k}>
              <dt className="text-text-faint">{k}</dt>
              <dd className="font-medium text-text">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3.5">
          <div>
            <div className="font-display text-lg font-bold">R{item.dailyRate.toLocaleString()}</div>
            <div className="text-[11px] text-text-faint">per day</div>
          </div>
          <div className="flex items-center gap-1 rounded border border-border">
            <button
              className="px-2.5 py-1.5 text-text-dim hover:text-text"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button
              className="px-2.5 py-1.5 text-text-dim hover:text-text"
              onClick={() => setQty((q) => Math.min(item.quantityAvailable, q + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!item.available}
          variant={justAdded ? "outline" : "default"}
          className={`mt-3.5 w-full ${justAdded ? "border-ok text-ok" : ""}`}
        >
          {justAdded ? "Added ✓" : "Add to Event"}
        </Button>
      </CardContent>
    </Card>
  );
}
