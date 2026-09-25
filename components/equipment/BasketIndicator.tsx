"use client";

import Link from "next/link";
import { useBasket } from "@/lib/basket-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BasketIndicator() {
  const { itemCount } = useBasket();

  return (
    <Button asChild variant="outline" className="relative border border-border">
      <Link href="/equipment#basket">
        Event Basket
        {itemCount > 0 && (
          <Badge variant="accent" className="ml-1">
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
