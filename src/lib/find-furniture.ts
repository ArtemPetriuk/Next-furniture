import prisma from "../../prisma/prisma-client"; // 👇 Використовуємо наш налаштований клієнт

export interface GetSearchParams {
  sortBy?: string;
  rooms?: string;
  office_zones?: string;
  cafe_zones?: string;
  hotel_zones?: string;
  priceFrom?: string;
  priceTo?: string;
}

export const findFurniture = async (params: GetSearchParams) => {
  // 1. Збираємо всі вибрані галочки (фільтри) в один масив
  const selectedFilters = [
    ...(params.rooms?.split(",") || []),
    ...(params.office_zones?.split(",") || []),
    ...(params.cafe_zones?.split(",") || []),
    ...(params.hotel_zones?.split(",") || []),
  ];

  // Визначаємо ціни
  const minPrice = Number(params.priceFrom) || 0;
  const maxPrice = Number(params.priceTo) || 100000;

  // 2. Робимо запит до бази даних (ТВІЙ КОД ФІЛЬТРАЦІЇ)
  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc", // Сортування за замовчуванням (нові зверху)
        },
        where: {
          // Фільтр по ціні
          items: {
            some: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
          },
          // Фільтрація по тегах/зонах (твоя логіка)
          ...(selectedFilters.length > 0
            ? {
                filterOptions: {
                  some: {
                    value: {
                      in: selectedFilters,
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          items: true,
          additionally: true,
        },
      },
    },
  });

  // 3. 👇 ДОДАВ: ЛОГІКА СОРТУВАННЯ (Price ASC / DESC)
  const sortBy = params.sortBy;

  if (sortBy) {
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
  }

  // 4. Прибираємо порожні категорії і повертаємо результат
  return categories.filter((category) => category.products.length > 0);
};
