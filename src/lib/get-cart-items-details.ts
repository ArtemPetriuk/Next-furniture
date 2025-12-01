import { Additionally } from "@prisma/client";

export const getCartItemDetails = (additionally: Additionally[]): string => {
  const details = [];

  if (additionally) {
    details.push(...additionally.map((additionally) => additionally.name));
  }

  return details.join(", ");
};
