import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import prisma from "../../../../../prisma/prisma-client";
import { ProductCard } from "@/components/shared/product-card";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/header"; // 👈 Імпортуємо Header замість TopBar

export default async function CategoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findFirst({
    where: { id: Number(id) },
    include: {
      products: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <>
      {/* 👇 Замінили TopBar на Header */}
      <Container className="mt-10 pb-10">
        <Title text={category.name} size="lg" className="mb-8 font-extrabold" />

        {/* 👇 ВЕЛИКІ КАРТКИ: grid-cols-3 і gap-10 */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              price={product.items[0].price}
              // className="h-[450px]" // Можна додати, якщо хочеш зафіксувати висоту
            />
          ))}
        </div>
      </Container>
    </>
  );
}
