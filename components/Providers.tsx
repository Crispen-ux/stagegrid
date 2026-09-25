"use client";

import { BasketProvider } from "@/lib/basket-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <BasketProvider>{children}</BasketProvider>;
}
