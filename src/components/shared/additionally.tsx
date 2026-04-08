import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Additionallys: React.FC<Props> = ({
  className,
  active,
  price,
  name,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative flex w-32 cursor-pointer flex-col items-center overflow-hidden rounded-md bg-white p-1 text-center shadow-md",
        { "border border-primary ring-1 ring-primary": active },
        className,
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute right-2 top-2 z-10 text-primary" />
      )}

      {/* Блок картинки: object-contain гарантує, що фото не розтягнеться і не буде піксельним */}
      <div className="relative mb-2 flex h-[120px] w-full items-center justify-center overflow-hidden rounded-md bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 120px"
            // 🔥 Змінили object-cover на object-contain
            className="object-contain p-1"
          />
        ) : (
          <div className="h-full w-full border border-dashed border-gray-200 bg-gray-100" />
        )}
      </div>

      {/* Назва і ціна */}
      <span className="mb-1 px-1 text-xs leading-tight">{name}</span>
      <span className="mb-1 font-bold">{price} zł</span>
    </div>
  );
};
