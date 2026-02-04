import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";
import { useRouter } from "next/navigation";

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
        const params = {
            ...filters.prices,
            rooms: Array.from(filters.rooms),
            office_zones: Array.from(filters.office_zones),
            cafe_zones: Array.from(filters.cafe_zones),
            hotel_zones: Array.from(filters.hotel_zones),
          };
      
          const query = qs.stringify(params, {
            arrayFormat: "comma",
            skipNulls: true, // Не додавати пусті параметри в URL
          });
      
          router.push(`?${query}`, { scroll: false });
    }

    isMounted.current = true;
  }, [filters, router]);
};