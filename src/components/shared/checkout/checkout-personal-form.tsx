import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CheckoutFormValues } from "./checkout-form-schema";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<CheckoutFormValues>;
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ form, className }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
      <div>
        <Input
          {...register("firstName")}
          placeholder="Imię"
          className={`h-12 rounded-lg bg-white ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
        />
        {errors.firstName && (
          <p className="mt-1 text-xs text-red-500">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Input
          {...register("lastName")}
          placeholder="Nazwisko"
          className={`h-12 rounded-lg bg-white ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
        />
        {errors.lastName && (
          <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("email")}
          placeholder="E-mail"
          className={`h-12 rounded-lg bg-white ${errors.email ? "border-red-500" : "border-gray-200"}`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("phone")}
          placeholder="Telefon"
          className={`h-12 rounded-lg bg-white ${errors.phone ? "border-red-500" : "border-gray-200"}`}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
    </div>
  );
};
