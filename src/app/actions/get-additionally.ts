"use server";

import prisma from "@prisma/prisma-client";

export async function getAdditionally() {
  try {
    // ⚠️ ВАЖЛИВО: Перевір назву моделі в schema.prisma (Ingredient чи Additionally)
    const items = await prisma.additionally.findMany({
      // АБО prisma.ingredient.findMany
      orderBy: { name: "asc" },
    });

    return { success: true, items };
  } catch (error) {
    console.error("❌ [GET_ADDITIONALLY_ERROR]", error);
    return { success: false, items: [] };
  }
}
