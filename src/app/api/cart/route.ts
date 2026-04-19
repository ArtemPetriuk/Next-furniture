import prisma from "../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";
import { findOrCreateCart } from "@/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/components/shared/services/dto/cart.dto";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    let cartToken = cookieStore.get("cartToken")?.value;

    // 1. Перевіряємо сесію
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let userId: number | null = null;

    if (token?.email) {
      const user = await prisma.user.findFirst({
        where: { email: token.email as string },
      });
      if (user) {
        userId = user.id;
      }
    }

    // 2. Шукаємо обидва кошики
    let dbUserCart = null;
    if (userId) {
      dbUserCart = await prisma.cart.findFirst({ where: { userId } });
    }

    let tokenCart = null;
    if (cartToken) {
      tokenCart = await prisma.cart.findFirst({ where: { token: cartToken } });
    }

    // --- НОВА ЛОГІКА: ПРІОРИТЕТ АКАУНТУ (БЕЗ ЗЛИТТЯ) ---
    let currentCartId = null;

    if (userId && dbUserCart) {
      // Якщо юзер залогований і має свій кошик в базі
      currentCartId = dbUserCart.id;
      cartToken = dbUserCart.token as string; // Беремо токен з акаунта (додали as string)

      // Видаляємо гостьовий кошик, якщо він існує і він інший
      // Видаляємо гостьовий кошик, якщо він існує і він інший
      if (tokenCart && tokenCart.id !== dbUserCart.id) {
        // 🔥 ФІКС: Спочатку очищаємо кошик від товарів
        await prisma.cartItem.deleteMany({ where: { cartId: tokenCart.id } });
        // Тепер безпечно видаляємо сам пустий кошик
        await prisma.cart.delete({ where: { id: tokenCart.id } });
      }
    } else if (userId && !dbUserCart && tokenCart) {
      // Якщо у юзера ще немає кошика в акаунті, але він щось накидав гостем
      // Прив'язуємо цей гостьовий кошик до нього
      await prisma.cart.update({
        where: { id: tokenCart.id },
        data: { userId },
      });
      currentCartId = tokenCart.id;
    } else if (tokenCart) {
      // Звичайний гість
      currentCartId = tokenCart.id;
    }

    if (!currentCartId) {
      return NextResponse.json({ items: [] });
    }

    // 3. Отримуємо фінальний кошик
    const finalCart = await prisma.cart.findFirst({
      where: { id: currentCartId },
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

    if (!finalCart) {
      return NextResponse.json({ items: [] });
    }

    // 4. Перерахунок суми
    const totalAmount = finalCart.items.reduce((acc, item) => {
      const additionalPrice = item.additionally.reduce(
        (a, opt) => a + opt.price,
        0,
      );
      return acc + (item.productItem.price + additionalPrice) * item.quantity;
    }, 0);

    const updatedCart = await prisma.cart.update({
      where: { id: finalCart.id },
      data: { totalAmount },
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

    const response = NextResponse.json(updatedCart);

    // Оновлюємо куку, щоб вона завжди відповідала поточному кошику
    if (cartToken) {
      response.cookies.set("cartToken", cartToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
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
