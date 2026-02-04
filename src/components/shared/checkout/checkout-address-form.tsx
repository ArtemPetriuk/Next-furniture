import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CheckoutFormValues } from "./checkout-form-schema";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<CheckoutFormValues>;
  className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ form, className }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div
      className={cn(
        "space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <label className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-bold text-gray-500">
          Adres dostawy
        </label>
        <Input
          {...register("address")}
          placeholder="Ulica, numer domu, mieszkania"
          className={`h-14 rounded-lg bg-white text-base ${errors.address ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="relative">
        <label className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-bold text-gray-500">
          Komentarz dla kuriera
        </label>
        <textarea
          {...register("comment")}
          className="min-h-[100px] w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
          placeholder="Np. winda towarowa nie działa, proszę dzwonić godzinę wcześniej..."
        />
      </div>
    </div>
  );
};
