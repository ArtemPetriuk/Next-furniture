"use client";

import { ProductForm } from "@/components/shared/product-form";
import { useRouter } from "next/navigation";

export const ProductFormClient = ({ product }: { product: any }) => {
  const router = useRouter();

  return (
    <ProductForm
      product={product}
      onSubmit={() => {
        router.push("/");
      }}
    />
  );
};
