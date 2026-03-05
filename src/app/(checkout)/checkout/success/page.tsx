import { getUserSession } from "@/lib/get-user-session"; // 1. Імпортуємо
import Link from "next/link";

export default async function SuccessPage() {
  const session = await getUserSession(); // 2. Отримуємо сесію

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-gray-50">
      {/* ... тут твій код з галочкою і текстом ... */}

      <h1 className="mt-4 text-2xl font-bold">Zamówienie złożone pomyślnie!</h1>
      <p className="mt-2 max-w-md text-center text-gray-500">
        Dziękujemy za zakupy. Już zaczęliśmy realizować Twoje zamówienie...
      </p>

      <div className="mt-8 flex gap-4">
        <Link href="/">
          <button className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 hover:bg-gray-50">
            Strona główna
          </button>
        </Link>

        {/* 🔥 3. Ця кнопка з'явиться ТІЛЬКИ якщо користувач залогований */}
        {session && (
          <Link href="/profile">
            <button className="rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90">
              Moje zamówienia
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
