import prisma from "../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserSession } from "@/lib/get-user-session";
import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";
import { findOrCreateCart } from "@/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/components/shared/services/dto/cart.dto";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      return NextResponse.json({ items: [] });
    }

    // 1. Отримуємо кошик
    const userCart = await prisma.cart.findFirst({
      where: { token: cartToken },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
          include: {
            productItem: { include: { product: true } },
            additionally: true,
          },
        },
      },
    });

    if (!userCart) {
      return NextResponse.json({ items: [] });
    }

    // 2. Отримуємо сесію, щоб дізнатися, чи це залогований юзер
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let userId: number | null = null;

    // 3. ЯКЩО ЮЗЕР ЗАЛОГОВАНИЙ: Шукаємо його реальний ID в базі
    if (token?.email) {
      const user = await prisma.user.findFirst({
        where: { email: token.email as string },
      });
      if (user) {
        userId = user.id;
      }
    }

    // 4. Перераховуємо суму (на випадок зміни цін в адмінці)
    const totalAmount = userCart.items.reduce((acc, item) => {
      const additionalPrice = item.additionally.reduce(
        (acc, opt) => acc + opt.price,
        0,
      );
      return acc + (item.productItem.price + additionalPrice) * item.quantity;
    }, 0);

    // 5. Оновлюємо кошик (прив'язуємо до userId ТІЛЬКИ якщо ми його знайшли)
    const updatedCart = await prisma.cart.update({
      where: { id: userCart.id },
      data: {
        totalAmount,
        ...(userId ? { userId } : {}), // Оновлюємо userId тільки якщо він існує і коректний
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
          include: {
            productItem: { include: { product: true } },
            additionally: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[CART_GET] Server Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = body as CreateCartItemValues;

  try {
    let token = req.cookies.get("cartToken")?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const cartItemsForProduct = await prisma.cartItem.findMany({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
      },
      include: {
        additionally: true,
      },
    });

    const additionallyIds = data.additionally || [];
    const findCartItem = cartItemsForProduct.find((item) => {
      const itemAdditionallyIds = item.additionally.map((a) => a.id).sort();
      const newAdditionallyIds = additionallyIds.sort();
      return (
        itemAdditionallyIds.length === newAdditionallyIds.length &&
        itemAdditionallyIds.every((id, idx) => id === newAdditionallyIds[idx])
      );
    });

    if (findCartItem) {
      await prisma.cartItem.update({
        where: { id: findCartItem.id },
        data: { quantity: findCartItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          quantity: 1,
          additionally: { connect: data.additionally?.map((id) => ({ id })) },
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updatedUserCart);
    // Використовуємо той самий токен для стабільності
    resp.cookies.set("cartToken", token, { path: "/" });
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Не вдалося додати в кошик" },
      { status: 500 },
    );
  }
}
