import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { TopBar } from "@/components/shared/top-bar";
import { Filters } from "@/components/shared/filters";
import { ProductsGroupList } from "@/components/shared/product-group-list" // Перевір назву файлу
import { Suspense } from "react";
import { findFurniture, GetSearchParams } from "@/lib/find-furniture"; // Імпортуємо нашу функцію



export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
  // 🔥 Вся логіка тепер тут, в одному рядку:
  const filteredCategories = await findFurniture(searchParams);

  return (
    <>
      <Container className="mt-10">
        <Title text="Wszystkie meble" size="lg" className="font-extrabold" />
      </Container>

      <TopBar categories={filteredCategories} />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Ліва частина - Фільтри */}
          <div className="w-[250px]">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          {/* Права частина - Список товарів */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {filteredCategories.map((category) => (
                <ProductsGroupList
                  key={category.id}
                  title={category.name}
                  categoryId={category.id}
                  items={category.products}
                />
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center text-gray-500 mt-20 text-lg">
                  Nie znaleziono produktów spełniających kryteria 
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}