import { render } from "@react-email/render";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import prisma from "@prisma/prisma-client";
import { getUserSession } from "@/lib/get-user-session";
import { Resend } from "resend";
import { OrderSuccessEmail } from "@/components/email/order-success";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);
const MONTAGE_PRICE = 499;
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

    // 1. Отримуємо коректний внутрішній ID користувача з бази даних
    let userId: number | null = null;
    if (token?.email) {
      const user = await prisma.user.findFirst({
        where: { email: token.email },
      });
      if (user) {
        userId = user.id; // Це буде валідний Int для бази даних
      }
    }

    // 2. Шукаємо кошик користувача
    const userCart = await prisma.cart.findFirst({
      where: { token: cartToken },
      include: {
        items: {
          include: {
            productItem: { include: { product: true } },
            additionally: true,
          },
        },
      },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 3. Розрахунок цін
    const orderItems = userCart.items.map((item) => {
      const additionalPrice = item.additionally.reduce(
        (acc, opt) => acc + opt.price,
        0,
      );
      const itemPrice = item.productItem.price + additionalPrice;

      return {
        ...item,
        price: itemPrice,
        productItem: { ...item.productItem, price: itemPrice },
      };
    });

    const finalTotalAmount =
      userCart.totalAmount + (body.isMontageEnabled ? MONTAGE_PRICE : 0);

    // 4. ТРАНЗАКЦІЯ
    const order = await prisma.$transaction(async (tx) => {
      for (const item of userCart.items) {
        const productItem = await tx.productItem.findUnique({
          where: { id: item.productItemId },
        });

        if (!productItem || productItem.stock < item.quantity) {
          throw new Error(`Товар закінчився на складі`);
        }

        await tx.productItem.update({
          where: { id: item.productItemId },
          data: { stock: { decrement: item.quantity } }, // Віднімаємо 1 stock при покупці
        });
      }

      const newOrder = await tx.order.create({
        data: {
          token: cartToken,
          userId: userId, // Тепер тут коректний Int
          fullName: body.firstName + " " + body.lastName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          comment: body.comment,
          totalAmount: finalTotalAmount,
          status: "PENDING",
          items: JSON.stringify(orderItems),
        },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: { totalAmount: 0 },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      return newOrder;
    });

    // 4. СТВОРЮЄМО СЕСІЮ ОПЛАТИ STRIPE
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: { name: `Zamówienie #${order.id}` },
            unit_amount: Math.round(finalTotalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: { order_id: order.id },
    });

    // 5. Відправка Email (опціонально)
    try {
      const emailHtml = await render(
        <OrderSuccessEmail
          orderId={order.id}
          totalAmount={finalTotalAmount}
          paymentUrl={session.url || ""}
        />,
      );

      await resend.emails.send({
        from: "Next Furniture <onboarding@resend.dev>",
        to: body.email,
        subject: `Next Furniture | Zamówienie #${order.id}`,
        html: emailHtml,
      });
    } catch (err) {
      console.error(" [EMAIL ERROR]", err);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[CHECKOUT_POST] Error", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ message: "Nieautoryzowane" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: Number(session.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
