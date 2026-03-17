import prisma from "@prisma/prisma-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusSelect } from "@/components/shared/admin/status-select";

// Wyłączamy cache, aby zawsze widzieć najnowsze zamówienia
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📋 Zamówienia</h1>
      </div>

      {orders.length > 0 ? (
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px] rounded-l-xl">ID</TableHead>
              <TableHead>Klient</TableHead>
              <TableHead>Adres i Kontakt</TableHead>
              {/* NOWA KOLUMNA NA PRODUKTY 👇 */}
              <TableHead className="w-[250px]">Produkty</TableHead>
              <TableHead>Kwota</TableHead>
              <TableHead className="rounded-r-xl">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="transition-colors hover:bg-gray-50/50"
              >
                <TableCell className="font-bold text-gray-500">
                  #{order.id}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {order.fullName}
                    </span>
                    <span className="text-sm text-gray-500">{order.email}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-700">📞 {order.phone}</span>
                    <span className="text-gray-500">🏠 {order.address}</span>
                  </div>
                </TableCell>

                {/* 👇 LISTA PRODUKTÓW W ZAMÓWIENIU */}
                <TableCell>
                  <ul className="flex flex-col gap-2 text-sm text-gray-600">
                    {(() => {
                      try {
                        // Parsujemy JSON z produktami z bazy danych
                        const items =
                          typeof order.items === "string"
                            ? JSON.parse(order.items)
                            : order.items;

                        if (!Array.isArray(items)) {
                          return <span>Brak danych o produktach</span>;
                        }

                        return items.map((item: any, index: number) => (
                          <li
                            key={index}
                            className="flex flex-col border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start justify-between">
                              <span className="line-clamp-2 font-medium text-gray-900">
                                {/* Wyciągamy nazwę produktu z JSONa */}
                                {item.productItem?.product?.name || "Produkt"}
                              </span>
                              <span className="ml-2 font-bold text-violet-600">
                                x{item.quantity}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Wariant: {item.productItem?.options || "Standard"}
                            </span>
                            {/* Opcjonalnie: Jeśli są dodatki (np. montaż) */}
                            {item.additionally &&
                              item.additionally.length > 0 && (
                                <span className="text-[10px] text-gray-400">
                                  + Dodatki: {item.additionally.length}
                                </span>
                              )}
                          </li>
                        ));
                      } catch (e) {
                        return (
                          <span className="text-red-500">Błąd odczytu</span>
                        );
                      }
                    })()}
                  </ul>
                </TableCell>
                {/* 👆 KONIEC LISTY PRODUKTÓW */}

                <TableCell className="font-medium text-violet-700">
                  {order.totalAmount} zł
                </TableCell>

                <TableCell>
                  <StatusSelect id={order.id} currentStatus={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-20 text-center text-gray-400">
          Brak zamówień. Kiedy klient złoży zamówienie, pojawi się ono tutaj.
        </div>
      )}
    </div>
  );
}
