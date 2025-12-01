"use client";

import React from "react";
import toast from "react-hot-toast";
import { ChooseFurnitureForm } from "./choose-furniture-form";
import { ProductWithRelations } from "../../../@types/prisma";
import { useCartStore } from "./store/cart";
import { CreateCartItemValues } from "@/components/shared/services/dto/cart.dto";

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({
  product,
  onSubmit: _onSubmit,
}) => {
  const addCartItem = useCartStore((s) => s.addCartItem);
  const loading = useCartStore((s) => s.loading);

  // ✅ Перевіряємо що приходить з бекенду
  console.log("🔎 ProductForm → product:", product);
  console.log("🔎 ProductForm → product.items:", product.items);
  console.log("🔎 ProductForm → product.options:", product.options);
  console.log("🔎 ProductForm → product.additionally:", product.additionally);

  const firstItem = product.items[0];
  const isFurnitureForm = Boolean(firstItem?.options);

  const onSubmit = async (productItemId?: number, additionally?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem?.id;

      // ✅ Перевірка на існування itemId
      if (!itemId) {
        console.error(
          "❌ Немає itemId! productItemId=",
          productItemId,
          "firstItem.id=",
          firstItem?.id
        );
        toast.error("Brak ID wariantu produktu");
        return;
      }

      console.log("✅ addCartItem виклик з даними:", { itemId, additionally });

      await addCartItem({
        productItemId: itemId,
        additionally,
      });

      toast.success(product.name + " dodano do koszyka");
      _onSubmit?.();
    } catch (err) {
      toast.error("Nie udało się dodać produktu do koszyka");
      console.error("❌ Помилка addCartItem:", err);
    }
  };

  if (isFurnitureForm) {
    return (
      <ChooseFurnitureForm
        options={product.options}
        imageUrl={product.imageUrl}
        name={product.name}
        additionally={product.additionally}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
      />
    );
  }

  // fallback якщо не furniture
  return (
    <button
      disabled={loading}
      onClick={() => onSubmit()}
      className="p-2 bg-black text-white rounded"
    >
      Dodaj do koszyka
    </button>
  );
};
