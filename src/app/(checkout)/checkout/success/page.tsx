import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    // 👇 ЗМІНИЛИ: було mt-20, стало mt-28 (опустили нижче)
    <Container className="mt-28 flex flex-col items-center justify-center">
      <div className="flex max-w-[500px] flex-col items-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Zamówienie złożone pomyślnie!
        </h1>

        <p className="text-lg text-gray-500">
          Dziękujemy za zakupy. Już zaczęliśmy realizować Twoje zamówienie.
          Wiadomość z potwierdzeniem została wysłana na Twój e-mail.
        </p>

        <div className="mt-5 flex gap-4">
          <Link href="/">
            <Button variant="outline" className="h-12 w-full text-base">
              Strona główna
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="h-12 w-full text-base">Moje zamówienia</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
