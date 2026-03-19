"use server";

import prisma from "@prisma/prisma-client";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  productId: number;
  userId: number;
  rating: number;
  text: string;
}) {
  try {
    await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        text: data.text,
      },
    });

    revalidatePath(`/product/${data.productId}`);
    return { success: true };
  } catch (error) {
    console.error(" [CREATE_REVIEW_ERROR]", error);
    return { success: false, error: "Nie udało się dodać opinii." };
  }
}
