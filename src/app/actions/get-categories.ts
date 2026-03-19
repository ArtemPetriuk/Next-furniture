"use server";

import prisma from "@prisma/prisma-client";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" }, // Сортуємо за алфавітом
    });

    return { success: true, categories };
  } catch (error) {
    console.error("❌ [GET_CATEGORIES_ERROR]", error);
    return { success: false, categories: [] };
  }
}
