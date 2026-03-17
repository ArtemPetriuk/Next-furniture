import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Panel administratora
      </h1>
      <p className="mb-8 text-gray-500">
        Wybierz sekcję, którą chcesz zarządzać.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Kafel Magazynu */}
        <Link
          href="/admin/inventory"
          className="group flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-violet-200 hover:bg-violet-50 hover:shadow-sm"
        >
          <span className="mb-3 text-4xl">📦</span>
          <h2 className="mb-1 text-xl font-bold text-gray-800 group-hover:text-violet-700">
            Magazyn
          </h2>
          <p className="text-sm text-gray-500">
            Zarządzanie stanem magazynowym, wariantami i cenami produktów.
          </p>
        </Link>

        {/* Kafel Zamówień */}
        <Link
          href="/admin/orders"
          className="group flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-violet-200 hover:bg-violet-50 hover:shadow-sm"
        >
          <span className="mb-3 text-4xl">📋</span>
          <h2 className="mb-1 text-xl font-bold text-gray-800 group-hover:text-violet-700">
            Zamówienia
          </h2>
          <p className="text-sm text-gray-500">
            Przeglądanie historii zamówień, szczegółów i zmiana statusów.
          </p>
        </Link>
      </div>
    </div>
  );
}
