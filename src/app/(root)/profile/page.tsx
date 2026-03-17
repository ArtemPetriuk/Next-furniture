import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/get-user-session"; // 👈 ОБОВ'ЯЗКОВО
import { OrderHistory } from "@/components/shared/order-history";
import { ProfileForm } from "@/components/shared/profile-form";
import prisma from "@prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions); // Zostaw swoją metodę pobierania sesji

  // Upewnij się, że mamy sesję i email
  if (!session || !session.user || !session.user.email) {
    return redirect("/");
  }

  // ✅ POPRAWNE: Szukamy użytkownika po jego unikalnym emailu z Google
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto my-10 max-w-[1200px] px-4">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[450px_1fr]">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Moje konto</h1>
          {/* Передаємо дані у клієнтську форму */}
          <ProfileForm data={user} />
        </div>

        <div className="md:pt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Historia zamówień
          </h2>
          <OrderHistory />
        </div>
      </div>
    </div>
  );
}
