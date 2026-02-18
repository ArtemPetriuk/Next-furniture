"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useCartStore } from "./store";

interface Props {
  className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
  // 👇 ВИПРАВЛЕННЯ: Дістаємо кожну властивість окремо
  const totalAmount = useCartStore((state) => state.totalAmount);
  const items = useCartStore((state) => state.items);
  const loading = useCartStore((state) => state.loading);

  return (
    <CartDrawer>
      <Button loading={loading} className={cn("group relative", className)}>
        <b>{totalAmount} zł</b>

        <span className="mx-3 h-full w-[1px] bg-white/30" />

        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
          <ShoppingCart className="relative h-4 w-4" strokeWidth={2} />
          {/* Беремо довжину масиву items, щоб показати кількість */}
          <b>{items.length}</b>
        </div>

        <ArrowRight className="absolute right-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </CartDrawer>
  );
};
