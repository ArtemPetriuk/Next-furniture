export const dynamic = "force-dynamic"; // 👈 ДОДАЙ ЦЕЙ РЯДОК
export const revalidate = 0; // 👈 І ЦЕЙ ДЛЯ НАДІЙНОСТІ

import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import prisma from "@prisma/prisma-client"; // Трохи підправив імпорт для надійності
import { ProductCard } from "@/components/shared/product-card";
import { notFound } from "next/navigation";
// 👇 1. ІМПОРТУЄМО СЕСІЮ
import { getServerSession } from "next-auth/next";

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

  // 👇 2. НОВА ЛОГІКА ДЛЯ УЛЮБЛЕНИХ ТОВАРІВ 👇
  const session = await getServerSession();
  let favoriteProductIds = new Set<number>();

  if (session?.user?.email) {
    // Беремо email так само надійно, як і в екшені
    const safeEmail = String(session.user.email).trim().toLowerCase();

    // Шукаємо всі лайки цього юзера
    const userFavorites = await prisma.favorite.findMany({
      where: { user: { email: safeEmail } },
      select: { productId: true },
    });

    // Записуємо їхні ID у Set для швидкої перевірки
    favoriteProductIds = new Set(userFavorites.map((fav) => fav.productId));
  }
  // 👆 КІНЕЦЬ НОВОЇ ЛОГІКИ 👆

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
            // 👇 3. ПЕРЕДАЄМО СТАТУС СЕРДЕЧКА В КАРТКУ 👇
            isFavorite={favoriteProductIds.has(product.id)}
          />
        ))}
      </div>
    </Container>
  );
}
