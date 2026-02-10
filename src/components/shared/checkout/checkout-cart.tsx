import React from "react";
import { Minus, Plus, X, Info } from "lucide-react";
import { CheckoutItemSkeleton } from "./checkout-item-skeleton";
import { CartStateItem } from "@/lib/get-cart-details";
import { cn } from "@/lib/utils";
import { getCartItemDetails } from "@/lib/get-cart-items-details"; // 👈 1. Імпорт функції
import { Additionally } from "@prisma/client"; // 👈 2. Імпорт типу

const MONTAGE_PRICE = 499;

interface Props {
  items: CartStateItem[];
  loading: boolean;
  onClickCountButton: (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => void;
  removeCartItem: (id: number) => void;
  isMontageEnabled: boolean;
  setIsMontageEnabled: (val: boolean) => void;
  className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
  items,
  loading,
  onClickCountButton,
  removeCartItem,
  isMontageEnabled,
  setIsMontageEnabled,
  className,
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      {loading && items.length === 0 ? (
        [...Array(3)].map((_, index) => <CheckoutItemSkeleton key={index} />)
      ) : items.length > 0 ? (
        items.map((item) => {
          // Рахуємо ціну
          const optionsPrice =
            item.additionally?.reduce((acc, opt) => acc + opt.price, 0) || 0;
          const singleItemPrice = item.productItem.price + optionsPrice;
          const totalLinePrice = singleItemPrice * item.quantity;

          // 👇 3. ГЕНЕРУЄМО ОПИС (Варіант + Додатки)
          // Використовуємо ту саму функцію, що і в CartDrawer!
          const details = getCartItemDetails(
            item.additionally as Additionally[],
            item.productItem.options,
          );

          return (
            <div
              key={item.id}
              className={cn(
                "relative flex flex-col gap-6 border-b border-gray-100 p-6 transition-colors last:border-0 sm:flex-row",
                loading
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50/30",
              )}
            >
              <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <img
                  src={item.productItem?.product?.imageUrl}
                  alt={item.productItem?.product?.name}
                  className="h-full w-full object-cover mix-blend-multiply"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.productItem?.product?.name}
                  </h3>

                  {/* 👇 4. ВИВОДИМО ЦЕЙ РЯДОК */}
                  {/* Якщо є деталі (варіант або додатки), показуємо їх */}
                  {details && (
                    <p className="mt-1 text-sm text-gray-500">{details}</p>
                  )}

                  <p className="mt-2 text-sm font-medium text-gray-400">
                    {singleItemPrice} zł / szt.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between sm:mt-0">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        onClickCountButton(item.id, item.quantity, "minus")
                      }
                      disabled={item.quantity <= 1}
                      className="p-1 transition-colors hover:text-primary disabled:text-gray-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onClickCountButton(item.id, item.quantity, "plus")
                      }
                      className="p-1 transition-colors hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold">{totalLinePrice} zł</div>

                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      className="hidden text-gray-300 transition-colors hover:text-red-500 sm:block"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeCartItem(item.id)}
                className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-red-500 sm:hidden"
              >
                <X size={20} />
              </button>
            </div>
          );
        })
      ) : (
        <div className="p-10 text-center text-gray-500">
          Twój koszyk jest pusty.
        </div>
      )}

      {/* Блок з монтажем */}
      {(loading || items.length > 0) && (
        <div
          className={cn(
            "flex items-center justify-between border-t border-gray-100 bg-gray-50 p-6",
            loading && "pointer-events-none opacity-50",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              <Info size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Potrzebujesz montażu?</p>
              <p className="max-w-[300px] text-sm text-gray-500">
                Nasi fachowcy zmontują meble w dniu dostawy i zabiorą
                opakowania.
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer select-none items-center gap-3">
            <span className="font-bold text-gray-900">+{MONTAGE_PRICE} zł</span>
            <div
              onClick={() => setIsMontageEnabled(!isMontageEnabled)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                isMontageEnabled ? "bg-black" : "bg-gray-200",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                  isMontageEnabled ? "left-6" : "left-1",
                )}
              />
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
