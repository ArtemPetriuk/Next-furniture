import { Container } from "@/components/shared";
import { ProductForm } from "@/components/shared/product-form"; // Імпортуй свій існуючий компонент
import prisma from "@prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // 1. Завантажуємо дані (так само, як і раніше)
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      items: true, // Варіанти (ProductItem)
      additionally: true, // Додатки (Additionally)
      // category: true,  // Якщо треба категорія
    },
  });

  // 2. Якщо товару немає — 404
  if (!product) {
    return notFound();
  }

  // 3. Рендеримо твій готовий компонент
  return (
    <Container className="my-10 flex flex-col">
      {/* Ми передаємо product. onSubmit тут не обов'язковий, 
          бо на окремій сторінці нам не треба закривати модалку після покупки.
      */}
      <ProductForm product={product} />
    </Container>
  );
}
