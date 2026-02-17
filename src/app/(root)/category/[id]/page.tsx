import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import prisma from "../../../../../prisma/prisma-client";
import { ProductCard } from "@/components/shared/product-card";
import { notFound } from "next/navigation";

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
      <Container className="mt-10 pb-10">
        <Title text={category.name} size="lg" className="mb-8 font-extrabold" />

        {/* 👇 ВИПРАВЛЕННЯ:
            grid-cols-2 (телефон)
            md:grid-cols-3 (планшет і малий ноутбук)
            xl:grid-cols-4 (великий екран) -> ЦЕ ЗРОБИТЬ КАРТИНКИ АКУРАТНИМИ
            
            gap-8 -> повернемо повітря між картками, це теж візуально зменшить їх
        */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              price={product.items[0].price}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
