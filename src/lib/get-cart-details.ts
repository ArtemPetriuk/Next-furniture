import { Cart } from "@prisma/client";

export type CartStateItem = {
  additionally: {
    name: string;
    id: number;
    price: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  disabled?: boolean;
  variantTitle?: string;

  // 👇 ДОДАЄМО ЦЕ, щоб твій CheckoutPage не ламався
  productItem: {
    price: number;
    product: {
      name: string;
      imageUrl: string;
    };
  };
};

interface ReturnProps {
  items: CartStateItem[];
  totalAmount: number;
}

export const getCartDetails = (data: any): ReturnProps => {
  const items = data.items.map((item: any) => ({
    id: item.id,
    quantity: item.quantity,
    price: item.productItem.price,
    imageUrl: item.productItem.product.imageUrl,
    name: item.productItem.product.name,
    disabled: false,
    additionally: item.additionally,
    variantTitle: item.productItem.options,

    // 👇 ВАЖЛИВО: Передаємо вкладений об'єкт далі,
    // бо в компоненті ти звертаєшся до item.productItem.product
    productItem: {
      price: item.productItem.price,
      product: {
        name: item.productItem.product.name,
        imageUrl: item.productItem.product.imageUrl,
      },
    },
  })) as CartStateItem[];

  return {
    items,
    totalAmount: data.totalAmount,
  };
};
