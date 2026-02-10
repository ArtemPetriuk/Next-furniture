"use client"; // 👈 Додаємо, бо використовуємо useState

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react"; // Імпортуємо іконку закриття

interface Props {
  className?: string;
  imageUrl: string;
  id: number; // ID залишаємо про всяк випадок, хоча для зуму він прямо зараз не потрібен
}

export const ProductImage: React.FC<Props> = ({ className, imageUrl, id }) => {
  // Стан для контролю відкриття зуму
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      {/* --- ЗВИЧАЙНИЙ ВИГЛЯД (У модалці) --- */}
      <div
        // Додаємо обробник кліку на контейнер
        onClick={() => setIsZoomed(true)}
        className={cn(
          "group relative flex h-full w-full cursor-zoom-in items-center justify-center", // group для ховер ефекту
          className,
        )}
      >
        {/* Ми прибрали <Link>, тепер це просто картинка */}
        <img
          src={imageUrl}
          alt="Product"
          className="relative z-10 h-full w-full rounded-3xl object-cover transition-all duration-500 group-hover:scale-[1.03]"
        />

        {/* Підказка при наведенні (опціонально) */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-black/20 font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Kliknij, aby powiększyć
        </div>
      </div>

      {/* --- ЗУМ (Повноекранний шар) --- */}
      {isZoomed && (
        <div
          // Шар на весь екран з високим z-index, щоб перекрити модалку
          className="fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 duration-300 animate-in fade-in md:p-10"
          onClick={() => setIsZoomed(false)} // Закриваємо при кліку на фон
        >
          {/* Кнопка закриття (хрестик) */}
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white">
            <X size={32} />
          </button>

          {/* Велике зображення */}
          <img
            src={imageUrl}
            alt="Product Zoomed"
            // max-h-screen та max-w-screen гарантують, що фото влізе в екран
            className="h-auto max-h-[90vh] w-auto max-w-full rounded-lg object-contain shadow-2xl duration-300 animate-in zoom-in-95"
            // Зупиняємо вспливання події, щоб клік на саме фото не закривав його (опціонально, зараз закриває все)
            // onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
