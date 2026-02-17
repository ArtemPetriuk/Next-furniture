"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Api } from "./services/api-client";
import { useClickAway, useDebounce } from "react-use";
import Link from "next/link";
import { Product } from "@prisma/client";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const ref = React.useRef(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setFocused(false);
      inputRef.current?.blur();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useDebounce(
    async () => {
      try {
        const response = await Api.products.search(searchQuery);
        setProducts(response);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
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
      {/* ВИПРАВЛЕННЯ БЛЮРУ:
         1. bg-black/50 -> bg-black/30 (менш темний)
         2. backdrop-blur-sm -> backdrop-blur-[2px] (дуже легке розмиття)
      */}
      {focused && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] transition-all duration-200" />
      )}

      <div
        ref={ref}
        className={cn(
          // ВИПРАВЛЕННЯ ВИСОТИ: h-11 -> h-12
          "relative z-40 flex h-12 flex-1 justify-between rounded-2xl transition-all duration-300",
          className,
        )}
      >
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          ref={inputRef}
          className="h-full w-full rounded-2xl bg-gray-50 pl-11 text-base text-black outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:shadow-md focus:ring-1 focus:ring-primary/20"
          type="text"
          placeholder="Szukaj..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />

        {/* Випадаючий список */}
        <div
          className={cn(
            "invisible absolute left-0 top-14 z-30 w-full translate-y-2 overflow-hidden rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-200",
            focused && "visible top-[calc(100%+4px)] translate-y-0 opacity-100",
          )}
        >
          {products.length > 0 ? (
            <div className="flex flex-col py-2">
              {products.map((product) => (
                <Link
                  onClick={onClickItem}
                  key={product.id}
                  className="flex w-full items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50"
                  href={`/product/${product.id}`}
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      className="h-full w-full object-cover"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              {searchQuery ? "Brak wyników" : "Wpisz nazwę towaru..."}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
