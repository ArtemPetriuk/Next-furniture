"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/app/actions/update-order-status";
import { toast } from "react-hot-toast";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

// Opcje statusów
const STATUSES = [
  { value: "PENDING", label: "W TOKU " },
  { value: "SUCCEEDED", label: "OPŁACONE" },
  { value: "CANCELLED", label: "ANULOWANE" },
];

// Funkcja do pobierania kolorów w zależności od statusu
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "text-orange-700 bg-orange-50 border-orange-200 focus:border-orange-500 focus:ring-orange-200";
    case "SUCCEEDED":
      return "text-green-700 bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-200";
    case "CANCELLED":
      return "text-red-700 bg-red-50 border-red-200 focus:border-red-500 focus:ring-red-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
};

interface Props {
  id: number;
  // Wymuszamy, aby currentStatus był typem OrderStatus, a nie zwykłym stringiem
  currentStatus: OrderStatus;
}

export const StatusSelect: React.FC<Props> = ({ id, currentStatus }) => {
  // Stan blokady podczas wysyłania zapytania do bazy
  const [isLoading, setIsLoading] = useState(false);

  // Stan optymistyczny (zmienia kolor natychmiast przed odpowiedzią serwera)
  const [optimisticStatus, setOptimisticStatus] =
    useState<OrderStatus>(currentStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;

    setIsLoading(true);
    setOptimisticStatus(newStatus); // Natychmiastowa zmiana w UI

    const result = await updateOrderStatus(id, newStatus);

    if (result.success) {
      toast.success("Status został zaktualizowany!");
    } else {
      toast.error("Błąd podczas aktualizacji statusu");
      setOptimisticStatus(currentStatus); // Cofamy zmianę, jeśli wystąpił błąd
    }

    setIsLoading(false);
  };

  return (
    <select
      value={optimisticStatus}
      onChange={handleChange}
      disabled={isLoading}
      className={cn(
        "cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition-all focus:ring-2",
        getStatusColor(optimisticStatus), // Dynamiczne kolory
        isLoading && "cursor-wait opacity-50", // Efekt ładowania
      )}
    >
      {STATUSES.map((status) => (
        <option
          key={status.value}
          value={status.value}
          // Zwykły kolor tekstu dla opcji na liście rozwijanej
          className="bg-white font-medium text-gray-900"
        >
          {status.label}
        </option>
      ))}
    </select>
  );
};
