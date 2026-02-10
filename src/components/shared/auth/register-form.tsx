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
        return toast.error("Паролі не співпадають");
      }

      // Відправляємо на наш API реєстрації
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw Error();
      }

      toast.success("registracja zakończona sukcesem!"); // Успішна реєстрація
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

      <Input
        {...form.register("email", { required: true })}
        placeholder="Email"
        type="email"
      />
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
