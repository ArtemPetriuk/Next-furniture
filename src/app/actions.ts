"use server";

import prisma from "../../prisma/prisma-client";
import { getUserSession } from "@/lib/get-user-session";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Користувача не знайдено");
    }

    const userId = Number(currentUser.id);

    // Шукаємо користувача в базі
    const findUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    // Готуємо дані для оновлення
    const updateData: Prisma.UserUpdateInput = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone, // Нове поле
      address: body.address, // Нове поле
    };

    // Якщо користувач міняє пароль
    if (body.password) {
      updateData.password = hashSync(body.password as string, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  } catch (error) {
    console.error("[UPDATE_USER_INFO] Error:", error);
    throw error;
  }
}
