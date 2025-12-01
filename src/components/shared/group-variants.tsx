"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type Variant = {
  name: string;
  value: string;
  price?: number;
  disabled?: boolean;
};

interface Props {
  items: readonly Variant[];
  value?: string;
  className?: string;
  onSelect?: (value: string) => void;
}

export const GroupVariants: React.FC<Props> = ({
  items,
  value,
  className,
  onSelect,
}) => {
  return (
    <div className={cn(className, "space-y-2")}>
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Warianty:</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((option) => (
          <button
            key={option.value}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-full",
              "transition-all hover:bg-gray-50",
              {
                "border-black bg-gray-100 font-medium": option.value === value,
                "border-black-200": option.value !== value,
                "opacity-50 pointer-events-none": option.disabled,
              }
            )}
            onClick={() => onSelect?.(option.value)}
          >
            <span>{option.name}</span>
            {option.price && (
              <span className="text-black font-medium">{option.price} zł</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
