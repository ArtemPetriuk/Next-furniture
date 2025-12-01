import { Additionally, Product, ProductItem } from "@prisma/client";

export type ProductWithRelations = Product & {
  items: ProductItem[];
  additionally: Additionally[];
};
