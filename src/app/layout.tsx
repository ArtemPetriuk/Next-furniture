import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/shared/providers";
import { Footer } from "@/components/shared/footer";

const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Next Furniture | główna strona",
  description:
    "Twój ulubiony sklep meblowy. Tworzymy komfort i styl w Twoim domu. Wygodniej się nie da!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} flex min-h-screen flex-col`}>
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
