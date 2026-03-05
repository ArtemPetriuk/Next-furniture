"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutFormSchema,
  CheckoutFormValues,
} from "@/components/shared/checkout/checkout-form-schema";
import { Container } from "@/components/shared/container";
import { useCartStore } from "@/components/shared/store/cart";
import { toast } from "sonner";
import { CheckoutCart } from "@/components/shared/checkout/checkout-cart";
import { CheckoutPersonalForm } from "@/components/shared/checkout/checkout-personal-form";
import { CheckoutAddressForm } from "@/components/shared/checkout/checkout-address-form";
import { CheckoutSidebar } from "@/components/shared/checkout/checkout-sidebar";

interface Props {
  userData: CheckoutFormValues;
}

export function CheckoutClient({ userData }: Props) {
  const {
    items,
    totalAmount,
    updateItemQuantity,
    removeCartItem,
    fetchCartItems,
    loading,
  } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: userData, // 🔥 Дані підтягуються, але їх МОЖНА змінювати
  });
  const [isMontage, setIsMontage] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCartItems();
  }, [fetchCartItems]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      // Відправляємо саме ті дані, які користувач бачить в інпутах
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Об'єднуємо дані форми (data) та стан монтажу (isMontage) в один об'єкт
        body: JSON.stringify({
          ...data,
          isMontageEnabled: isMontage,
        }),
      });

      const responseData = await response.json();
      if (responseData.url) {
        location.href = responseData.url; // Перехід на Stripe
      }
    } catch (err) {
      toast.error("Nie udało się stworzyć zamówienia");
    }
  };

  if (!mounted) return null;

  return (
    <Container className="mb-20 mt-10">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-12">
            <CheckoutCart
              items={items}
              loading={loading}
              onClickCountButton={updateItemQuantity}
              removeCartItem={removeCartItem}
              isMontageEnabled={isMontage}
              setIsMontageEnabled={setIsMontage}
            />
            <section className="space-y-8">
              <h2 className="text-2xl font-bold">2. Dane do dostawy</h2>
              <CheckoutPersonalForm form={form} />
              <CheckoutAddressForm form={form} />
            </section>
          </div>
          <CheckoutSidebar
            totalAmount={totalAmount}
            loading={loading}
            isSubmitting={form.formState.isSubmitting}
            isMontageEnabled={isMontage}
            disabled={loading || form.formState.isSubmitting}
          />
        </div>
      </form>
    </Container>
  );
}
