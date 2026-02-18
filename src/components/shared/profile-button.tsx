"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CircleUser, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // 👇 Функція для повного очищення при виході
  const handleSignOut = () => {
    setIsOpen(false);

    // 1. Видаляємо куку cartToken, щоб анонімний кошик не підтягнув дані юзера
    document.cookie =
      "cartToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Виходимо з NextAuth
    signOut({ callbackUrl: "/" });
  };

  if (!session) {
    return (
      <Button
        onClick={onClickSignIn}
        variant="outline"
        className="flex items-center gap-1"
      >
        <User size={16} />
        zaloguj się
      </Button>
    );
  }

  return (
    <HoverCard
      open={isOpen}
      onOpenChange={setIsOpen}
      openDelay={0}
      closeDelay={200}
    >
      <HoverCardTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CircleUser size={18} />
          {session.user?.name || "Профіль"}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        className="w-56 rounded-md border bg-white p-2 shadow-lg"
      >
        <div className="flex flex-col gap-1">
          <Link href="/profile" onClick={() => setIsOpen(false)}>
            <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-gray-100">
              <User size={14} />
              Mój profil
            </div>
          </Link>

          <button
            onClick={handleSignOut} // 👈 Використовуємо нашу функцію очищення
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={14} />
            Wyloguj się
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
