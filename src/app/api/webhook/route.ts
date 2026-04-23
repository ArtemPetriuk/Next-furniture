import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@prisma/prisma-client";
import { Resend } from "resend";

// Inicjujemy Stripe i Resend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  // Stripe wymaga odczytania ciała żądania jako surowego tekstu (raw text)
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Sprawdzamy, czy to żądanie na pewno pochodzi od Stripe za pomocą naszego sekretu
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`[BŁĄD WEBHOOKA] ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Pobieramy dane sesji
  const session = event.data.object as Stripe.Checkout.Session;

  // Jeśli płatność przebiegła pomyślnie
  if (event.type === "checkout.session.completed") {
    // Pobieramy ID zamówienia, które przekazaliśmy w metadata podczas tworzenia sesji
    const orderId = session?.metadata?.order_id;

    if (orderId) {
      // 1. Aktualizujemy status zamówienia w bazie danych na opłacony
      const order = await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "SUCCEEDED" }, // Jeśli w Twojej bazie status nazywa się inaczej, np. "PAID", zmień to tutaj
      });

      // 2. Wysyłamy drugiego e-maila (Podziękowanie za płatność)
      try {
        await resend.emails.send({
          from: "Next Furniture <onboarding@resend.dev>",
          to: order.email, // Adres e-mail pobrany z bazy danych
          subject: `Płatność zakończona sukcesem! Zamówienie #${order.id}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
              
              <div style="text-align: center; margin-bottom: 25px;">
                <img 
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Next Furniture" 
                  style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" 
                />
              </div>

              <h2 style="color: #333333; text-align: center; margin-bottom: 20px;">Dziękujemy za płatność! 🎉</h2>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">
                Twoje zamówienie na kwotę <span style="color: #6366f1; font-weight: bold;">${order.totalAmount} PLN</span> zostało pomyślnie opłacone.
              </p>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">
                Już zaczęliśmy przygotowywać Twoje meble do wysyłki. Oczekuj na kolejne wiadomości z informacją o dostawie!
              </p>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #888888; font-size: 13px;">
                <p style="margin: 0;">Z pozdrowieniami,</p>
                <p style="margin: 5px 0 0 0; font-weight: bold;">Zespół Next Furniture</p>
              </div>

            </div>
          `,
        });
      } catch (err) {
        console.error("[BŁĄD WYSYŁANIA E-MAILA WEBHOOK]", err);
      }
    }
  }

  // Obowiązkowo zwracamy status 200, aby Stripe wiedział, że wszystko poprawnie odebraliśmy
  return new NextResponse(null, { status: 200 });
}