"use server";

import prisma from "@prisma/prisma-client";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(id: number, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Odświeżamy cache dla strony zamówień
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Błąd podczas aktualizacji statusu:", error);
    return { success: false };
  }
}
