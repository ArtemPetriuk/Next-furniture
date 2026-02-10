import { Additionally } from "@prisma/client";

export const getCartItemDetails = (
  additionally: Additionally[],
  variant?: string | null,
): string => {
  const details = [];

  if (variant) {
    details.push(variant);
  }

  if (additionally) {
    details.push(...additionally.map((additionally) => additionally.name));
  }

  return details.join(", ");
};
