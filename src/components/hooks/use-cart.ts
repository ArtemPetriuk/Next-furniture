// src/shared/hooks/use-cart.ts
import { CartStateItem } from "@/lib/get-cart-details";
import React from "react";
import { CreateCartItemValues } from "../shared/services/dto/cart.dto";
import { useCartStore } from "../shared/store/cart"; // шлях під твій проєкт

type ReturnProps = {
  totalAmount: number;
  items: CartStateItem[];
  loading: boolean;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  addCartItem: (values: CreateCartItemValues) => void;
  fetchCartItems: () => void;
};

export const useCart = (): ReturnProps => {
  // окремі селектори — стабільніші
  const fetchCartItems = useCartStore((s) => s.fetchCartItems);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const items = useCartStore((s) => s.items);
  const loading = useCartStore((s) => s.loading);
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const removeCartItem = useCartStore((s) => s.removeCartItem);
  const addCartItem = useCartStore((s) => s.addCartItem);

  React.useEffect(() => {
    // викликаємо один раз при маунті; залежність — сама функція (її ідентичність стабільна, якщо getCartDetails не її перезаписує)
    fetchCartItems();
  }, [fetchCartItems]);

  return {
    totalAmount,
    items,
    loading,
    updateItemQuantity,
    removeCartItem,
    addCartItem,
    fetchCartItems,
  };
};
