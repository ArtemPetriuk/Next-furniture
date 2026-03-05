import { Skeleton } from "@/components/ui/skeleton";

export const OrderHistorySkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-5 w-40" /> {/* Дата */}
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" /> {/* Ціна */}
              <Skeleton className="h-6 w-24 rounded-full" /> {/* Статус */}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl" /> {/* Картинка */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
