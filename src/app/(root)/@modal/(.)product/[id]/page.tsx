import {
  ProductImage,
  Title,
  Container,
  ChooseProductModal,
} from "@/components/shared";
import { GroupVariants } from "@/components/shared/group-variants";
import prisma from "@prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function ProductModalPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      additionally: true,
      items: true,
      colors: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return <ChooseProductModal product={product} />;
}
