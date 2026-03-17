"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { updatePrice } from "@/app/actions/update-prise";
import { toast } from "react-hot-toast";

interface Props {
  id: number;
  initialPrice: number;
}

export const PriceInput: React.FC<Props> = ({ id, initialPrice }) => {
  const [value, setValue] = React.useState(initialPrice);

  const onBlur = async () => {
    if (value === initialPrice) return;
    if (value < 0) {
      toast.error("Ціна не може бути мінусовою");
      return;
    }

    const result = await updatePrice(id, value);

    if (result.success) {
      toast.success("Ціну оновлено");
    } else {
      toast.error("Помилка оновлення");
      setValue(initialPrice);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={onBlur}
        className="w-20 rounded-xl border-gray-200 bg-gray-50 text-center font-bold transition-all focus:bg-white"
      />
      <span className="text-sm text-gray-400">zł</span>
    </div>
  );
};
