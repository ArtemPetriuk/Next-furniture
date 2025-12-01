"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  imageUrl: string;
  className?: string;
}

export const ProductImage: React.FC<Props> = ({ imageUrl, className }) => {
  return (
    <div
      className={cn("flex-1 relative w-full h-full overflow-hidden", className)}
    >
      <img
        src={imageUrl}
        alt="Product"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
