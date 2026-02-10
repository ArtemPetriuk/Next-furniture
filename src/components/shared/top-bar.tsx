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

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
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
        isScrolled ? "py-5" : "py-6",
        className,
      )}
    >
      {/* 👇 ГОЛОВНА МАГІЯ ТУТ */}
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-4 transition-all duration-300",
          // Якщо скролимо -> ширина 95%. Якщо ні -> стандартна ширина контейнера (1280px)
          isScrolled ? "max-w-[95%]" : "max-w-[1280px]",
        )}
      >
        {/* ЛІВА ЧАСТИНА: Логотип + Категорії */}
        <div className="flex flex-1 items-center overflow-hidden">
          {/* ЛОГОТИП */}
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              // Логотип з'являється і має фіксований розмір, щоб не стискався
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

          {/* Категорії */}
          {/* flex-1 дозволяє категоріям зайняти вільне місце, але overflow-x-auto дасть скрол якщо місця мало */}
          <div className="flex-1">
            <Categories items={categories} />
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: Сортування + Кнопки */}
        {/* flex-shrink-0 забороняє цій частині стискатися, щоб категорії на неї не налізли */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-5 bg-white pl-5">
          <SortPopup />

          <div
            className={cn(
              "flex items-center gap-4 overflow-hidden transition-all duration-300",
              isScrolled
                ? "ml-8 w-auto translate-x-0 border-l pl-8 opacity-100"
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
