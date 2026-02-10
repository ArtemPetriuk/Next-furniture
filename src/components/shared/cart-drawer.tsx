"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { Title } from "./title";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/lib/get-cart-items-details";
import { Additionally } from "@prisma/client";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    totalAmount,
    updateItemQuantity,
    items,
    removeCartItem,
    addCartItem,
  } = useCart();
  const [redirecting, setRedirecting] = React.useState(false);

  // React.useEffect(() => {

  // }, []);

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between bg-[#F4F1EE] pb-0">
        <div
          className={cn(
            "flex h-full flex-col",
            !totalAmount && "justify-center",
          )}
        >
          {totalAmount > 0 && (
            <SheetHeader>
              <SheetTitle>
                w koszyku{" "}
                <span className="font-bold">{items.length} towaru</span>
              </SheetTitle>
            </SheetHeader>
          )}

          {!totalAmount && (
            <div className="mx-auto flex w-72 flex-col items-center justify-center">
              <Image
                src="/images/pngwing.com (1).png"
                alt="Empty cart"
                width={120}
                height={120}
              />
              <Title
                size="sm"
                text="Koszyk jest pusty"
                className="my-2 text-center font-bold"
              />
              <p className="mb-5 text-center text-neutral-500">
                Dodaj co najmniej jeden mebel, aby złożyć zamówienie
              </p>

              <SheetClose>
                <Button className="h-12 w-56 text-base" size="lg">
                  <ArrowLeft className="mr-2 w-5" />
                  Wróć
                </Button>
              </SheetClose>
            </div>
          )}

          {totalAmount > 0 && (
            <>
              <div className="-mx-6 mt-5 flex-1 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="mb-2">
                    <CartDrawerItem
                      id={item.id}
                      imageUrl={item.imageUrl}
                      details={getCartItemDetails(
                        item.additionally as Additionally[],
                        item.productItem.options,
                      )}
                      disabled={item.disabled}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      additionally={item.additionally as Additionally[]}
                      onClickCountButton={(type) =>
                        onClickCountButton(item.id, item.quantity, type)
                      }
                      onClickRemove={() => removeCartItem(item.id)}
                    />
                  </div>
                ))}
              </div>

              <SheetFooter className="-mx-6 bg-white p-8">
                <div className="w-full">
                  <div className="mb-4 flex">
                    <span className="flex flex-1 text-lg text-neutral-500">
                      Razem
                      <div className="relative -top-1 mx-2 flex-1 border-b border-dashed border-b-neutral-200" />
                    </span>

                    <span className="text-lg font-bold">{totalAmount} Zł</span>
                  </div>

                  <Link href="/checkout">
                    <Button
                      onClick={() => setRedirecting(true)}
                      loading={redirecting}
                      type="submit"
                      className="h-12 w-full text-base"
                    >
                      Złożyć zamówienie
                      <ArrowRight className="ml-2 w-5" />
                    </Button>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
