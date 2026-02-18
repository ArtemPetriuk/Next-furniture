"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // shadcn компонент
import { LoginForm } from "../auth/login-form";
import { RegisterForm } from "../auth/register-form";
import { signIn } from "next-auth/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = useState<"login" | "register">("login");

  const onSwitchType = () => {
    setType(type === "login" ? "register" : "login");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[450px] bg-white p-10">
        {/* Показуємо форму залежно від типу */}
        {type === "login" ? (
          <LoginForm onClose={onClose} />
        ) : (
          <RegisterForm onClose={onClose} />
        )}

        <hr />

        {/* Кнопки Google / GitHub */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => signIn("google")}
            className="h-12 flex-1 gap-2 p-2"
          >
            <img
              className="h-6 w-6"
              src="https://github.githubassets.com/images/modules/logos_page/Google-G-Logo-512px.png"
              alt="Google"
            />
            Google
          </Button>
          {/* Можна додати GitHub аналогічно */}
        </div>

        <Button variant="outline" onClick={onSwitchType} className="h-12">
          {type === "login" ? "Rejestracja" : "Logowanie"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
