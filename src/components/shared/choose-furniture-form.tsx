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
  options?: string | null; // передаємо JSON-строку з продукту
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
}) => {
  const textDetails = "Komfort i styl na co dzień";

  // наш хук
  const {
    selectedAdditionally,
    addAdditionally,
    currentItemId,
    selectedOption,
    handleOptionSelect,
  } = useFurnitureOptions(items);

  // парсинг "options" з продукту (JSON string -> масив)
  const parseOptions = (
    optionsString: string | null | undefined
  ): ProductOption[] => {
    try {
      const parsed = JSON.parse(optionsString || "[]");
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((option) => {
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
        .filter((opt) => opt.name);
    } catch {
      return [];
    }
  };

  const parsedOptions = React.useMemo(() => parseOptions(options), [options]);

  const [selectedVariantPrice, setSelectedVariantPrice] =
    React.useState<number>(0);

  const handleOptionClick = (option: ProductOption) => {
    console.log("CLICK option:", option.name, "price:", option.price);
    handleOptionSelect(option.name); // зберігаємо "name" як selectedOption
    console.log("▶ handleOptionSelect викликано з:", option.name);
    if (option.price !== undefined) {
      setSelectedVariantPrice(option.price);
    }
  };

  const calculateTotalPrice = () => {
    let additionsPrice = 0;
    selectedAdditionally.forEach((id) => {
      const addition = additionally.find((a) => a.id === id);
      if (addition?.price) {
        additionsPrice += addition.price;
      }
    });
    return selectedVariantPrice + additionsPrice;
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = () => {
    console.log("handleSubmit clicked");

    console.log("currentItemId перед відправкою:", currentItemId);
    console.log(
      "selectedAdditionally перед відправкою:",
      Array.from(selectedAdditionally)
    );

    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedAdditionally));
      console.log("currentItemId", currentItemId);
    }
    console.log("currentItemId outside if", currentItemId);
  };

  return (
    <div className={cn(className, "flex flex-1 h-[500px]")}>
      {/* Ліва частина з зображенням */}
      <div className="flex-1 overflow-hidden">
        <ProductImage
          imageUrl={imageUrl}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Права частина з формою */}
      <div className="w-[490px] bg-[#f7f6f5] p-7 flex-shrink-0 flex flex-col">
        <Title text={name} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-400 mb-6">{textDetails}</p>

        <div className="flex-1 overflow-y-auto">
          {parsedOptions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Warianty:
              </h3>
              <div className="flex flex-col gap-2">
                {parsedOptions.map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      "p-3 border rounded-md text-left transition-all",
                      "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20",
                      selectedOption === option.name
                        ? "border-black bg-gray-100 font-medium"
                        : "border-gray-300"
                    )}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.name}</span>
                      {option.price !== undefined && (
                        <span className="text-black font-medium">
                          {option.price} zł
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              Dodatki:
            </h3>
            <div className="grid grid-cols-3 gap-2">
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

        <Button
          loading={loading}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6"
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? "Przetwarzanie..." : `dodaj do koszyka ${totalPrice} zł`}
        </Button>
      </div>
    </div>
  );
};
