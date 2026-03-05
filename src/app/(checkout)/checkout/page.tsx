import { getUserSession } from "@/lib/get-user-session";
import prisma from "@prisma/prisma-client";
import { CheckoutClient } from "./checkout-client";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getUserSession();

  // Шукаємо користувача в БД, щоб отримати phone та address
  const user = session
    ? await prisma.user.findFirst({ where: { id: Number(session.id) } })
    : null;

  // Формуємо дані для початкового заповнення форми
  const userData = {
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  };

  return <CheckoutClient userData={userData} />;
}
