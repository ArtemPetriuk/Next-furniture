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
  // Головний контейнер, який обгортає все
  <div style={{
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    maxWidth: "600px",
    margin: "20px auto",
    border: "1px solid #eaeaea",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden", // Для закруглення кутів фото
    backgroundColor: "#ffffff"
  }}>
    
    {/* Область заголовка з логотипом */}
    <div style={{
      textAlign: "center",
      padding: "20px 20px 10px",
      borderBottom: "1px solid #eaeaea",
      backgroundColor: "#fafafa"
    }}>
      <h1 style={{
        margin: "0",
        fontSize: "24px",
        fontWeight: "bold",
        letterSpacing: "1px",
        color: "#333",
        textTransform: "uppercase"
      }}>NEXT FURNITURE</h1>
    </div>

    {/* Головне фото, яке розтягується на всю ширину */}
    <div style={{ textAlign: "center" }}>
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        alt="Next Furniture"
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          display: "block"
        }}
      />
    </div>

    {/* Область внутрішнього вмісту під фото */}
    <div style={{ padding: "30px 40px" }}>
      
      <h2 style={{
        margin: "0 0 20px",
        fontSize: "22px",
        fontWeight: "600",
        color: "#333",
        textAlign: "center"
      }}>Dziękujemy za zakupy! 🎉</h2>
      
      <p style={{
        margin: "0 0 30px",
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#555",
        textAlign: "center"
      }}>Twoje zamówienie zostało pomyślnie utworzone.</p>

      {/* Блок з деталями замовлення */}
      <div style={{
        backgroundColor: "#fafafa",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #eee",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 10px", fontSize: "15px", color: "#666" }}>
          Numer zamówienia: <strong style={{ color: "#333" }}>#{orderId}</strong>
        </p>
        <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>
          Kwota do zapłaty: <strong style={{ color: "#6366f1", fontSize: "18px" }}>{totalAmount} zł</strong>
        </p>
      </div>

      {/* Кнопка оплати */}
      {paymentUrl && (
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={paymentUrl}
            style={{
              padding: "14px 28px",
              backgroundColor: "#6366f1",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 2px 5px rgba(99, 102, 241, 0.3)"
            }}
          >
            Opłać zamówienie
          </a>
        </div>
      )}

      {/* Розділювач та підвал */}
      <hr style={{ margin: "0 0 25px", border: "none", borderTop: "1px solid #eaeaea" }} />
      
      <div style={{ textAlign: "center", color: "#888", fontSize: "14px", lineHeight: "1.5" }}>
        <p style={{ margin: "0" }}>Z poważaniem,</p>
        <p style={{ margin: "5px 0 0", fontWeight: "bold", color: "#555" }}>Zespół Next Furniture</p>
      </div>

    </div>
  </div>
);