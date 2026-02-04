import { cn } from "@/lib/utils";
import React from "react";
import { Categories } from "./categories";
import { SortPopup } from "./sort-popup";
import { Container } from "./container";
import { Category } from "@prisma/client";

interface Props {
  className?: string;
  categories: Category[];
}

export const TopBar: React.FC<Props> = ({ className, categories }) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 border-b border-white/20 bg-white/70 py-5 shadow-sm backdrop-blur-xl transition-all",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories items={categories} />
        <SortPopup />
      </Container>
    </div>
  );
};
