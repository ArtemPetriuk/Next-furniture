import { render } from "@react-email/render";
import { Resend } from "resend";
import { OrderSuccessEmail } from "@/components/email/order-success";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderCreatedEmail(
  email: string,
  orderId: number,
  totalAmount: number,
  paymentUrl: string
) {
  try {
    const emailHtml = await render(
      <OrderSuccessEmail
        orderId={orderId}
        totalAmount={totalAmount}
        paymentUrl={paymentUrl}
      />
    );

    await resend.emails.send({
      from: "Next Furniture <onboarding@resend.dev>",
      to: email,
      subject: `Next Furniture | Zamówienie #${orderId}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("[BŁĄD EMAIL]", err);
  }
}