"use client";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import React from "react";

interface FilterMatProps {
  searchValue: string; // Додаємо пропс для пошуку
}

export const FilterMat: React.FC<FilterMatProps> = ({ searchValue }) => {
  return (
    <div className="space-y-5 mt-4">
      <CheckboxFiltersGroup
        title="Kolor"
        name="Kolor"
        limit={4}
        showSearch={true}
        defaultItems={[
          { text: "Biały", value: "5" },
          { text: "Czarny", value: "6" },
          { text: "Szary", value: "7" },
          { text: "Niebieski", value: "8" },
        ]}
        items={[
          { text: "Biały", value: "5" },
          { text: "Czarny", value: "6" },
          { text: "Szary", value: "7" },
          { text: "Niebieski", value: "8" },
        ]}
      />

      <CheckboxFiltersGroup
        title="Styl"
        name="Styl"
        limit={4}
        searchValue={searchValue}
        showSearch={false}
        defaultItems={[
          { text: "Nowoczesny", value: "9" },
          { text: "Klasyczny", value: "10" },
          { text: "Loft", value: "11" },
          { text: "Skandynawski", value: "12" },
        ]}
        items={[
          { text: "Nowoczesny", value: "9" },
          { text: "Klasyczny", value: "10" },
          { text: "Loft", value: "11" },
          { text: "Skandynawski", value: "12" },
        ]}
      />
    </div>
  );
};
