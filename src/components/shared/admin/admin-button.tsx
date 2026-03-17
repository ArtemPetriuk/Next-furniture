import { getServerSession } from "next-auth/next";
import prisma from "@prisma/prisma-client";
import Link from "next/link";
// 👇 Jeśli masz plik z konfiguracją NextAuth (np. authOptions), odkomentuj i popraw ścieżkę:
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function AdminButton() {
  // 1. Pobieramy sesję (czasem wymaga przekazania authOptions)
  const session = await getServerSession();

  if (!session?.user?.email) {
    return null;
  }

  // 2. Szukamy użytkownika w bazie
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  // 3. Sprawdzamy rolę (upewnij się, że używasz "ADMIN" wielkimi literami)
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-600/40 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-violet-700 active:scale-95"
      title="Przejdź do panelu administratora"
    >
      <span className="text-2xl font-extrabold">A</span>
    </Link>
  );
}
