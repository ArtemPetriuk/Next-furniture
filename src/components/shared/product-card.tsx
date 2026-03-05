import React from "react";
import Link from "next/link";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  description,
  className,
}) => {
  return (
    // 1. ЗОВНІШНІЙ КОНТЕЙНЕР (Невидимий, стабільний)
    <div className={cn("group h-full w-full", className)}>
      {/* 2. ВНУТРІШНЯ КАРТКА (Анімована) */}
      <div
        className={cn(
          "h-full w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-sm",
          // 👇 МАГІЯ ТУТ:
          "transition-all duration-300 ease-in-out",
          "transform-gpu will-change-transform", // 👈 Це прибирає мікро-тряску

          // Hover ефекти (активуються при наведенні на батьківську group)
          "group-hover:-translate-y-2 group-hover:border-violet-200 group-hover:shadow-xl",
        )}
      >
        <Link href={`/product/${id}`}>
          {/* Блок картинки */}
          <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7]">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" // Додав легкий зум картинки для краси (можна прибрати)
              src={imageUrl}
              alt={name}
            />
          </div>

          {/* Інформація про товар */}
          <div className="pt-4">
            <Title
              text={name}
              size="sm"
              className="mb-1 font-bold text-gray-900"
            />

            <p className="line-clamp-2 h-[40px] text-sm leading-tight text-gray-400">
              {description || "Komfort i styl na co dzień."}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[22px] font-bold text-gray-900">
                {price}{" "}
                <span className="text-sm font-normal text-gray-500">zł</span>
              </span>
              <Button
                variant="secondary"
                className={cn(
                  "rounded-xl font-bold transition-colors duration-300",
                  "bg-violet-50 text-violet-600",
                  "group-hover:bg-violet-600 group-hover:text-white",
                )}
              >
                <Plus size={20} className="mr-1" />
                Dodaj
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
