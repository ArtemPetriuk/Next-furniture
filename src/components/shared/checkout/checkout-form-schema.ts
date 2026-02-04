import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Imię musi mieć co najmniej 2 znaki" }),
  lastName: z
    .string()
    .min(2, { message: "Nazwisko musi mieć co najmniej 2 znaki" }),
  email: z.string().email({ message: "Wprowadź prawidłowy adres e-mail" }),
  phone: z.string().min(9, { message: "Wprowadź poprawny numer telefonu" }),
  address: z.string().min(5, { message: "Wprowadź pełny adres dostawy" }),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
