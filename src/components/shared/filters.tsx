"use client";
import React, { useState } from "react";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useQueryFilters, useFilters, useAdditionally } from "../hooks";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { additionally, loading } = useAdditionally();
  const filters = useFilters();

  const items1 = additionally.map((item1) => ({
    value: String(item1.id),
    text: item1.name,
  }));

  useQueryFilters(filters);

  const updatePrices = (prices: number[]) => {
    console.log(prices, 999);
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  };

  const [searchValue, setSearchValue] = useState("");

  const items = additionally.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  return (
    <div className={className}>
      <CheckboxFiltersGroup
        title="Przeznaczenie"
        name="Przeznaczenie"
        className="mb-5"
        onClickCheckbox={filters.setOpcija}
        selected={filters.opcija}
        items={[
          { text: "Do domu", value: "1" },
          { text: "Do biura", value: "2" },
          { text: "Do kawiarni", value: "3" },
        ]}
      />

      {/*filter po cenie*/}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">cena od i do:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={10000}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />

          <Input
            type="number"
            min={100}
            max={1000}
            placeholder="10000"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>

        <RangeSlider
          min={0}
          max={10000}
          step={10}
          value={[
            filters.prices.priceFrom || 0,
            filters.prices.priceTo || 10000,
          ]}
          onValueChange={updatePrices}
        />
      </div>
      <div className="mb-3">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Wyszukiwanie..."
          className="bg-gray-50 border-none"
        />
      </div>

      <CheckboxFiltersGroup
        title="Dodatkowo"
        name="Dodatkowo"
        className="mt-5"
        limit={6}
        searchValue={searchValue}
        showSearch={false}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedAdditionally}
        selected={filters.selected}
      />
    </div>
  );
};
