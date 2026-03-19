import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { TopBar } from "@/components/shared/top-bar";
import { Filters } from "@/components/shared/filters";
import { ProductsGroupList } from "@/components/shared/product-group-list";
import { Suspense } from "react";
import { findFurniture, GetSearchParams } from "@/lib/find-furniture";
// 👇 1. Додаємо імпорти для бази та сесії
import { getServerSession } from "next-auth/next";
import prisma from "@prisma/prisma-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: GetSearchParams;
}) {
  const filteredCategories = await findFurniture(searchParams);

  // 👇 2. ЛОГІКА ДЛЯ УЛЮБЛЕНИХ ТОВАРІВ
  const session = await getServerSession();
  // Використовуємо масив замість Set, бо масиви краще передаються в інші компоненти у Next.js
  let favoriteProductIds: number[] = [];

  if (session?.user?.email) {
    const safeEmail = String(session.user.email).trim().toLowerCase();

    const userFavorites = await prisma.favorite.findMany({
      where: { user: { email: safeEmail } },
      select: { productId: true },
    });

    favoriteProductIds = userFavorites.map((fav) => fav.productId);
  }
  // 👆 КІНЕЦЬ НОВОЇ ЛОГІКИ

  return (
    <>
      <Container className="mt-10">
        <Title text="Wszystkie meble" size="lg" className="font-extrabold" />
      </Container>

      <TopBar categories={filteredCategories} />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Ліва частина - Фільтри */}
          <div className="sticky top-14 h-fit w-[250px] flex-shrink-0">
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
                  // 👇 3. ПЕРЕДАЄМО МАСИВ З ID УЛЮБЛЕНИХ ТОВАРІВ
                  favoriteIds={favoriteProductIds}
                />
              ))}

              {filteredCategories.length === 0 && (
                <div className="mt-20 text-center text-lg text-gray-500">
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
