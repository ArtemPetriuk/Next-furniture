import { Container } from "@/components/shared/container";
import { notFound } from "next/navigation";
import prisma from "../../../../../prisma/prisma-client";
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
    // 👇 ЗМІНИЛИ ТУТ:
    // Було: "my-10 flex flex-col"
    // Стало: "mt-4 mb-10 flex flex-col"
    // mt-4 = маленький відступ зверху (16px). Можеш поставити mt-0, щоб було впритул.
    // mb-10 = відступ знизу, щоб футер не прилипав.
    <Container className="mb-10 mt-4 flex flex-col">
      <div className="mx-auto min-h-[500px] w-full max-w-[1060px] overflow-hidden rounded-[30px] bg-white shadow-lg">
        <ProductFormClient product={product} />
      </div>
    </Container>
  );
}
