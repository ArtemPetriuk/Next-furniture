import prisma from "../../../../../prisma/prisma-client";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Перевіряємо, чи всі поля заповнені
    if (!data.email || !data.password || !data.fullName) {
      return NextResponse.json(
        { message: "Заповніть усі поля" },
        { status: 400 },
      );
    }

    // 2. Перевіряємо, чи немає вже такого користувача в базі
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return NextResponse.json(
        { message: "Користувач з такою поштою вже існує" },
        { status: 400 },
      );
    }

    // 3. Шифруємо пароль (щоб не зберігати "123456")
    const hashedPassword = await hash(data.password, 10);

    // 4. Створюємо користувача
    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        role: "USER",
        provider: "credentials",
      },
    });

    return NextResponse.json(
      { message: "Успішна реєстрація" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error [REGISTER]", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
