// src/components/hooks/use-furniture-option.ts
import React from "react";
import { useSet } from "react-use";
import { ProductItem } from "@prisma/client";

// Тип для опцій у JSON
type RawItemOption = string | { name?: string; value?: string; price?: number };

interface ReturnProps {
  selectedAdditionally: Set<number>;
  addAdditionally: (id: number) => void;
  currentItemId?: number;
  selectedOption?: string;
  handleOptionSelect: (optValue: string) => void;
}

// універсальний парсер JSON або plain string
const parseJSON = <T>(s?: string | null): T | undefined => {
  if (!s) return undefined;
  try {
    const parsed = JSON.parse(s);
    return parsed;
  } catch {
    // якщо це просто рядок типу "L-lewa", повертаємо як масив
    return [s] as unknown as T;
  }
};

// отримуємо "значення" незалежно від формату
const getOptionValue = (opt: RawItemOption): string => {
  if (typeof opt === "string") return opt;
  if (opt?.value) return String(opt.value);
  if (opt?.name) return String(opt.name);
  return "";
};

export const useFurnitureOptions = (items: ProductItem[]): ReturnProps => {
  const [selectedAdditionally, { toggle: addAdditionally }] = useSet(
    new Set<number>()
  );
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(undefined);

  const isDev = process.env.NODE_ENV === "development";

  const currentItemId = React.useMemo(() => {
    if (!selectedOption) return undefined;

    for (const item of items) {
      const arr = parseJSON<RawItemOption[]>(item.options ?? "[]") ?? [];
      if (
        Array.isArray(arr) &&
        arr.some((opt) => getOptionValue(opt) === selectedOption)
      ) {
        if (isDev)
          console.log("✅ Збіг знайдено:", {
            selectedOption,
            matchedId: item.id,
            options: arr,
          });
        return item.id;
      }
    }

    if (isDev) console.warn("❌ Не знайдено збіг для:", selectedOption, items);
    return undefined;
  }, [items, selectedOption]);

  // окремий лог для відстеження змін
  React.useEffect(() => {
    if (isDev) {
      console.log("🔄 selectedOption:", selectedOption);
      console.log("🆔 currentItemId:", currentItemId);
    }
  }, [selectedOption, currentItemId]);

  return {
    selectedAdditionally,
    addAdditionally,
    currentItemId,
    selectedOption,
    handleOptionSelect: (value: string) => {
      if (isDev) console.log("▶ setSelectedOption отримав:", value);
      setSelectedOption(value);
    },
  };
};
