import prisma from "../../../../../prisma/prisma-client"; // Виправив шлях імпорту для чистоти
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockInput } from "@/components/shared/admin/stock-input";
import { AdminSearch } from "@/components/shared/admin/admin-search";
import { PriceInput } from "@/components/shared/admin/price-input";

// export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query || "";

  const items = await prisma.productItem.findMany({
    where: {
      product: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      {/* 👇 БАТЬКІВСЬКИЙ DIV (Parent) */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row">
        <h1 className="whitespace-nowrap text-3xl font-bold text-gray-800">
          📦 Zarządzanie magazynem
        </h1>
        <AdminSearch defaultValue={query} />
      </div>

      {items.length > 0 ? (
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="rounded-l-xl">Produkt</TableHead>
              <TableHead>Wariant</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead className="rounded-r-xl text-center">
                Ilość (Szt.)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 👇 СПИСОК (List Rendering) */}
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="transition-colors hover:bg-gray-50/50"
              >
                <TableCell className="font-semibold">
                  {item.product.name}
                </TableCell>
                <TableCell className="text-gray-500">
                  {item.options || "Standard"}
                </TableCell>
                <TableCell className="font-medium">
                  <PriceInput id={item.id} initialPrice={item.price} />
                </TableCell>
                <TableCell className="flex justify-center">
                  <StockInput id={item.id} initialStock={item.stock} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-20 text-center text-gray-400">
          Nie znaleziono produktów dla frazy "{query}".
        </div>
      )}
    </div>
  );
}
