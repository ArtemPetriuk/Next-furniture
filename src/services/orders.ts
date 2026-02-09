import { CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";

export const createOrder = async (data: CheckoutFormValues) => {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Nie udało się złożyć zamówienia");
  }

  return response.json();
};
