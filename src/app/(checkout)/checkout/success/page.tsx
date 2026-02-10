import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <Container className="mt-20 flex flex-col items-center justify-center">
      <div className="flex max-w-[500px] flex-col items-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Замовлення успішне!
        </h1>

        <p className="text-lg text-gray-500">
          Дякуємо за покупку. Ми вже почали обробляти ваше замовлення. Лист із
          підтвердженням відправлено на вашу пошту.
        </p>

        <div className="mt-5 flex gap-4">
          <Link href="/">
            <Button variant="outline" className="h-12 w-full text-base">
              На головну
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="h-12 w-full text-base">Мої замовлення</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
