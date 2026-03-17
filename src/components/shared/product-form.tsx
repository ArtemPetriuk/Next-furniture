"use client";

import React from "react";
import toast from "react-hot-toast";
import { ChooseFurnitureForm } from "./choose-furniture-form";
import { ProductWithRelations } from "../../../@types/prisma";
import { useCartStore } from "./store/cart";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const firstItem = product.items[0];

  // 🔥 ВИПРАВЛЕННЯ ТУТ:
  // Ми перевіряємо, чи є items взагалі, а не чи є у них options.
  // Тому що options тепер лежать у самому product.
  const isFurnitureForm = Boolean(product.items.length > 0);

  const onSubmit = async (productItemId?: number, additionally?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem?.id;

      if (!itemId) {
        toast.error("Brak ID wariantu produktu");
        return;
      }

      await addCartItem({
        productItemId: itemId,
        additionally,
      });

      toast.success(product.name + " dodano do koszyka");

      // 🔥 FIXED: Only call _onSubmit if provided (modal case)
      // Do NOT have a fallback router.push - let the parent handle it
      if (_onSubmit) {
        _onSubmit();
      }
      // If no _onSubmit callback, just close the modal silently
    } catch (err) {
      toast.error("Nie udało się dodać produktu do koszyka");
      console.error(err);
    }
  };

  if (isFurnitureForm) {
    return (
      <ChooseFurnitureForm
        imageUrl={product.imageUrl}
        name={product.name}
        description={product.description}
        additionally={product.additionally}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
        id={product.id}
      />
    );
  }

  // Fallback (це та сама чорна кнопка, яку ти бачив)
  return (
    <div className="flex h-full items-center justify-center p-10">
      <button
        disabled={loading}
        onClick={() => onSubmit()}
        className="rounded-xl bg-black px-6 py-3 font-bold text-white"
      >
        Dodaj do koszyka (Prosty produkt)
      </button>
    </div>
  );
};
