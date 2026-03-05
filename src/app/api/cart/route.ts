import prisma from "../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserSession } from "@/lib/get-user-session";
import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";
import { findOrCreateCart } from "@/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/components/shared/services/dto/cart.dto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const user = await getUserSession();
    const userId = user?.id ? Number(user.id) : null;

    let userCart;

    if (userId) {
      const actualUser = await prisma.user.findFirst({ where: { id: userId } });
      // 1. Шукаємо кошик користувача за userId
      userCart = await prisma.cart.findFirst({
        where: { userId },
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

      // 2. Якщо у юзера в акаунті НЕМАЄ кошика, але є анонімний у куках
      if (!userCart && token) {
        const anonymousCart = await prisma.cart.findFirst({
          where: { token, userId: null },
        });

        if (anonymousCart) {
          // Прив'язуємо анонімний кошик до юзера
          userCart = await prisma.cart.update({
            where: { id: anonymousCart.id },
            data: { userId },
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
        }
      }
    } else if (token) {
      // 3. Якщо анонім — просто за токеном
      userCart = await prisma.cart.findFirst({
        where: { token },
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
    }

    if (!userCart) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const resp = NextResponse.json(userCart);

    // Вирішуємо помилку TS зі скріншота
    if (userCart.token) {
      resp.cookies.set("cartToken", userCart.token, { path: "/" });
    }

    return resp;
  } catch (error) {
    console.error("[CART GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
