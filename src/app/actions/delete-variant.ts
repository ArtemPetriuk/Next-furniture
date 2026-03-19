"use server";

import prisma from "@prisma/prisma-client";
import { revalidatePath } from "next/cache";

export async function deleteVariant(id: number) {
  try {
    // 1. Знаходимо айтем, щоб дізнатися, до якого продукту він належить
    const itemToDelete = await prisma.productItem.findUnique({
      where: { id },
      select: { productId: true },
    });

    if (!itemToDelete) {
      return { success: false, error: "Wariant nie istnieje." };
    }

    // 2. Видаляємо конкретний варіант (ProductItem)
    await prisma.productItem.delete({
      where: { id },
    });

    // 3. Перевіряємо, чи залишилися ще якісь варіанти у цього продукту
    const remainingItems = await prisma.productItem.count({
      where: { productId: itemToDelete.productId },
    });

    // 4. Якщо варіантів більше немає — видаляємо сам продукт (Product)
    if (remainingItems === 0) {
      await prisma.product.delete({
        where: { id: itemToDelete.productId },
      });
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/"); // Оновлюємо головну, щоб товар зник, якщо він був останній

    return { success: true, wasProductDeleted: remainingItems === 0 };
  } catch (error) {
    console.error("❌ [DELETE_VARIANT_ERROR]", error);
    return {
      success: false,
      error: "Nie udało się usunąć. Możliwe, że produkt jest w koszyku.",
    };
  }
}
