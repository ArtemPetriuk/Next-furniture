"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { updateStock } from "@/app/actions/update-stock";
import { toast } from "react-hot-toast"; // або ваша бібліотека повідомлень

interface Props {
  id: number;
  initialStock: number;
}

export const StockInput: React.FC<Props> = ({ id, initialStock }) => {
  const [value, setValue] = React.useState(initialStock);

  const onBlur = async () => {
    if (value === initialStock) return;

    const result = await updateStock(id, value);

    if (result.success) {
      toast.success("stock updated");
    } else {
      toast.error("Error updating stock");
      setValue(initialStock); // Повертаємо старе значення при помилці
    }
  };

  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur} // Зберігаємо, коли користувач знімає фокус з поля
      className="w-24 rounded-xl text-center font-bold"
    />
  );
};
