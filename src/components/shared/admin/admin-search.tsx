"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Потрібно встановити: npm i use-debounce

export const AdminSearch = ({ defaultValue }: { defaultValue: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Використовуємо debounce, щоб не смикати базу при кожному символі
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full md:w-72">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder="search..."
        className="rounded-xl border-none bg-gray-50 pl-10 focus-visible:ring-violet-500"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={defaultValue}
      />
    </div>
  );
};
