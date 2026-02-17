export const dynamic = "force-dynamic"; // 👈 ДОДАЙ ЦЕЙ РЯДОК
export const revalidate = 0; // 👈 І ЦЕЙ ДЛЯ НАДІЙНОСТІ

import { Container } from "@/components/shared/container";
// ... далі твої імпорти ...
import { Title } from "@/components/shared/title";
import prisma from "../../../../../prisma/prisma-client";
import { ProductCard } from "@/components/shared/product-card";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
  searchParams: { sortBy?: string };
}

export default async function CategoryPage({
  params: { id },
  searchParams,
}: Props) {
  // Щоб перевірити, чи працює, подивись у ТЕРМІНАЛ (VS Code), коли клацаєш:
  console.log("Параметри URL:", searchParams);

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

  // СОРТУВАННЯ
  const sortBy = searchParams.sortBy;

  if (sortBy === "price_asc") {
    category.products.sort(
      (a, b) => (a.items[0]?.price || 0) - (b.items[0]?.price || 0),
    );
  } else if (sortBy === "price_desc") {
    category.products.sort(
      (a, b) => (b.items[0]?.price || 0) - (a.items[0]?.price || 0),
    );
  }

  return (
    <Container className="mt-10 pb-10">
      <Title text={category.name} size="lg" className="mb-8 font-extrabold" />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items[0]?.price || 0}
          />
        ))}
      </div>
    </Container>
  );
}
