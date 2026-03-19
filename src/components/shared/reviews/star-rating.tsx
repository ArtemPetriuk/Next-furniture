"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export const StarRating: React.FC<Props> = ({ value, onChange, disabled }) => {
  // Стан для відслідковування наведення мишки
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div
      className="flex gap-1"
      // Коли мишка йде з блоку зірок, скидаємо hover
      onMouseLeave={() => setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        // Зірка зафарбована, якщо індекс менший або дорівнює hover (якщо мишка наведена)
        // АБО якщо індекс менший або дорівнює вибраному value (якщо мишка прибрана)
        const isFilled = (hoverValue || value) >= index;

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(index)}
            onMouseEnter={() => setHoverValue(index)}
            className={`transition-transform duration-200 ${
              disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
          >
            <Star
              className={`h-7 w-7 transition-colors duration-200 ${
                isFilled
                  ? "fill-yellow-400 text-yellow-400" // Заповнена зірка
                  : "fill-transparent text-gray-300" // Порожня зірка
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
