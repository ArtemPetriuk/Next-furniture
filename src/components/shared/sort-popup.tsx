"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { useClickAway } from "react-use";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  className?: string;
}

const sortOptions = [
  { name: "Najnowsze", value: "rating" },
  { name: "Od najtańszych", value: "price_asc" },
  { name: "Od najdroższych", value: "price_desc" },
];

export const SortPopup: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const activeSort = searchParams.get("sortBy") || "rating";
  const activeLabel = sortOptions.find((obj) => obj.value === activeSort)?.name;

  useClickAway(ref, () => setOpen(false));

  const onSelectSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", value);

    router.push(`?${params.toString()}`, { scroll: false });

    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      {/* Кнопка */}
      <div
        onClick={() => setOpen(!open)}
        className="inline-flex h-[52px] cursor-pointer items-center gap-1 rounded-2xl bg-gray-50 px-5 transition-colors hover:bg-gray-100"
      >
        <ArrowUpDown size={16} />
        <span className="font-bold">Sortowanie:</span>
        <span className="font-bold text-primary">{activeLabel}</span>
      </div>

      {/* Список */}
      {open && (
        <div className="absolute right-0 top-[60px] z-50 w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
          <ul>
            {sortOptions.map((item) => (
              <li
                key={item.value}
                onClick={() => onSelectSort(item.value)}
                className={cn(
                  "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                  activeSort === item.value
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600",
                )}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
