"use client";

import React from "react";
import { useIntersection } from "react-use";
import { cn } from "@/lib/utils";
import { Title } from "./title";
import { ProductCard } from "./product-card";
import { useCategoryStore } from "./store/category";
import { ProductWithRelations } from "../../../@types/prisma";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

interface Props {
  title: string;
  items: any[];
  categoryId: number;
  className?: string;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryId,
  className,
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, title]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="md" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items?.[0]?.price ?? product.price ?? 0}
            description={product.description}
          />
        ))}
        <Link
          href={`/category/${categoryId}`}
          className={cn(
            "group flex h-full min-h-[300px] flex-col items-center justify-center",
            "rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50", // Сірий фон і пунктир
            "cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg",
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
            <Plus size={32} />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-600 transition-colors group-hover:text-primary">
              Zobacz wszystkie
            </span>
            <ArrowRight
              size={20}
              className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-primary"
            />
          </div>

          <span className="mt-1 text-sm font-medium text-gray-400">
            {title} ({items.length} szt.)
          </span>
        </Link>
      </div>
    </div>
  );
};
