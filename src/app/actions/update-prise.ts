"use server";

import prisma from "../../../prisma/prisma-client"; // Виправив шлях імпорту для чистоти
import { revalidatePath } from "next/cache";

export async function updatePrice(id: number, price: number) {
  try {
    await prisma.productItem.update({
      where: { id },
      data: { price: Number(price) },
    });

    // Оновлюємо кеш сторінки, щоб ціна змінилася миттєво
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("problem with updating price:", error);
    return { success: false };
  }
}
