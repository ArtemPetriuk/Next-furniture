import {
  Cart,
  CartItem,
  Additionally,
  Product,
  ProductItem,
} from "@prisma/client";

export type CartItemDTO = CartItem & {
  productItem: ProductItem & {
    product: Product;
  };
  additionally: Additionally[];
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productItemId: number;
  additionally?: number[];
  options?: Record<string, any>;
  quantity?: number; // <- тепер поле quantity дозволене
}
