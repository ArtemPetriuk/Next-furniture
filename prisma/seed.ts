import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
// 🔥 Додаємо filterOptions в імпорт
import {
  _additionally,
  products,
  categories,
  filterOptions,
} from "./constants";

const prisma = new PrismaClient();

interface CategoryAdditionallyMap {
  [key: number]: number[];
}

const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const processProductOptions = (options: string | null) => {
  if (!options) return [];

  try {
    const parsedOptions = JSON.parse(options);

    if (
      Array.isArray(parsedOptions) &&
      parsedOptions[0]?.name &&
      parsedOptions[0]?.price
    ) {
      return parsedOptions.map((option: { name: string; price: number }) => ({
        name: option.name,
        price: option.price,
      }));
    }

    if (Array.isArray(parsedOptions)) {
      return parsedOptions.map((option: string) => ({
        name: option,
        price: randomDecimalNumber(500, 5000),
      }));
    }
  } catch (e) {
    console.error("Error parsing options:", e);
  }

  return [];
};

async function up() {
  // 1. Користувачі
  await prisma.user.createMany({
    data: [
      {
        fullName: "User Test",
        email: "user@test.gmail",
        password: hashSync("111111", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin Admin",
        email: "admin@test.gmail",
        password: hashSync("111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });

  // 2. Категорії
  await prisma.category.createMany({
    data: categories,
  });

  // 3. Додаткові опції
  await prisma.additionally.createMany({
    data: _additionally,
  });

  // 🔥 4. ФІЛЬТРИ (Тепер беремо з constants.ts)
  await prisma.filterOption.createMany({
    data: filterOptions,
  });

  // Отримуємо створені фільтри з ID
  const allFilters = await prisma.filterOption.findMany();

  const categoryAdditionallyMap: CategoryAdditionallyMap = {
    1: [1, 2, 3, 4], // Дивани
    2: [5, 6, 7], // Столи
    3: [8, 9], // Шафи
    4: [10, 11], // Ліжка
    5: [], // Крісла
    6: [], // Полиці
    7: [12, 13, 14, 15], // Садові меблі
  };

  // 5. ПРОДУКТИ
  const createdProducts = await Promise.all(
    products.map(async (product) => {
      // @ts-ignore
      const tags = product._filterTags || [];
      const categoryId = product.categoryId;

      const connectFilters = allFilters
        .filter((f) => tags.includes(f.value))
        .map((f) => ({ id: f.id }));

      const additionallyIds = categoryAdditionallyMap[categoryId] || [];

      return prisma.product.create({
        data: {
          name: product.name,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,

          // 🔥 ДОДАЙ ЦЕЙ РЯДОК:
          // @ts-ignore (бо в типі products в constants.ts цього поля може ще не бути в типах TS)
          description: product.description || "Brak opisu",

          // 🔥 ВИПРАВЛЕННЯ: Просто передаємо рядок, без JSON.parse
          options: product.options || undefined,

          additionally: {
            connect: additionallyIds.map((id) => ({ id })),
          },
          filterOptions: {
            connect: connectFilters,
          },
        },
      });
    }),
  );

  // 6. Варіанти (ProductItems)
  for (const product of createdProducts) {
    const optionsWithPrices = processProductOptions(product.options);

    if (optionsWithPrices.length > 0) {
      await prisma.productItem.createMany({
        data: optionsWithPrices.map((option) => ({
          productId: product.id,
          price: option.price,
          options: option.name,
          stock: Math.floor(Math.random() * 16),
        })),
      });
    } else {
      await prisma.productItem.create({
        data: {
          productId: product.id,
          price: randomDecimalNumber(500, 5000),
          options: product.options,
          stock: Math.floor(Math.random() * 16),
        },
      });
    }
  }

  // 7. Кошики
  await prisma.cart.createMany({
    data: [
      { userId: 1, totalAmount: 0, token: "11111" },
      { userId: 2, totalAmount: 0, token: "222222" },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      additionally: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Additionally" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "FilterOption" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    console.log("🗑️  Базу даних очищено");
    await up();
    console.log("✅ Базу даних успішно заповнено з constants.ts!");
  } catch (e) {
    console.error("❌ Помилка:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
