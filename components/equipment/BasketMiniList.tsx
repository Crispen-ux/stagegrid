"use client";

import Link from "next/link";
import { useBasket } from "@/lib/basket-context";

/**
 * Compact, editable basket view used inside the Event Builder's live panel.
 * Shows items added from the Equipment catalog alongside the builder's own
 * auto-recommended package, so both feed into one combined estimate.
 */
export function BasketMiniList() {
  const { lines, total, setQuantity, remove } = useBasket();

  if (lines.length === 0) {
    return (
      <div className="rounded border border-border bg-bg p-4">
        <div className="text-[11px] uppercase tracking-wide text-text-faint">From Your Equipment Basket</div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-text-dim">
          No specific items added yet. The recommendation above is auto-generated — browse the{" "}
          <Link href="/equipment" className="text-accent hover:underline">
            Equipment catalog
          </Link>{" "}
          to add named items to this event.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-border bg-bg p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-text-faint">From Your Equipment Basket</span>
        <Link href="/equipment" className="text-[11px] text-accent hover:underline">
          Edit in Catalog
        </Link>
      </div>
      <div className="flex flex-col gap-2.5">
        {lines.map((line) => (
          <div key={line.equipmentId} className="flex items-center justify-between gap-2 text-[12.5px]">
            <div className="min-w-0 flex-1">
              <div className="truncate">{line.equipment.name}</div>
            </div>
            <div className="flex items-center gap-1 rounded border border-border">
              <button
                className="px-1.5 py-0.5 text-text-dim hover:text-text"
                onClick={() => setQuantity(line.equipmentId, line.quantity - 1)}
                aria-label={`Decrease ${line.equipment.name}`}
              >
                −
              </button>
              <span className="w-5 text-center">{line.quantity}</span>
              <button
                className="px-1.5 py-0.5 text-text-dim hover:text-text"
                onClick={() => setQuantity(line.equipmentId, line.quantity + 1)}
                aria-label={`Increase ${line.equipment.name}`}
              >
                +
              </button>
            </div>
            <span className="w-16 shrink-0 text-right font-semibold">R{line.lineTotal.toLocaleString()}</span>
            <button
              onClick={() => remove(line.equipmentId)}
              className="text-text-faint hover:text-warn"
              aria-label={`Remove ${line.equipment.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[13px]">
        <span className="text-text-faint">Basket Subtotal</span>
        <span className="font-semibold">R{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
