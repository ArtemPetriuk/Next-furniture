import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";
import { useRouter } from "next/navigation";

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();

  React.useEffect(() => {
    const params = {
      ...filters.prices,
      opcija: Array.from(filters.opcija),
      selected: Array.from(filters.selected),
    };

    const query = qs.stringify(params, {
      arrayFormat: "comma",
    });

    router.replace(`?${query}`, { scroll: false });
  }, [filters, router]);
};
