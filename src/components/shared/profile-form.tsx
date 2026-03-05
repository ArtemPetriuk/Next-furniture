"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@prisma/client";
import { updateUserInfo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Допоміжна функція для класів

interface Props {
  data: User;
  className?: string;
}

interface FormInputs {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  password?: string;
  confirmPassword?: string;
}

export const ProfileForm: React.FC<Props> = ({ data, className }) => {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || "",
      address: data.address || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (values) => {
    try {
      if (values.password && values.password !== values.confirmPassword) {
        return toast.error("Hasła nie pasują do siebie");
      }

      await updateUserInfo({
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        password: values.password || undefined,
      });

      toast.success("Dane zostały pomyślnie zaktualizowane! 📝");
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji danych");
    }
  };

  return (
    <div className="w-full rounded-[40px] border border-gray-50 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-800">Dane profilu</h2>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Поле Email */}
        <div className="space-y-1">
          <label className="ml-1 text-xs font-bold uppercase text-gray-400">
            Email
          </label>
          <Input
            {...form.register("email")}
            disabled
            className="h-11 rounded-xl border-gray-100 bg-gray-50"
          />
        </div>

        {/* Поле Ім'я */}
        <div className="space-y-1">
          <label className="ml-1 text-xs font-bold uppercase text-gray-400">
            Imię i nazwisko
          </label>
          <Input
            {...form.register("fullName")}
            className="h-11 rounded-xl border-gray-200"
          />
        </div>

        {/* Поле Телефон */}
        <div className="space-y-1">
          <label className="ml-1 text-xs font-bold uppercase text-gray-400">
            Numer telefonu
          </label>
          <Input
            {...form.register("phone")}
            className="h-11 rounded-xl border-gray-200"
          />
        </div>

        {/* Поле Адреса */}
        <div className="space-y-1">
          <label className="ml-1 text-xs font-bold uppercase text-gray-400">
            Adres dostawy
          </label>
          <Input
            {...form.register("address")}
            className="h-11 rounded-xl border-gray-200"
          />
        </div>

        {/* Кнопка */}
        <Button
          loading={form.formState.isSubmitting}
          className="mt-4 h-12 w-full rounded-2xl bg-violet-600 font-bold text-white transition-all hover:bg-violet-700"
          type="submit"
        >
          Zapisz zmiany
        </Button>
      </form>
    </div>
  );
};
