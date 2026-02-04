import prisma from "../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findOrCreateCart } from "@/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/components/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [{ token }],
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
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

    if (!userCart) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[API CART POST] body:", body);
  const data = body as CreateCartItemValues;
  try {
    let token = req.cookies.get("cartToken")?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    // Get all cart items for this product to manually check additionally match
    const cartItemsForProduct = await prisma.cartItem.findMany({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
      },
      include: {
        additionally: true,
      },
    });

    // Find exact match: same productItemId and exact same additionally items
    const additionallyIds = data.additionally || [];
    const findCartItem = cartItemsForProduct.find((item) => {
      const itemAdditionallyIds = item.additionally.map((a) => a.id).sort();
      const newAdditionallyIds = additionallyIds.sort();
      return (
        itemAdditionallyIds.length === newAdditionallyIds.length &&
        itemAdditionallyIds.every((id, idx) => id === newAdditionallyIds[idx])
      );
    });

    // if item found add +1
    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
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
    resp.cookies.set("cartToken", token);
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Nie udało się utworzyć koszyka" },
      { status: 500 },
    );
  }
}
