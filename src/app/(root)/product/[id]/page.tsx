import { Container } from "@/components/shared/container";
import { notFound } from "next/navigation";
import prisma from "../../../../../prisma/prisma-client";
// 👇 Змінюємо імпорт: беремо наш новий клієнтський компонент
import { ProductFormClient } from "./product-form-client";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      additionally: true,
      items: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="my-10 flex flex-col">
      <div className="mx-auto min-h-[500px] w-full max-w-[1060px] overflow-hidden rounded-[30px] bg-white shadow-lg">
        <ProductFormClient product={product} />
      </div>
    </Container>
  );
}
