import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../prisma/prisma-client";
import { getToken } from "next-auth/jwt"; // 👈 Використовуємо це

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      return NextResponse.json(
        { error: "Cart token not found" },
        { status: 404 },
      );
    }

    // 👇 Розшифровуємо токен за допомогою нашого ключа з .env
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Якщо токен є — беремо ID, якщо ні — null
    const userId = token?.sub ? Number(token.sub) : null;

    console.log("Знайдений UserID:", userId);

    // --- Далі стандартна логіка ---
    const userCart = await prisma.cart.findFirst({
      where: { token: cartToken },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            additionally: true,
          },
        },
      },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        token: cartToken,
        userId: userId, // 👈 Записуємо ID

        fullName: body.firstName + " " + body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        comment: body.comment,
        totalAmount: userCart.totalAmount,
        status: "PENDING",
        items: JSON.stringify(userCart.items),
      },
    });

    await prisma.cart.update({
      where: { id: userCart.id },
      data: { totalAmount: 0 },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.log("[CHECKOUT_POST] Server Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
