"use server";

import prisma from "@prisma/prisma-client"; // Poprawiony import!
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: number) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const safeEmail = String(session.user.email).trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: safeEmail },
    });

    if (!user || !user.id) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      revalidatePath("/");
      return { success: true, isFavorite: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: productId,
        },
      });
      revalidatePath("/");
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("[BŁĄD KRYTYCZNY PRISMY]:", error);
    return { success: false, error: "INTERNAL_ERROR" };
  }
}
