"use client";

import React, { useState } from "react";
import { StarRating } from "./star-rating";

interface Review {
  id: number;
  text: string;
  rating: number;
  createdAt: Date;
  user: {
    fullName: string | null;
  };
}

interface Props {
  reviews: Review[];
}

export const ReviewList: React.FC<Props> = ({ reviews }) => {
  // Стан, який контролює, скільки відгуків ми зараз бачимо (початково 3)
  const [visibleCount, setVisibleCount] = useState(3);

  // Відрізаємо тільки ту кількість відгуків, яку треба показати
  const visibleReviews = reviews.slice(0, visibleCount);

  // Перевіряємо, чи є ще приховані відгуки
  const hasMore = visibleCount < reviews.length;

  if (reviews.length === 0) {
    return null; // Якщо відгуків немає, нічого не рендеримо
  }

  return (
    <div className="mt-8 space-y-5">
      {/* Рендеримо тільки видимі відгуки */}
      {visibleReviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 font-bold text-gray-800">
                {review.user.fullName || "Klient"}
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-600">
                  Kupił
                </span>
              </p>
              <div className="mt-1 origin-left scale-90">
                <StarRating value={review.rating} disabled />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("pl-PL")}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{review.text}</p>
        </div>
      ))}

      {/* Кнопка "Показати більше", яка з'являється тільки якщо є ще відгуки */}
      {hasMore && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="mt-4 w-full rounded-xl border-2 border-violet-100 bg-violet-50 py-3 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-100"
        >
          Pokaż więcej opinii ({reviews.length - visibleCount})
        </button>
      )}
    </div>
  );
};
