import type { PortalLineItem } from "@/types";

export interface Breakdown {
  subtotal: number;
  vat: number;
  total: number;
  hasItems: boolean;
}

/**
 * Stored totals (quote.estimateTotal / invoice.amount) are VAT-inclusive.
 * With line items the subtotal is simply their sum; without items the subtotal
 * is the total less 15% VAT so the document still reads correctly.
 */
export function breakdown(total: number, items: PortalLineItem[] | undefined | null): Breakdown {
  const list = items ?? [];
  if (list.length === 0) {
    const subtotal = Math.round(total / 1.15);
    return { subtotal, vat: total - subtotal, total, hasItems: false };
  }
  const subtotal = list.reduce((sum, item) => sum + item.amount, 0);
  return { subtotal, vat: total - subtotal, total, hasItems: true };
}

/** South African Rand formatting: R 12 345 (space thousands separator). */
export function rand(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = Math.abs(Math.round(value)).toString();
  return `${sign}R ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F")}`;
}
