import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ProductCard } from "@/components/shared/product-card";
import prisma from "@prisma/prisma-client";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getServerSession();

  // 1. Якщо користувач не авторизований, показуємо заглушку
  if (!session?.user?.email) {
    return (
      <Container className="mt-20 flex flex-col items-center justify-center pb-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl">
          🔒
        </div>
        <Title text="Zaloguj się" size="lg" className="mb-4 font-extrabold" />
        <p className="mb-8 text-gray-500">
          Musisz być zalogowany, aby zobaczyć swoją listę ulubionych produktów.
        </p>
        <Link href="/">
          <Button className="h-12 rounded-xl px-8 font-bold">
            Wróć do sklepu
          </Button>
        </Link>
      </Container>
    );
  }

  const safeEmail = String(session.user.email).trim().toLowerCase();

  // 2. Дістаємо всі улюблені товари цього користувача
  const favorites = await prisma.favorite.findMany({
    where: { user: { email: safeEmail } },
    include: {
      product: {
        include: {
          items: true, // Нам потрібні items, щоб дістати ціну
        },
      },
    },
    orderBy: { createdAt: "desc" }, // Найновіші лайки зверху
  });

  return (
    <Container className="mt-10 pb-14">
      <Title
        text="Moje ulubione ❤️"
        size="lg"
        className="mb-8 font-extrabold"
      />

      {/* 3. Якщо список порожній */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-5xl">
            💔
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Twoja lista jest pusta
          </h2>
          <p className="mb-8 text-gray-500">
            Nie dodałeś jeszcze żadnych produktów do ulubionych.
          </p>
          <Link href="/">
            <Button className="h-12 rounded-xl px-8 font-bold">
              Przejdź do zakupów
            </Button>
          </Link>
        </div>
      ) : (
        /* 4. Якщо товари є, виводимо їх сіткою */
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4">
          {favorites.map((favorite) => (
            <ProductCard
              key={favorite.product.id}
              id={favorite.product.id}
              name={favorite.product.name}
              imageUrl={favorite.product.imageUrl}
              price={favorite.product.items[0]?.price || 0}
              // На цій сторінці всі сердечка за замовчуванням червоні
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
