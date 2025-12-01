import { Prisma } from "@prisma/client";
import prisma from "./prisma-client";
import { hashSync } from "bcrypt";
import { _additionally, products, categories } from "./constants";

interface CategoryAdditionallyMap {
  [key: number]: number[];
}

const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

// Нова функція для обробки опцій з цінами
const processProductOptions = (options: string | null) => {
  if (!options) return [];

  try {
    const parsedOptions = JSON.parse(options);

    // Якщо це масив об'єктів з name та price
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

    // Якщо це просто масив рядків (для зворотної сумісності)
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
  // Створення користувачів
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

  // Створення категорій
  await prisma.category.createMany({
    data: categories,
  });

  // Створення додаткових опцій
  await prisma.additionally.createMany({
    data: _additionally,
  });

  // Мапа додаткових опцій
  const categoryAdditionallyMap: CategoryAdditionallyMap = {
    1: [1, 2, 3, 4], // Дивани
    2: [5, 6, 7], // Столи
    3: [8, 9], // Шафи
    4: [10, 11], // Ліжка
    5: [], // Крісла
    6: [], // Полиці
    7: [12, 13, 14, 15], // Садові меблі
  };

  // Створення продуктів
  const createdProducts = await Promise.all(
    products.map(async (product) => {
      const additionallyIds = categoryAdditionallyMap[product.categoryId] || [];

      return prisma.product.create({
        data: {
          name: product.name,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          options: product.options || null,
          additionally: {
            connect: additionallyIds.map((id) => ({ id })),
          },
        },
      });
    })
  );

  // Створення варіантів продуктів (ProductItem) з цінами
  for (const product of createdProducts) {
    const optionsWithPrices = processProductOptions(product.options);

    if (optionsWithPrices.length > 0) {
      await prisma.productItem.createMany({
        data: optionsWithPrices.map((option) => ({
          productId: product.id,
          price: option.price,
          options: option.name,
        })),
      });
    } else {
      // Якщо опцій немає, створюємо один продукт з випадковою ціною
      await prisma.productItem.create({
        data: {
          productId: product.id,
          price: randomDecimalNumber(500, 5000),
          options: product.options, // або просто null, якщо ви хочете
        },
      });
    }
  }

  // Створення кошиків
  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: "11111",
      },
      {
        userId: 2,
        totalAmount: 0,
        token: "222222",
      },
    ],
  });

  // Додаємо товари до кошика (для тестування)
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
}

async function main() {
  try {
    await down();
    console.log("Базу даних очищено");
    await up();
    console.log("Базу даних успішно заповнено");
  } catch (e) {
    console.error("Помилка при заповненні бази даних:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
