"use client";

import React, { useState } from "react"; // 👈 Додав useState
import { useSession, signOut } from "next-auth/react";
import { CircleUser, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // 👈 Змінив імпорти

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // Стейт для ручного контролю

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
        {/* Кнопка профілю */}
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          // Додатково можемо відкривати при кліку, якщо юзер з телефону
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
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/" });
            }}
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
