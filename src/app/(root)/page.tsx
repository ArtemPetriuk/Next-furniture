import { Container, Filters, Title, TopBar } from "@/components/shared";
import { ProductsGroupList } from "@/components/shared/product-group-list";
import prisma from "@prisma/prisma-client";
import { Suspense } from "react";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          additionally: true,
          items: {
            select: {
              id: true,
              price: true,
              options: true,
              productId: true, // Додаємо productId, якщо він використовується
            },
          },
        },
        where: {
          items: {
            some: {}, // Фільтруємо тільки продукти з items
          },
        },
      },
    },
  });

  return (
    <>
      <Container className="mt-10">
        <Title
          text="wszystkie meble"
          size="sm"
          className="font-extrabold pl-4"
        />
      </Container>

      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0
        )}
      />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          <div className="w=[250px]">
            <Suspense>
              {" "}
              <Filters />{" "}
            </Suspense>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
