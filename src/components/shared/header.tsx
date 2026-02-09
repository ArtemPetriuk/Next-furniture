"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import { Button } from "../ui";
import { User, CircleUser } from "lucide-react"; // Додав іконку для залогіненого юзера
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { AuthModal } from "./modals/auth-modal";
import { useSession } from "next-auth/react"; // 👈 Імпорт для перевірки сесії

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCart?: boolean;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const [openAuthModal, setOpenAuthModal] = useState(false);

  // 👇 Отримуємо дані про сесію (залогінений чи ні)
  const { data: session, status } = useSession();

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* --- Логотип --- */}
        <Link href="/">
          <div className="flex items-center space-x-0">
            <Image
              src="/images/logo1.png"
              alt="Logo"
              width={65}
              height={65}
              priority
              className="inline-block"
            />
            <div className="inline-block">
              <h1 className="text-lg font-black uppercase">Next Furniture</h1>
              <p className="text-sm leading-3 text-gray-400">
                wygodniej się nie da
              </p>
            </div>
          </div>
        </Link>

        {/* --- Пошук --- */}
        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* --- Права частина --- */}
        <div className="flex items-center gap-3">
          {/* 👇 ЛОГІКА ВІДОБРАЖЕННЯ КНОПКИ */}
          {status !== "loading" && (
            <>
              {session?.user ? (
                // 🟢 Якщо УВІЙШОВ: Показуємо ім'я та посилання на профіль
                <Link href="/profile">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <CircleUser size={18} />
                    {session.user.name || "Профіль"}
                  </Button>
                </Link>
              ) : (
                // 🔴 Якщо ГІСТЬ: Показуємо кнопку входу
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setOpenAuthModal(true)}
                >
                  <User size={16} />
                  Logowanie
                </Button>
              )}
            </>
          )}

          {/* Модальне вікно (воно невидиме, поки openAuthModal = false) */}
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
