import prisma from "../../prisma/prisma-client";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  priceFrom?: string;
  priceTo?: string;
}

export const findFurniture = async (params: GetSearchParams) => {
  const minPrice = Number(params.priceFrom) || 0;
  const maxPrice = Number(params.priceTo) || 100000;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc",
        },
        where: {
          items: {
            some: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
          },
        },
        include: {
          items: true,
          // 👇 ВИПРАВЛЕННЯ: замість ingredients пишемо additionally
          additionally: true,
        },
      },
    },
  });

  const sortBy = params.sortBy;

  // 👇 ВИПРАВЛЕННЯ: Додали перевірку на типи
  categories.forEach((category) => {
    if (sortBy === "price_asc") {
      category.products.sort((a, b) => {
        const priceA = a.items[0]?.price || 0;
        const priceB = b.items[0]?.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price_desc") {
      category.products.sort((a, b) => {
        const priceA = a.items[0]?.price || 0;
        const priceB = b.items[0]?.price || 0;
        return priceB - priceA;
      });
    }
  });

  return categories;
};
