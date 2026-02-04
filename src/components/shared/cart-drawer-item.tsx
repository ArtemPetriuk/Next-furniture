"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Additionally } from "@prisma/client";

import * as CartItem from "./cart-item-details";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButton } from "./count-button";
import { Trash2Icon } from "lucide-react";

interface Props extends CartItemProps {
  className?: string;
  onClickCountButton?: (type: "plus" | "minus") => void;
  onClickRemove?: () => void;
  additionally?: Additionally[];
  variantTitle?: string;
}

export const CartDrawerItem: React.FC<Props> = ({
  imageUrl,
  name,
  price,
  quantity,
  details,
  disabled,
  className,
  onClickRemove,
  onClickCountButton,
  additionally,
  variantTitle,
}) => {
  const additionallyPrice = additionally
    ? additionally.reduce((sum, item) => sum + item.price, 0)
    : 0;
  const totalPrice = (price + additionallyPrice) * quantity;

  return (
    <div
      className={cn(
        "flex gap-6 bg-white p-5",
        {
          "pointer-events-none opacity-50": disabled,
        },
        className,
      )}
    >
      <CartItem.Image src={imageUrl} />

      <div className="flex-1">
        <CartItem.Info name={name} details={details} variant={variantTitle} />

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <CountButton onClick={onClickCountButton} value={quantity} />

          <div className="flex items-center gap-3">
            <CartItem.Price value={totalPrice} />
            <Trash2Icon
              onClick={onClickRemove}
              className="cursor-pointer text-gray-400 hover:text-gray-600"
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
