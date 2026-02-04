import React from "react";
import { ArrowRight, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckoutSidebarSkeleton } from "./checkout-sidebar-skeleton"; // 👈 Імпорт

const MONTAGE_PRICE = 499;

interface Props {
  totalAmount: number;
  loading: boolean;
  isMontageEnabled: boolean;
  isSubmitting: boolean;
  disabled: boolean;
  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
  totalAmount,
  loading,
  isMontageEnabled,
  isSubmitting,
  disabled,
  className,
}) => {
  const finalAmount = totalAmount + (isMontageEnabled ? MONTAGE_PRICE : 0);

  // 👇 Якщо завантаження - повертаємо гарний скелетон
  if (loading) {
    return <CheckoutSidebarSkeleton className={className} />;
  }

  return (
    <div
      className={cn(
        "sticky top-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {/* ... (Твій існуючий код далі без змін) ... */}
      <h3 className="mb-6 border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
        Twoje zamówienie
      </h3>

      <div className="mb-8 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Wartość mebli:</span>
          <span className="font-bold text-gray-900">{totalAmount} zł</span>
        </div>
        {isMontageEnabled && (
          <div className="flex justify-between text-blue-600">
            <span className="flex items-center gap-2">
              <Check size={14} /> Montaż mebli:
            </span>
            <span className="font-bold">+{MONTAGE_PRICE} zł</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Dostawa:</span>
          <span className="font-bold text-green-600">Gratis</span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between border-t border-gray-100 pt-4">
        <span className="font-medium text-gray-500">Razem do zapłaty:</span>
        <span className="text-3xl font-extrabold text-gray-900">
          {finalAmount} zł
        </span>
      </div>

      <Button
        type="submit"
        disabled={disabled}
        className="mb-6 h-14 w-full rounded-xl bg-gray-900 text-lg font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
      >
        {isSubmitting ? "Przetwarzanie..." : "Potwierdź zamówienie"}
        <ArrowRight size={20} className="ml-2" />
      </Button>

      <div className="space-y-4 border-t border-gray-100 pt-4">
        <div className="flex items-start gap-3">
          <Truck className="mt-1 text-gray-400" size={18} />
          <div>
            <p className="text-xs font-bold uppercase text-gray-800">
              Bezpieczna dostawa
            </p>
            <p className="text-xs text-gray-500">
              Bierzemy odpowiedzialność za meble do momentu ich montażu w Twoim
              domu.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Check className="mt-1 text-gray-400" size={18} />
          <div>
            <p className="text-xs font-bold uppercase text-gray-800">
              Płatność przy odbiorze
            </p>
            <p className="text-xs text-gray-500">
              Możesz obejrzeć towar przed dokonaniem płatności.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
