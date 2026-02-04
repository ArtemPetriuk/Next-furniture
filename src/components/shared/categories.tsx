"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "./store/category";
import { Category } from "@prisma/client";

interface Props {
  items: Category[];
  className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);

  return (
    <div
      className={cn("inline-flex gap-1 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {items.map(({ name, id }, index) => (
        <a
          key={index}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-5 transition-all cursor-pointer", // додав cursor-pointer
            categoryActiveId === id &&
              "bg-white shadow-md shadow-gray-200 text-primary" // виправил опечатку shawod -> shadow
          )}
          href={`/#${name}`} // Залишаємо для SEO та відображення посилання
          onClick={(e) => {
            // 🔥 ГОЛОВНЕ ВИПРАВЛЕННЯ:
            e.preventDefault(); // 1. Забороняємо стандартний перехід (щоб не було перезагрузки)

            const element = document.getElementById(name); // 2. Шукаємо секцію за назвою
            
            if (element) {
              // 3. Робимо плавний скрол з відступом для хедера
              const headerOffset = 120; // Відступ зверху (підлаштуй під висоту свого хедера)
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }}
        >
          <button type="button" className="pointer-events-none">{name}</button> 
          {/* pointer-events-none щоб клік точно падав на <a> */}
        </a>
      ))}
    </div>
  );
};