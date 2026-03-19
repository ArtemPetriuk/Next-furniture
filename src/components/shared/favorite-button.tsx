"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/toggle-favorite";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
  initialIsFavorite?: boolean;
  className?: string;
}

export const FavoriteButton: React.FC<Props> = ({
  productId,
  initialIsFavorite = false,
  className,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClickToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Zapobiega przejściu do strony produktu, jeśli serduszko jest na karcie
    e.stopPropagation();

    setIsLoading(true);

    // Optymistyczna zmiana UI (zmieniamy natychmiast)
    setIsFavorite(!isFavorite);

    const result = await toggleFavorite(productId);

    if (!result.success) {
      // Jeśli użytkownik nie jest zalogowany
      if (result.error === "UNAUTHORIZED") {
        toast.error("Zaloguj się, aby dodać do ulubionych!");
        setIsFavorite(initialIsFavorite); // Cofamy zmianę
        // router.push("/login"); // Możesz odkomentować, żeby przekierować do logowania
      } else {
        toast.error("Coś poszło nie tak.");
        setIsFavorite(initialIsFavorite); // Cofamy zmianę
      }
    } else {
      if (result.isFavorite) {
        toast.success("Dodano do ulubionych! ❤️");
      } else {
        toast.success("Usunięto z ulubionych.");
      }
      // Aktualizujemy prawdziwy stan z serwera
      setIsFavorite(result.isFavorite ?? false);
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={onClickToggle}
      disabled={isLoading}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95",
        className,
      )}
      title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
    >
      <Heart
        size={22}
        className={cn(
          "transition-colors duration-300",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400",
        )}
      />
    </button>
  );
};
