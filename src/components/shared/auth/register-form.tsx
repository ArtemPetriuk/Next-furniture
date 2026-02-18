import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onClose?: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm({
    mode: "onChange", // 👈 1. Змушуємо форму перевіряти дані "на льоту" (при кожному натисканні клавіші)
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (data.password !== data.confirmPassword) {
        return toast.error("Hasła nie pasują do siebie"); // Трохи підправив на польську
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw Error();
      }

      toast.success("Rejestracja zakończona sukcesem!");
      onClose?.();
    } catch (error) {
      toast.error(
        "Nie udało się zarejestrować. Możliwe, że email jest zajęty.",
      );
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between">
        <div className="mr-2">
          <h2 className="text-2xl font-bold">Rejestracja</h2>
          <p className="text-gray-400">
            Stwórz konto, aby zapisywać historię zakupów
          </p>
        </div>
      </div>

      {/* 👇 2 & 3. Оновлений інпут для Email */}
      <div>
        <Input
          {...form.register("email", {
            required: "Email jest wymagany", // Текст, якщо поле пусте
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Формула правильного email
              message: "Wprowadź poprawny adres email", // Текст помилки, якщо email невірний
            },
          })}
          placeholder="Email"
          type="email"
          // Якщо є помилка, робимо рамку червоною
          className={
            form.formState.errors.email
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {/* Показуємо сам текст помилки під інпутом */}
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.email.message as string}
          </p>
        )}
      </div>

      <Input
        {...form.register("fullName", { required: true })}
        placeholder="Pełne imię"
      />
      <Input
        {...form.register("password", { required: true })}
        placeholder="Hasło"
        type="password"
      />
      <Input
        {...form.register("confirmPassword", { required: true })}
        placeholder="Potwierdź hasło"
        type="password"
      />

      <Button
        disabled={form.formState.isSubmitting}
        className="h-12 text-base font-bold"
        type="submit"
      >
        Zarejestruj się
      </Button>
    </form>
  );
};
