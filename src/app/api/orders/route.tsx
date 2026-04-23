import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import prisma from "@prisma/prisma-client";
import { getUserSession } from "@/lib/get-user-session";
import { sendOrderCreatedEmail } from "@/lib/mail"; // <-- Імпортуємо нашу нову функцію

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const MONTAGE_PRICE = 499;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      return NextResponse.json(
        { error: "Nie znaleziono tokenu koszyka" },
        { status: 404 }
      );
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 1. Pobieramy poprawne wewnętrzne ID użytkownika z bazy danych
    let userId: number | null = null;
    if (token?.email) {
      const user = await prisma.user.findFirst({
        where: { email: token.email },
      });
      if (user) {
        userId = user.id;
      }
    }

    // 2. Wyszukujemy koszyk użytkownika
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
      return NextResponse.json({ error: "Koszyk jest pusty" }, { status: 400 });
    }

    // 3. Obliczanie cen
    const orderItems = userCart.items.map((item) => {
      const additionalPrice = item.additionally.reduce(
        (acc, opt) => acc + opt.price,
        0
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

    // 4. TRANSAKCJA
    const order = await prisma.$transaction(async (tx) => {
      for (const item of userCart.items) {
        const productItem = await tx.productItem.findUnique({
          where: { id: item.productItemId },
        });

        if (!productItem || productItem.stock < item.quantity) {
          throw new Error(`Brak produktu na magazynie`); // Переклад помилки складу
        }

        await tx.productItem.update({
          where: { id: item.productItemId },
          data: { stock: { decrement: item.quantity } }, // Odejmujemy ilość sztuk z magazynu
        });
      }

      const newOrder = await tx.order.create({
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

      await tx.cart.update({
        where: { id: userCart.id },
        data: { totalAmount: 0 },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      return newOrder;
    });

    // 5. TWORZENIE SESJI PŁATNOŚCI STRIPE
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

    // 6. Wysyłanie e-maila z potwierdzeniem utworzenia (wyклик функції з іншого файлу)
    await sendOrderCreatedEmail(body.email, order.id, finalTotalAmount, session.url || "");

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[CHECKOUT_POST] Error", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Wewnętrzny błąd serwera",
      },
      { status: 500 }
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
      { message: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}