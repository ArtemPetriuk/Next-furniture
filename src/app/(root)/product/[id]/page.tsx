import { Container } from "@/components/shared/container";
import { notFound } from "next/navigation";
import prisma from "../../../../../prisma/prisma-client";
import { ProductFormClient } from "./product-form-client";
import { getServerSession } from "next-auth/next";
import { ReviewForm } from "@/components/shared/reviews/review-form";
import { StarRating } from "@/components/shared/reviews/star-rating";
import { authOptions } from "../../../../lib/auth-options";
import { ReviewList } from "@/components/shared/reviews/review-list";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // 1. Отримуємо сесію
  const session = await getServerSession(authOptions); // Або просто getServerSession() якщо немає authOptions

  // 2. Отримуємо EMAIL з сесії (email завжди є)
  const userEmail = session?.user?.email;

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      additionally: true,
      colors: true,
      items: {
        orderBy: {
          price: "asc",
        },
      },
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  let hasPurchased = false;
  let dbUserId = null;

  console.log("----------------------------------------");
  console.log(`🔎 ПЕРЕВІРКА ДЛЯ ТОВАРУ ID: ${product.id}`);
  console.log(`👤 Email із сесії:`, userEmail);

  if (userEmail) {
    // 3. Знаходимо реального юзера в базі по EMAIL
    const dbUser = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (dbUser) {
      dbUserId = dbUser.id;
      console.log(`✅ Знайдено юзера в базі. Його ID:`, dbUserId);

      // 4. Тепер, коли у нас є 100% правильний ID, шукаємо замовлення
      const userOrders = await prisma.order.findMany({
        where: {
          userId: dbUserId,
          status: "SUCCEEDED",
        },
      });

      console.log(
        `📦 Знайдено успішних замовлень (SUCCEEDED):`,
        userOrders.length,
      );

      hasPurchased = userOrders.some((order, index) => {
        try {
          let items = order.items as any;

          while (typeof items === "string") {
            items = JSON.parse(items);
          }

          console.log(
            `🛒 Кошик #${index + 1}:`,
            JSON.stringify(items, null, 2),
          );

          if (!Array.isArray(items)) return false;

          const isFoundInThisOrder = items.some((item: any) => {
            const rawId =
              item?.productId ||
              item?.productItem?.productId ||
              item?.productItem?.product?.id ||
              item?.product?.id;

            return Number(rawId) === Number(product.id);
          });

          return isFoundInThisOrder;
        } catch (error) {
          console.error("Помилка розпакування:", error);
          return false;
        }
      });
    } else {
      console.log(`❌ Юзера з email ${userEmail} не знайдено в базі.`);
    }
  }

  console.log(`🏁 Результат hasPurchased: ${hasPurchased}`);
  console.log("----------------------------------------");

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <Container className="mb-20 mt-6 max-w-[1440px]">
      {/* 👇 ДОДАЛИ items-start ОСЬ ТУТ, ЩОБ БЛОКИ НЕ РОЗТЯГУВАЛИСЯ 👇 */}
      <div className="flex w-full flex-col items-start gap-8 xl:flex-row">
        {/* LЕВО: Товар */}
        <div className="min-h-[500px] flex-1 overflow-hidden rounded-[30px] bg-white shadow-lg">
          <ProductFormClient product={product} />
        </div>

        {/* PRЕВО: Відгуки */}
        {/* Додали h-fit на всякий випадок, хоча items-start вже робить свою роботу */}
        <div className="h-fit w-full flex-shrink-0 rounded-[30px] bg-white p-6 shadow-lg sm:p-8 xl:w-[350px] 2xl:w-[400px]">
          <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <h2 className="text-2xl font-bold text-gray-800">Opinie</h2>
            {product.reviews.length > 0 && (
              <div className="flex w-fit items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5">
                <StarRating value={Math.round(avgRating)} disabled />
                <span className="font-bold text-gray-800">
                  {avgRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Форма відгуку */}
          {hasPurchased && dbUserId ? (
            <div className="mb-8">
              <ReviewForm productId={product.id} userId={dbUserId} />
            </div>
          ) : null}

          {/* 👇 ТЕПЕР ТУТ ПРОСТО ВИКЛИКАЄМО НАШ НОВИЙ КОМПОНЕНТ 👇 */}
          {product.reviews.length > 0 ? (
            <ReviewList reviews={product.reviews} />
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-gray-400">
                {hasPurchased
                  ? "Brak opinii. Bądź pierwszy, który oceni ten produkt!"
                  : "Ten produkt nie ma jeszcze opinii."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
