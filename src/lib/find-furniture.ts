import prisma from "@prisma/prisma-client"; // Переконайся, що шлях правильний

export interface GetSearchParams {
  rooms?: string;
  office_zones?: string;
  cafe_zones?: string;
  hotel_zones?: string;
  priceFrom?: string;
  priceTo?: string;
}

export const findFurniture = async (params: GetSearchParams) => {
  // 1. Збираємо всі вибрані галочки в один масив
  const selectedFilters = [
    ...(params.rooms?.split(",") || []),
    ...(params.office_zones?.split(",") || []),
    ...(params.cafe_zones?.split(",") || []),
    ...(params.hotel_zones?.split(",") || []),
  ];

  // Визначаємо ціни (або дефолтні значення)
  const minPrice = Number(params.priceFrom) || 0;
  const maxPrice = Number(params.priceTo) || 10000;

  // 2. Робимо запит до бази даних
  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: 'desc',
        },
        where: {
          // Фільтр по ціні (шукаємо у варіантах items)
          items: {
            some: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
          },
          // Фільтрація по тегах (selectedFilters)
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
          items: true,        // Щоб знати ціну і варіанти
          additionally: true, // Щоб показувати додатки в модалці
        },
      },
    },
  });

  // 3. Прибираємо порожні категорії і повертаємо результат
  return categories.filter((category) => category.products.length > 0);
};