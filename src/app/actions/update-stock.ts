"use server";

import prisma from "@prisma/prisma-client";
import { revalidatePath } from "next/cache";

export async function updateStock(id: number, stock: number) {
  try {
    await prisma.productItem.update({
      where: { id },
      data: { stock: Number(stock) },
    });

    // Оновлюємо кеш сторінки, щоб дані були актуальними
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("problem with updating stock", error);
    return { success: false };
  }
}
