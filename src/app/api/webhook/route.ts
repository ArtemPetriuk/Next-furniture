import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@prisma/prisma-client";
import { Resend } from "resend";

// Ініціалізуємо Stripe та Resend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  // Stripe вимагає читати тіло запиту як сирий текст (raw text)
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Перевіряємо, чи цей запит дійсно від Stripe за допомогою нашого секрету
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`[WEBHOOK ERROR] ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Отримуємо дані сесії
  const session = event.data.object as Stripe.Checkout.Session;

  // Якщо оплата пройшла успішно
  if (event.type === "checkout.session.completed") {
    // Дістаємо ID замовлення, який ми передавали в metadata при створенні сесії
    const orderId = session?.metadata?.order_id;

    if (orderId) {
      // 1. Оновлюємо статус замовлення в базі даних на успішний
      const order = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "SUCCEEDED" }, // Якщо у твоїй базі статус називається "PAID" - зміни на "PAID"
      });

      // 2. Відправляємо другий лист (Дякуємо за оплату)
      try {
        await resend.emails.send({
          from: "Next Furniture <onboarding@resend.dev>",
          to: order.email, // Беремо пошту з бази даних
          subject: `Оплата успішна! Zamówienie #${order.id}`,
          // Тут поки простий HTML. Ти зможеш замінити його на свій React-компонент, як робив у першому листі
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Дякуємо за оплату! 🎉</h2>
              <p>Твоє замовлення <strong>#${order.id}</strong> на суму ${order.totalAmount} PLN успішно сплачено.</p>
              <p>Ми вже почали його готувати до відправки. Очікуй на подальші повідомлення!</p>
            </div>
          `,
        });
        console.log(`[WEBHOOK] Email sent for order ${order.id}`);
      } catch (err) {
        console.error("[WEBHOOK EMAIL ERROR]", err);
      }
    }
  }

  // Обов'язково повертаємо 200 статус, щоб Stripe зрозумів, що ми все отримали
  return new NextResponse(null, { status: 200 });
}