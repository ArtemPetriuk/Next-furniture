"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { AuthModal } from "./modals/auth-modal";
import { ProfileButton } from "./profile-button"; // 👈 Імпорт нового компонента

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

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Логотип */}
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

        {/* Пошук */}
        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Права частина */}
        <div className="flex items-center gap-3">
          {/* 👇 ТУТ ТЕПЕР ЧИСТО І ГАРНО */}
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
