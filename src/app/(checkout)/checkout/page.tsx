"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutFormSchema,
  CheckoutFormValues,
} from "@/components/shared/checkout/checkout-form-schema";

import { Container } from "@/components/shared/container";
import { useCartStore } from "@/components/shared/store/cart";
import { createOrder } from "@/services/orders";
import { toast } from "sonner";

// 👇 Імпортуємо наші нові компоненти
import { CheckoutCart } from "@/components/shared/checkout/checkout-cart";
import { CheckoutPersonalForm } from "@/components/shared/checkout/checkout-personal-form";
import { CheckoutAddressForm } from "@/components/shared/checkout/checkout-address-form";
import { CheckoutSidebar } from "@/components/shared/checkout/checkout-sidebar";

export default function CheckoutPage() {
  const {
    items,
    totalAmount,
    updateItemQuantity,
    removeCartItem,
    fetchCartItems,
    loading,
  } = useCartStore((state) => state);
  const [isMontageEnabled, setIsMontageEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  useEffect(() => {
    setMounted(true);
    fetchCartItems();
  }, [fetchCartItems]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);

      // 1. Відправляємо дані на наш оновлений бекенд
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // 2. Отримуємо відповідь (там тепер лежить { url: "https://checkout.stripe.com/..." })
      const responseData = await response.json();
      const paymentUrl = responseData.url;

      if (paymentUrl) {
        // 3. Перекидаємо користувача на Stripe! 🚀
        location.href = paymentUrl;
      } else {
        // Якщо посилання немає (наприклад, якась помилка або інший метод оплати)
        toast.error("Помилка: не вдалося отримати посилання на оплату");
      }
    } catch (err) {
      console.log(err);
      toast.error("Не вдалося створити замовлення", {
        icon: "❌",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => {
    updateItemQuantity(id, type === "plus" ? quantity + 1 : quantity - 1);
  };

  if (!mounted) return null;

  return (
    <Container className="mb-20 mt-10">
      <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-5">
        <div>
          <p className="mb-1 text-sm font-medium uppercase tracking-widest text-gray-500">
            Składanie zamówienia
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Twoje nowe meble
          </h1>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
          {/* --- ЛІВА КОЛОНКА --- */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                1. Wybrane produkty
              </h2>
              <CheckoutCart
                items={items}
                loading={loading}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                isMontageEnabled={isMontageEnabled}
                setIsMontageEnabled={setIsMontageEnabled}
              />
            </section>

            <section>
              <h2 className="mb-6 text-xl font-bold">2. Dane do dostawy</h2>
              {/* 👇 Форма з полями (Ім'я, Прізвище...) */}
              <CheckoutPersonalForm form={form} className="mb-6" />

              {/* 👇 Форма адреси (Вулиця, Коментар) */}
              <CheckoutAddressForm form={form} />
            </section>
          </div>

          {/* --- ПРАВА КОЛОНКА (Сайдбар) --- */}
          <div className="w-full">
            <CheckoutSidebar
              totalAmount={totalAmount}
              loading={loading}
              isMontageEnabled={isMontageEnabled}
              isSubmitting={form.formState.isSubmitting}
              disabled={
                loading || items.length === 0 || form.formState.isSubmitting
              }
            />
          </div>
        </div>
      </form>
    </Container>
  );
}
