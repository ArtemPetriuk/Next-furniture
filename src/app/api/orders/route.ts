import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import prisma from "@prisma/prisma-client";

// Ініціалізуємо Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = token?.sub ? Number(token.sub) : null;

    // 1. Шукаємо кошик
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

    // 2. Рахуємо точну суму (щоб ніхто не підмінив ціну на фронтенді)
    const orderItems = userCart.items.map((item) => {
      const additionalPrice = item.additionally.reduce(
        (acc, option) => acc + option.price,
        0,
      );
      const itemPrice = item.productItem.price + additionalPrice;

      return {
        ...item,
        price: itemPrice,
        productItem: {
          ...item.productItem,
          price: itemPrice,
        },
      };
    });

    // 3. Створюємо замовлення в БД
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        userId: userId,
        fullName: body.firstName + " " + body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        comment: body.comment,
        totalAmount: userCart.totalAmount,
        status: "PENDING",
        items: JSON.stringify(orderItems),
      },
    });

    // 4. Очищаємо кошик
    await prisma.cart.update({
      where: { id: userCart.id },
      data: { totalAmount: 0 },
    });
    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    // 👇 5. СТВОРЮЄМО ПОСИЛАННЯ НА ОПЛАТУ В STRIPE
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `Zamówienie #${order.id}`,
            },
            unit_amount: Math.round(userCart.totalAmount * 100), // Stripe хоче ціну в копійках (грошах)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success`, // Куди повернути після успіху
      cancel_url: `${process.env.NEXTAUTH_URL}/?paid=false`, // Куди повернути після відміни
      metadata: {
        order_id: order.id, // Запам'ятовуємо ID замовлення в Stripe
      },
    });

    // Повертаємо посилання на оплату
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[CHECKOUT_POST] Server Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
