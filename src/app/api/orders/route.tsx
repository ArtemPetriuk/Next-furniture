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
    const userId = token?.sub ? Number(token.sub) : null;

    // 1. Шукаємо кошик користувача
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

    // 2. Рахуємо точну суму для замовлення
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

    const finalTotalAmount =
      userCart.totalAmount + (body.isMontageEnabled ? MONTAGE_PRICE : 0);

    // 3. Створюємо замовлення в БД
    // Використовуємо body.phone та body.address, щоб дозволити редагування
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        userId: userId,
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

    await prisma.cart.update({
      where: { id: userCart.id },
      data: { totalAmount: 0 },
    });
    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    // 5. СТВОРЮЄМО СЕСІЮ ОПЛАТИ STRIPE
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `Zamówienie #${order.id}`,
            },
            unit_amount: Math.round(finalTotalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Передаємо orderId для відображення на сторінці успіху
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: {
        order_id: order.id,
      },
    });

    // 6. Відправка Email через Resend
    try {
      const emailHtml = await render(
        <OrderSuccessEmail
          orderId={order.id}
          totalAmount={userCart.totalAmount}
          paymentUrl={session.url || ""}
        />,
      );

      await resend.emails.send({
        from: "Next Furniture <onboarding@resend.dev>",
        to: body.email,
        subject: `Next Furniture | Zamówienie #${order.id}`,
        html: emailHtml,
      });

      console.log("✅ [RESEND SUCCESS] Email sent to:", body.email);
    } catch (err) {
      console.error("❌ [EMAIL ERROR]", err);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[CHECKOUT_POST] Server Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
