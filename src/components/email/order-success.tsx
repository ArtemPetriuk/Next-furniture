import * as React from "react";

interface OrderSuccessEmailProps {
  orderId: number;
  totalAmount: number;
  paymentUrl?: string;
}

export const OrderSuccessEmail: React.FC<OrderSuccessEmailProps> = ({
  orderId,
  totalAmount,
  paymentUrl,
}) => (
  <div style={{ fontFamily: "sans-serif", color: "#333" }}>
    <h1>Dziękujemy za zakupy, zamówienie #{orderId}! 🎉</h1>
    <p>Twoje zamówienie zostało pomyślnie utworzone.</p>

    <p>
      Kwota do zapłaty: <b>{totalAmount} zł</b>
    </p>

    {paymentUrl && (
      <a
        href={paymentUrl}
        style={{
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          display: "inline-block",
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        Opłać zamówienie
      </a>
    )}

    <hr style={{ margin: "20px 0", border: "1px solid #eee" }} />
    <p style={{ color: "#888", fontSize: "14px" }}>
      Z poważaniem,
      <br />
      Zespół Next Furniture
    </p>
  </div>
);
