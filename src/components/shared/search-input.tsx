"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useClickAway, useDebounce } from "react-use";
import { Api } from "./services/api-client";
import { Product } from "@prisma/client";

interface Props {
  className?: string;
  removeScrollListener?: boolean;
}

export const SearchInput: React.FC<Props> = ({
  className,
  removeScrollListener = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);

  const ref = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  React.useEffect(() => {
    if (removeScrollListener) return;

    const handleScroll = () => {
      setFocused(false);
      inputRef.current?.blur();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [removeScrollListener]);

  useDebounce(
    async () => {
      try {
        const response = await Api.products.search(searchQuery);
        setProducts(response);
      } catch (error) {
        console.error(error);
      }
    },
    250,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery("");
    setProducts([]);
  };

  return (
    <>
      {focused && !removeScrollListener && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-all duration-200" />
      )}

      <div
        ref={ref}
        className={cn(
          "relative z-40 flex h-11 flex-1 justify-between rounded-2xl transition-all duration-300",
          className,
        )}
      >
        <div className="group relative h-11 w-full">
          {/* Іконка лупи */}
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:scale-110 group-focus-within:text-primary group-hover:text-primary"
          />

          <input
            ref={inputRef}
            className="h-full w-full cursor-pointer rounded-2xl bg-gray-50 pl-11 pr-4 text-base text-black outline-none transition-all duration-300 ease-in-out placeholder:text-gray-400 hover:cursor-text hover:bg-indigo-50/50 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-primary/20"
            type="text"
            placeholder="Szukaj..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
          />
        </div>

        <div
          className={cn(
            "invisible absolute left-0 top-14 z-30 w-full translate-y-2 overflow-hidden rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-200",
            focused && "visible top-[calc(100%+4px)] translate-y-0 opacity-100",
          )}
        >
          {products.length > 0 ? (
            <div className="flex flex-col py-2">
              {products.map((product) => (
                // 👇 ТУТ ЗМІНИЛИ: Використовуємо звичайний <a> замість <Link>
                // Це ігнорує модальне вікно і відкриває нормальну сторінку
                <a
                  onClick={onClickItem}
                  key={product.id}
                  className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-primary/10"
                  href={`/product/${product.id}`}
                >
                  <img
                    className="h-8 w-8 rounded-sm object-cover"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  <span>{product.name}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              {searchQuery ? "nie znaleziono produktów" : "Szukaj produktów..."}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
