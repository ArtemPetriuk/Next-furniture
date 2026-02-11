"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Categories } from "./categories";
import { SortPopup } from "./sort-popup";
import { CartButton } from "./cart-button";
import { ProfileButton } from "./profile-button";
import { Category } from "@prisma/client";
import { AuthModal } from "./modals/auth-modal";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-white shadow-lg shadow-black/5 transition-all",
        isScrolled ? "py-5" : "py-6", // Трохи зменшив висоту при скролі
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-300",
          // 👇 ЛОГІКА ШИРИНИ:
          // isScrolled -> px-10 (майже на весь екран).
          // Normal -> max-w-[1280px] (стандартний контейнер).
          isScrolled ? "w-full px-10" : "max-w-[1280px] px-4",
        )}
      >
        {/* ЛІВА ЧАСТИНА: Логотип + Категорії */}
        <div className="flex flex-1 items-center overflow-hidden">
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              isScrolled
                ? "mr-8 w-auto flex-shrink-0 opacity-100"
                : "w-0 overflow-hidden opacity-0",
            )}
          >
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/images/logo1.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="flex flex-col">
                <h1 className="whitespace-nowrap text-lg font-black uppercase leading-none text-black">
                  Next Furniture
                </h1>
                <p className="mt-1 whitespace-nowrap text-[11px] font-medium leading-none text-gray-400">
                  wygodniej się nie da
                </p>
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <Categories items={categories} />
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-4 bg-white pl-5">
          {/* Пошук */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isScrolled ? "mr-2 w-64 opacity-100" : "w-0 opacity-0",
            )}
          >
            <SearchInput className="h-11 bg-gray-100" />
          </div>

          {/* Сортування */}
          {/* 👇 ТУТ МАГІЯ:
              Якщо isScrolled -> застосовуємо клас [&>b:first-of-type]:hidden
              Це CSS-селектор, який знаходить перший жирний текст (Sortowanie) і ховає його.
          */}
          <div className="origin-right scale-95 transition-transform hover:scale-100">
            <SortPopup
              className={cn(
                isScrolled && "gap-1 px-3 [&>b:first-of-type]:hidden", // Ховаємо текст "Sortowanie"
              )}
            />
          </div>

          {/* Кнопки */}
          <div
            className={cn(
              "flex items-center gap-4 overflow-hidden transition-all duration-300",
              isScrolled
                ? "ml-4 w-auto translate-x-0 border-l pl-4 opacity-100"
                : "pointer-events-none w-0 translate-x-5 opacity-0",
            )}
          >
            <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />
            <CartButton />
          </div>
        </div>
      </div>

      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </div>
  );
};
