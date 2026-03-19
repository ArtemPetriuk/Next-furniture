"use client";

import React from "react";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { createReview } from "@/app/actions/create-review";
import { toast } from "react-hot-toast";

interface Props {
  productId: number;
  userId: number; // Отримаємо з сесії
}

export const ReviewForm: React.FC<Props> = ({ productId, userId }) => {
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!text.trim()) return toast.error("Napisz treść opinii");

    setLoading(true);
    const res = await createReview({ productId, userId, rating, text });

    if (res.success) {
      toast.success("Opinia dodana!");
      setText("");
      setRating(5);
    } else {
      toast.error(res.error || "Błąd");
    }
    setLoading(false);
  };

  return (
    // Прибрали mt-10, змінили фон на білий із легкою тінню для преміального вигляду
    <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
      {/* Заголовок із підзаголовком */}
      <div className="mb-5 border-b border-gray-50 pb-4">
        <h3 className="text-lg font-bold text-gray-900">Napisz opinię</h3>
        <p className="mt-1 text-sm text-gray-500">
          Podziel się swoimi wrażeniami z innymi
        </p>
      </div>

      {/* Рейтинг: зірочки трохи збільшені (scale) для зручності кліку */}
      <div className="mb-5 flex items-center gap-4">
        <p className="text-sm font-semibold text-gray-700">Twoja ocena:</p>
        <div className="origin-left scale-110">
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>

      {/* Текстове поле з красивим фокусом */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Co najbardziej spodobało Ci się w tym produkcie?..."
        className="min-h-[120px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 transition-all placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
      />

      {/* Кнопка на всю ширину з тінню при наведенні */}
      <Button
        onClick={onSubmit}
        disabled={loading}
        className="mt-4 h-12 w-full rounded-xl bg-violet-600 text-base font-bold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/20 disabled:opacity-70"
      >
        {loading ? "Wysyłanie..." : "Dodaj opinię"}
      </Button>
    </div>
  );
};
