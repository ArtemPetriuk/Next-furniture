import React from "react";
import Link from "next/link";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
// 👇 1. Importujemy nasz nowy przycisk
import { FavoriteButton } from "./favorite-button";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  className?: string;
  // 👇 2. Dodajemy nowy prop, żebyśmy wiedzieli, czy serduszko ma być czerwone od razu
  isFavorite?: boolean;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  description,
  className,
  isFavorite = false, // Domyślnie szare
}) => {
  return (
    // 1. ZEWNĘTRZNY KONTENER
    <div className={cn("group h-full w-full", className)}>
      {/* 2. WEWNĘTRZNA KARTA */}
      <div
        className={cn(
          // 👇 Dodano 'relative', aby pozycjonowanie serduszka działało poprawnie
          "relative h-full w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-sm",
          "transition-all duration-300 ease-in-out",
          "transform-gpu will-change-transform",
          "group-hover:-translate-y-2 group-hover:border-violet-200 group-hover:shadow-xl",
        )}
      >
        {/* 👇 3. NASZE SERDUSZKO! (Unosi się nad całą kartą) */}
        <FavoriteButton
          productId={id}
          initialIsFavorite={isFavorite}
          className="absolute right-7 top-7 z-20" // Z-20 gwarantuje, że jest nad zdjęciem i linkiem
        />

        {/* 👇 LINK DO PRODUKTU (Kliknięcie w kartę, ale nie w serduszko) */}
        <Link href={`/product/${id}`}>
          {/* Blok zdjęcia */}
          <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7]">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={imageUrl}
              alt={name}
            />
          </div>

          {/* Informacje o towarze */}
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
