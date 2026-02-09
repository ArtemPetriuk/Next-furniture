import React from "react";
import { useForm } from "react-hook-form"; // Стара добра форма
import { signIn } from "next-auth/react"; // 👈 Головна функція входу
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onClose?: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Викликаємо NextAuth для входу
      const resp = await signIn("credentials", {
        ...data,
        redirect: false, // Не перезавантажувати сторінку
      });

      if (!resp?.ok) {
        throw Error();
      }

      toast.success("wypelniono pomyślnie!"); // Успішний вхід
      onClose?.(); // Закриваємо модалку
    } catch (error) {
      console.error("Error [LOGIN]", error);
      toast.error("nie udało się zalogować!"); // Помилка входу
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between">
        <div className="mr-2">
          <h2 className="text-2xl font-bold">Logowanie do konta</h2>
          <p className="text-gray-400">
            Wprowadź swoje dane, aby się zalogować
          </p>
        </div>
      </div>

      <Input
        {...form.register("email", { required: true })}
        placeholder="Email"
        type="email"
      />

      <Input
        {...form.register("password", { required: true })}
        placeholder="Hasło"
        type="password"
      />

      <Button
        disabled={form.formState.isSubmitting}
        className="h-12 text-base font-bold"
        type="submit"
      >
        {form.formState.isSubmitting ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
};
