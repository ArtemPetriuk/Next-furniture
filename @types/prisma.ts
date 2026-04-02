import { Additionally, Product, ProductItem, Color } from "@prisma/client";

export type ProductWithRelations = Product & {
  items: ProductItem[];
  additionally: Additionally[];
  colors: Color[];
};
