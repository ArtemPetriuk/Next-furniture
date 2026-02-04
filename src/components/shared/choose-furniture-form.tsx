"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Additionally, ProductItem } from "@prisma/client";
import { ProductImage } from "./product-image";
import { Title } from "./title";
import { Button } from "../ui";
import { Additionallys } from "./additionally";
import { useFurnitureOptions } from "../hooks/use-furniture-option";

interface Props {
  imageUrl: string;
  name: string;
  additionally?: Additionally[];
  items: ProductItem[];
  loading?: boolean;
  onSubmit: (itemId: number, additionally: number[]) => void;
  className?: string;
  options?: any;
  // 🔥 1. Додаємо проп для опису
  description?: string | null; 
}

type ProductOption = {
  name: string;
  value: string;
  price?: number;
};

export const ChooseFurnitureForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  loading,
  onSubmit,
  className,
  options,
  additionally = [],
  // 🔥 2. Приймаємо його тут
  description, 
}) => {
  // 🔥 3. Використовуємо опис з бази, або стандартний текст, якщо опису немає
  const textDetails = description || "Komfort i styl na co dzień";

  const {
    selectedAdditionally,
    addAdditionally,
    currentItemId,
    selectedOption,
    handleOptionSelect,
  } = useFurnitureOptions(items);

  // --- ЛОГІКА ПАРСИНГУ ---
  const parseOptions = (optionsData: any): ProductOption[] => {
    try {
      if (!optionsData) return [];

      let parsed = [];

      if (Array.isArray(optionsData)) {
        parsed = optionsData;
      } 
      else if (typeof optionsData === "string") {
        parsed = JSON.parse(optionsData);
      }
      else if (typeof optionsData === "object") {
         parsed = Object.values(optionsData);
      }

      return parsed.map((option: any) => {
          if (typeof option === "string") {
            return {
              name: option,
              value: option.toLowerCase().replace(/\s+/g, "-"),
            };
          }
          if (typeof option === "object" && option !== null) {
            return {
              name: option.name || "",
              value: (option.name || "").toLowerCase().replace(/\s+/g, "-"),
              price: option.price,
            };
          }
          return { name: "", value: "" };
        })
        .filter((opt: any) => opt.name);
    } catch (e) {
      console.error("Помилка парсингу опцій:", e);
      return [];
    }
  };

  const parsedOptions = React.useMemo(() => parseOptions(options), [options]);
  
  // Якщо варіантів немає або ще не вибрано - беремо ціну першого item
  const firstItemPrice = items[0]?.price || 0;
  const [selectedVariantPrice, setSelectedVariantPrice] = React.useState<number>(firstItemPrice);

  React.useEffect(() => {
    if (parsedOptions.length > 0) {
      if (selectedOption) {
        const found = parsedOptions.find((o) => o.name === selectedOption);
        if (found?.price) setSelectedVariantPrice(found.price);
      } else {
        const firstOption = parsedOptions[0];
        handleOptionSelect(firstOption.name);
        if (firstOption.price) setSelectedVariantPrice(firstOption.price);
      }
    } else {
        if (items.length > 0) {
            setSelectedVariantPrice(items[0].price);
        }
    }
  }, [parsedOptions, selectedOption, handleOptionSelect, items]);

  const handleOptionClick = (option: ProductOption) => {
    handleOptionSelect(option.name);
    if (option.price !== undefined) {
      setSelectedVariantPrice(option.price);
    }
  };

  const calculateTotalPrice = () => {
    let additionsPrice = 0;
    selectedAdditionally.forEach((id) => {
      const addition = additionally.find((a) => a.id === id);
      if (addition?.price) additionsPrice += addition.price;
    });
    return selectedVariantPrice + additionsPrice;
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = () => {
    const finalItemId = currentItemId || items[0]?.id;
    
    if (finalItemId) {
      onSubmit(finalItemId, Array.from(selectedAdditionally));
    } else {
        console.error("Немає ID товару!");
    }
  };

  return (
    <div className={cn(className, "flex flex-1 h-auto min-h-[500px]")}>
      
      {/* ЛІВА ЧАСТИНА (ФОТО) */}
      <div className="w-[50%] bg-[#F5F5F7] rounded-l-3xl p-6 flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
         <ProductImage
          imageUrl={imageUrl}
          className="relative w-full h-full object-cover rounded-3xl shadow-md transition-transform duration-500 hover:scale-[1.02] z-10"
        />
      </div>

      {/* ПРАВА ЧАСТИНА (КОНТЕНТ) */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-between rounded-r-3xl">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <Title text={name} size="md" className="font-extrabold text-2xl mb-2 text-gray-900" />
            <p className="text-gray-500 text-sm leading-relaxed">{textDetails}</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar space-y-6">
            
            {/* ВАРІАНТИ */}
            {parsedOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide opacity-80">
                  Wybierz wariant:
                </h3>
                <div className="flex flex-col gap-2.5">
                  {parsedOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      className={cn(
                        "group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ease-in-out",
                        "hover:shadow-md",
                        selectedOption === option.name
                          ? "border-violet-600 bg-violet-50 shadow-sm ring-1 ring-violet-600/20" 
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <span className={cn(
                        "text-sm transition-colors",
                        selectedOption === option.name ? "font-semibold text-violet-700" : "text-gray-700"
                      )}>
                        {option.name}
                      </span>
                      {option.price !== undefined && (
                        <span className={cn(
                           "text-sm font-medium",
                           selectedOption === option.name ? "text-violet-900" : "text-gray-500 group-hover:text-gray-900"
                        )}>
                          {option.price} zł
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

{/* ДОДАТКИ */}
{additionally.length > 0 && (
  // 👇 ЗМІНИ ТУТ: Додаємо фон, відступи та заокруглення
  <div className="bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">
    
    <h3 className="text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide opacity-80">
      Dodatki:
    </h3>
    <div className={cn(
        "w-full",
        additionally.length > 3 
            ? "max-h-[220px] overflow-y-auto pr-2 custom-scrollbar"
            : "h-auto"
    )}>
        <div className="grid grid-cols-3 gap-3 pb-1">
        {additionally.map((item) => (
            <Additionallys
            key={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            onClick={() => addAdditionally(item.id)}
            active={selectedAdditionally.has(item.id)}
            />
        ))}
        </div>
    </div>
  </div>
)}
          </div>
        </div>

        {/* КНОПКА */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex-shrink-0">
            <Button
            loading={loading}
            className={cn(
                "w-full h-[55px] rounded-2xl text-base font-bold shadow-lg shadow-violet-500/20 transition-transform active:scale-[0.98]",
                "bg-violet-600 hover:bg-violet-700 text-white"
            )}
            onClick={handleSubmit}
            disabled={loading || totalPrice === 0}
            >
            {loading ? "Przetwarzanie..." : (
                <span className="flex items-center justify-center gap-2">
                    Dodaj do koszyka 
                    <span className="w-1 h-1 bg-white/50 rounded-full mx-1"></span>
                    {totalPrice} zł
                </span>
            )}
            </Button>
        </div>
      </div>
    </div>
  );
};