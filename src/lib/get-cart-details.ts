import {
  Cart,
  CartItem,
  Additionally,
  Product,
  ProductItem,
} from "@prisma/client";

export type CartStateItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  disabled?: boolean;

  // Повертаємо масив додатків
  additionally: Array<{
    name: string;
    price: number;
  }>;

  // 👇 ГОЛОВНЕ ВИПРАВЛЕННЯ ТУТ
  productItem: {
    id: number;
    price: number;
    // Додаємо options сюди, щоб TypeScript не сварився
    options?: string | null;
    product: {
      id: number;
      name: string;
      imageUrl: string;
      slug: string;
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

    // Мапимо додатки
    additionally: item.additionally.map((ingredient: any) => ({
      name: ingredient.name,
      price: ingredient.price,
    })),

    // 👇 ВАЖЛИВО: Передаємо структуру так, як її чекають компоненти
    productItem: {
      id: item.productItem.id,
      price: item.productItem.price,
      product: {
        id: item.productItem.product.id,
        name: item.productItem.product.name,
        imageUrl: item.productItem.product.imageUrl,
        slug: item.productItem.product.slug,
      },
      // Ось тут ми передаємо варіант (колір/розмір) з бази в компонент
      options: item.productItem.options,
    },
  })) as CartStateItem[];

  return {
    items,
    totalAmount: data.totalAmount,
  };
};
