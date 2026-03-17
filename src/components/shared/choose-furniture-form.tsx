"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Additionally, ProductItem } from "@prisma/client";
import { PackageX } from "lucide-react";
import { ProductImage } from "./product-image";
import { Title } from "./title";
import { Button } from "../ui";
import { Additionallys } from "./additionally";
import { useFurnitureOptions } from "../hooks/use-furniture-option";
import { useRouter } from "next/navigation";

interface Props {
  imageUrl: string;
  name: string;
  additionally?: Additionally[];
  items: ProductItem[];
  loading?: boolean;
  onSubmit: (itemId: number, additionally: number[]) => void;
  className?: string;
  // options?: any; // Більше не потрібно, дані беремо з items
  id: number;
  description?: string | null;
}

export const ChooseFurnitureForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  loading,
  onSubmit,
  className,
  // options,
  additionally = [],
  id,
  description,
}) => {
  const textDetails = description || "Komfort i styl na co dzień";

  const {
    selectedAdditionally,
    addAdditionally,
    currentItemId,
    selectedOption,
    handleOptionSelect,
  } = useFurnitureOptions(items);

  // Знаходимо активний елемент (варіацію), яку вибрав користувач
  const activeItem = items.find((item) => item.options === selectedOption);

  // Якщо варіант не вибрано, беремо перший доступний
  const currentItem = activeItem || items[0];

  const calculateTotalPrice = () => {
    let price = currentItem ? currentItem.price : 0;

    let additionsPrice = 0;
    selectedAdditionally.forEach((id) => {
      const addition = additionally.find((a) => a.id === id);
      if (addition?.price) additionsPrice += addition.price;
    });

    return price + additionsPrice;
  };

  const totalPrice = calculateTotalPrice();
  const isOutOfStock = currentItem ? currentItem.stock <= 0 : true;

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentItem) {
      try {
        await onSubmit(currentItem.id, Array.from(selectedAdditionally));
      } catch (error) {
        console.error("Błąd pod czas dodawania:", error);
      }
    } else {
      console.error("Nie można złożyć zamówienia: brak wariantu");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(className, "flex h-auto min-h-[500px] flex-1")}
    >
      {/* ЛІВА ЧАСТИНА (ФОТО) */}
      <div className="relative flex w-[50%] items-center justify-center overflow-hidden rounded-l-3xl bg-[#F5F5F7] p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        <ProductImage imageUrl={imageUrl} id={id} className="z-10" />
      </div>

      {/* ПРАВА ЧАСТИНА (КОНТЕНТ) */}
      <div className="flex flex-1 flex-col justify-between rounded-r-3xl bg-white p-8">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <Title
              text={name}
              size="md"
              className="mb-2 text-2xl font-extrabold text-gray-900"
            />
            <p className="text-sm leading-relaxed text-gray-500">
              {textDetails}
            </p>
          </div>

          <div className="custom-scrollbar -mr-2 flex-1 space-y-6 overflow-y-auto pr-2">
            {/* ПОПЕРЕДЖЕННЯ ПРО МАЛИЙ ЗАЛИШОК */}
            {!isOutOfStock &&
              currentItem &&
              currentItem.stock < 4 &&
              currentItem.stock > 0 && (
                <p className="rounded-lg border border-orange-100 bg-orange-50 p-2 text-sm font-medium text-orange-500">
                  ⚠️ Zostało tylko {currentItem.stock} szt.!
                </p>
              )}

            {/* 🔥 НОВИЙ СПИСОК ВАРІАНТІВ (НА ОСНОВІ ITEMS) */}
            {items.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-800 opacity-80">
                  Wybierz wariant:
                </h3>
                <div className="flex flex-col gap-2.5">
                  {items.map((item) => {
                    const isItemDisabled = item.stock <= 0;
                    const isSelected = selectedOption === item.options;

                    return (
                      <button
                        key={item.id} // Використовуємо унікальний ID з бази
                        disabled={isItemDisabled}
                        // Передаємо назву опції (напр. "Lewa") у хук
                        onClick={() => handleOptionSelect(item.options || "")}
                        className={cn(
                          "group flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 ease-in-out",
                          "hover:shadow-md",
                          isItemDisabled
                            ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50 grayscale"
                            : isSelected
                              ? "border-violet-600 bg-violet-50 shadow-sm ring-1 ring-violet-600/20"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                        )}
                      >
                        <div className="flex flex-col items-start">
                          <span
                            className={cn(
                              "text-sm transition-colors",
                              isSelected && !isItemDisabled
                                ? "font-semibold text-violet-700"
                                : "text-gray-700",
                            )}
                          >
                            {item.options || "Standard"}
                          </span>
                          {isItemDisabled && (
                            <span className="text-[10px] font-bold uppercase text-red-500">
                              Brak w magazynie
                            </span>
                          )}
                        </div>

                        {!isItemDisabled && (
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isSelected
                                ? "text-violet-900"
                                : "text-gray-500 group-hover:text-gray-900",
                            )}
                          >
                            {item.price} zł
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ДОДАТКИ */}
            {additionally.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-800 opacity-80">
                  Dodatki:
                </h3>
                <div
                  className={cn(
                    "w-full",
                    additionally.length > 3
                      ? "custom-scrollbar max-h-[220px] overflow-y-auto pr-2"
                      : "h-auto",
                  )}
                >
                  <div className="grid grid-cols-3 gap-3 pb-1">
                    {additionally.map((item) => (
                      <Additionallys
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        onClick={() => addAdditionally(item.id)}
                        active={selectedAdditionally.has(item.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* КНОПКА */}
        <div className="mt-6 flex-shrink-0 border-t border-gray-100 pt-4">
          <Button
            loading={loading}
            type="button"
            className={cn(
              "h-[55px] w-full rounded-2xl text-base font-bold shadow-lg shadow-violet-500/20 transition-transform active:scale-[0.98]",
              "bg-violet-600 text-white hover:bg-violet-700",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
            disabled={loading || totalPrice === 0 || isOutOfStock}
          >
            {isOutOfStock ? (
              <span className="flex items-center gap-2">
                <PackageX size={20} />
                Brak w magazynie
              </span>
            ) : loading ? (
              "Przetwarzanie..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Dodaj do koszyka
                <span className="mx-1 h-1 w-1 rounded-full bg-white/50"></span>
                {totalPrice} zł
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
