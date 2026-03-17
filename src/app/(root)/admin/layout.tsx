import { redirect } from "next/navigation";
import prisma from "@prisma/prisma-client";
import { getServerSession } from "next-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    // Niezalogowany gość próbuje wejść na /admin -> wyrzucamy go na stronę logowania lub główną
    return redirect("/");
  }

  // 2. Szukamy go w bazie i sprawdzamy rolę
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "ADMIN") {
    // Zwykły klient próbuje wejść na /admin -> wyrzucamy go na stronę główną
    return redirect("/");
  }

  return <>{children}</>;
}
