"use server";

import prisma from "@prisma/prisma-client";
import { revalidatePath } from "next/cache";

interface Variant {
  options: string; // 👈 Змінили color на options
  price: number;
  stock: number;
}

interface CreateProductData {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  additionallyIds: number[];
  variants: Variant[];
}

export async function createProduct(data: CreateProductData) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,

        items: {
          createMany: {
            data: data.variants.map((variant) => ({
              price: variant.price,
              stock: variant.stock,
              options: variant.options, // 👈 Передаємо значення в поле options
            })),
          },
        },

        // ⚠️ ПЕРЕВІР: якщо у тебе в схемі зв'язок називається не ingredients, а additionally, зміни це слово!
        additionally: {
          connect: data.additionallyIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/");

    return { success: true, productId: newProduct.id };
  } catch (error) {
    console.error("❌ [CREATE_PRODUCT_ERROR]", error);
    return { success: false, error: "Nie udało się stworzyć produktu." };
  }
}
