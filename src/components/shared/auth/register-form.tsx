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

      toast.success("Реєстрація успішна! Тепер увійдіть.");
      onClose?.();
    } catch (error) {
      toast.error("Не вдалося зареєструватися. Можливо, пошта зайнята.");
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between">
        <div className="mr-2">
          <h2 className="text-2xl font-bold">Реєстрація</h2>
          <p className="text-gray-400">
            Створіть акаунт, щоб зберігати історію
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
        placeholder="Повне ім'я"
      />
      <Input
        {...form.register("password", { required: true })}
        placeholder="Пароль"
        type="password"
      />
      <Input
        {...form.register("confirmPassword", { required: true })}
        placeholder="Підтвердіть пароль"
        type="password"
      />

      <Button
        disabled={form.formState.isSubmitting}
        className="h-12 text-base font-bold"
        type="submit"
      >
        Зареєструватися
      </Button>
    </form>
  );
};
