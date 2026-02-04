import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  className?: string;
}

export const CheckoutSidebarSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-8 shadow-sm",
        className,
      )}
    >
      {/* Заголовок */}
      <Skeleton className="mb-6 h-7 w-1/2 rounded bg-gray-200" />

      {/* Рядки з цінами */}
      <div className="mb-8 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24 bg-gray-100" />
          <Skeleton className="h-5 w-16 bg-gray-100" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20 bg-gray-100" />
          <Skeleton className="h-5 w-16 bg-gray-100" />
        </div>
      </div>

      {/* Разом до оплати */}
      <div className="mb-8 flex items-center justify-between border-t border-gray-100 pt-4">
        <Skeleton className="h-5 w-32 bg-gray-200" />
        <Skeleton className="h-8 w-24 bg-gray-200" />
      </div>

      {/* Велика кнопка */}
      <Skeleton className="h-14 w-full rounded-xl bg-gray-200" />

      {/* Іконки внизу (Доставка/Оплата) */}
      <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
        <div className="flex gap-3">
          <Skeleton className="h-5 w-5 rounded-full bg-gray-100" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 bg-gray-100" />
            <Skeleton className="h-3 w-48 bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
