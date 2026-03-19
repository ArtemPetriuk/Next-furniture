"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { AuthModal } from "./modals/auth-modal";
import { ProfileButton } from "./profile-button";
// 👇 Додані імпорти для кнопки улюблених
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          {/* 👇 НОВА КНОПКА "УЛЮБЛЕНІ" */}
          <Link href="/favorites">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl border-gray-200 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Heart size={16} />
              <span className="hidden font-bold sm:inline">Ulubione</span>
            </Button>
          </Link>

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
