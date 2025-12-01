"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "../product-form";
import { ProductWithRelations } from "../../../../@types/prisma";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCartStore } from "../store";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const addCartItem = useCartStore((state) => state.addCartItem);

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden",
          className
        )}
      >
        <ProductForm product={product} onSubmit={handleClose} />
      </DialogContent>
    </Dialog>
  );
};
