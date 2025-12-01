import { CartItemDTO } from "@/components/shared/services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  const additionallyPrice = item.additionally.reduce(
    (acc, additionally) => acc + additionally.price,
    0
  );

  return (additionallyPrice + item.productItem.price) * item.quantity;
};
