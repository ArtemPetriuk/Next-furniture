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
  <div style={{ fontFamily: "sans-serif", color: "#333", maxWidth: "600px", margin: "0 auto" }}>
    
    {/* Банер з картинкою */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        alt="Next Furniture"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          borderRadius: "8px",
          display: "block",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      />
    </div>

    <h1>Dziękujemy za zakupy! 🎉</h1>
    <p>Twoje zamówienie zostało pomyślnie utworzone.</p>

    <p style={{ fontSize: "16px" }}>
      Kwota do zapłaty: <b>{totalAmount} zł</b>
    </p>

    {paymentUrl && (
      <a
        href={paymentUrl}
        style={{
          padding: "12px 24px",
          backgroundColor: "#6366f1",
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

    <hr style={{ margin: "30px 0 20px", border: "none", borderTop: "1px solid #eee" }} />
    
    <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.5" }}>
      Z poważaniem,
      <br />
      <strong>Zespół Next Furniture</strong>
    </p>
  </div>
);