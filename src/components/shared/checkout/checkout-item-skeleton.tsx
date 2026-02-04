import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  className?: string;
}

export const CheckoutItemSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        // 👇 justify-end притискає все вправо
        "flex items-center justify-end border-b border-gray-100 p-6 last:border-0",
        className,
      )}
    >
      {/* Ліва частина видалена повністю */}

      {/* Права частина: Кількість + Ціна + Видалення */}
      <div className="flex items-center gap-10">
        {/* Лічильник кількості */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded bg-gray-100" />
          <Skeleton className="h-6 w-4 rounded bg-gray-100" />
          <Skeleton className="h-8 w-8 rounded bg-gray-100" />
        </div>

        {/* Ціна */}
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-6 w-20 rounded bg-gray-200" />
        </div>

        {/* Хрестик видалення */}
        <Skeleton className="h-6 w-6 rounded bg-gray-100" />
      </div>
    </div>
  );
};
