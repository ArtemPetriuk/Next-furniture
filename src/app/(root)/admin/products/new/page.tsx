"use client";

import React, { useState, useEffect } from "react";
import { createProduct } from "@/app/actions/create-product";
import { getCategories } from "@/app/actions/get-categories";
import { getAdditionally } from "@/app/actions/get-additionally";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface AdditionallyItem {
  id: number;
  name: string;
  price: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [additionallyItems, setAdditionallyItems] = useState<
    AdditionallyItem[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
  });

  // 👇 СТАН ДЛЯ ВАРІАНТІВ (замість окремих price/stock)
  const [variants, setVariants] = useState([
    { options: "", price: "", stock: "" }, // За замовчуванням 1 порожній варіант
  ]);

  const [selectedAdditionally, setSelectedAdditionally] = useState<number[]>(
    [],
  );

  useEffect(() => {
    async function fetchData() {
      const catResult = await getCategories();
      if (catResult.success && catResult.categories.length > 0) {
        setCategories(catResult.categories);
        setFormData((prev) => ({
          ...prev,
          categoryId: String(catResult.categories[0].id),
        }));
      }

      const addResult = await getAdditionally();
      if (addResult.success) {
        setAdditionallyItems(addResult.items);
      }
    }
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👇 ФУНКЦІЇ ДЛЯ КЕРУВАННЯ ВАРІАНТАМИ 👇
  const addVariant = () => {
    setVariants([...variants, { options: "", price: "", stock: "" }]);
  };

  const removeVariant = (indexToRemove: number) => {
    setVariants(variants.filter((_, index) => index !== indexToRemove));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const toggleAdditionally = (id: number) => {
    setSelectedAdditionally((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Перетворюємо рядки у числа для бази даних
    const formattedVariants = variants.map((v) => ({
      options: v.options,
      price: Number(v.price) || 0,
      stock: Number(v.stock) || 0,
    }));

    const data = {
      ...formData,
      categoryId: Number(formData.categoryId),
      additionallyIds: selectedAdditionally,
      variants: formattedVariants, // 👈 Передаємо масив варіантів
    };

    const result = await createProduct(data);

    if (result.success) {
      toast.success("Produkt został dodany! 🎉");
      router.push("/admin/inventory");
      router.refresh();
    } else {
      toast.error("Wystąpił błąd podczas dodawania.");
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto mb-20 mt-10 max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        ➕ Dodaj nowy produkt
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Nazwa produktu</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Opis</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Link do zdjęcia (URL)
            </label>
            <input
              required
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="font-semibold text-gray-700">Kategoria</label>
            <select
              required
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="cursor-pointer rounded-xl border bg-white px-4 py-3 outline-none focus:border-violet-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 👇 ДИНАМІЧНІ ВАРІАНТИ ТОВАРУ 👇 */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-gray-800">
              Warianty produktu (opcje)
            </label>
            <Button
              type="button"
              onClick={addVariant}
              variant="outline"
              className="h-8 border-violet-200 text-xs font-bold text-violet-600 hover:bg-violet-50"
            >
              + Dodaj wariant
            </Button>
          </div>

          {variants.map((variant, index) => (
            <div
              key={index}
              className="group relative flex items-end gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Nazwa opcji (np. Czarna)
                </label>
                <input
                  required
                  value={variant.options}
                  onChange={(e) =>
                    handleVariantChange(index, "options", e.target.value)
                  }
                  placeholder="Wpisz opcję"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex w-24 flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Cena (zł)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  placeholder="0"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex w-24 flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Magazyn
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="szt."
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="mb-1 h-9 px-3 font-bold text-red-400 transition-colors hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* СЕКЦІЯ ADDITIONALLY */}
        {additionallyItems.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-5">
            <label className="font-bold text-gray-800">Opcje dodatkowe</label>
            <div className="grid grid-cols-2 gap-3">
              {additionallyItems.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-violet-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedAdditionally.includes(item.id)}
                    onChange={() => toggleAdditionally(item.id)}
                    className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-gray-400">
                    +{item.price} zł
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-14 rounded-xl bg-violet-600 text-lg font-bold text-white hover:bg-violet-700"
        >
          {isLoading ? "Zapisywanie..." : "Dodaj produkt do sklepu"}
        </Button>
      </form>
    </div>
  );
}
