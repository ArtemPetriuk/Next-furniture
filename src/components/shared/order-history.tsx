"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@prisma/client";
import { OrderHistorySkeleton } from "./OrderHistorySkeleton";

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <OrderHistorySkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
        <p className="text-gray-400">
          Jeszcze nie złożyłeś żadnego zamówienia 🛒
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const items =
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items;

        // Formatowanie daty i czasu (już ustawione na pl-PL)
        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const formattedTime = orderDate.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Tłumaczenie statusów z bazy danych
        const getStatusText = (status: string) => {
          switch (status) {
            case "PENDING":
              return "W TOKU";
            case "SUCCEEDED":
              return "ZAKOŃCZONE";
            case "CANCELLED":
              return "ANULOWANE";
            default:
              return status;
          }
        };

        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Nagłówek karty zamówienia */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {formattedDate} <span className="mx-1">•</span>{" "}
                  {formattedTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">
                  {order.totalAmount} zł
                </span>
                <span
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                    order.status === "SUCCEEDED"
                      ? "bg-green-100 text-green-600"
                      : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Lista produktów (ze zdjęciami) */}
            <div className="px-6 py-2">
              {items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-gray-50 py-4 last:border-0"
                >
                  {/* Zdjęcie produktu */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.productItem?.product?.imageUrl || ""}
                      alt={item.productItem?.product?.name || "Produkt"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Informacje o produkcie */}
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-800">
                      {item.productItem?.product?.name || "Nieznany produkt"}
                    </p>
                    {item.additionally && item.additionally.length > 0 && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        + {item.additionally.map((a: any) => a.name).join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Ilość i cena produktu */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {item.quantity} szt.
                    </p>
                    <p className="font-semibold text-gray-800">
                      {item.price} zł
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
