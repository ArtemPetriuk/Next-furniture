"use client";

import React, { useState, useEffect } from "react";
import { Title } from "./title";
import { RangeSlider } from "./range-slider";
import { Input } from "../ui";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { cn } from "@/lib/utils";
import { useFilters } from "../hooks/use-filters";
import { useQueryFilters } from "../hooks/use-query-filters";
import { useDebounce } from "react-use";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const [mainCategory, setMainCategory] = useState<"dom" | "commercial">("dom");
  const [commercialType, setCommercialType] = useState<
    "biuro" | "kawiarnia" | "hotel" | null
  >(null);

  const filters = useFilters();
  useQueryFilters(filters);

  // --- 🔥 Локальні ціни ---
  const [localPrices, setLocalPrices] = useState({
    priceFrom: filters.prices.priceFrom ?? 0,
    priceTo: filters.prices.priceTo ?? 5000,
  });

  useDebounce(
    () => {
      filters.setPrices("priceFrom", localPrices.priceFrom);
      filters.setPrices("priceTo", localPrices.priceTo);
    },
    500,
    [localPrices.priceFrom, localPrices.priceTo],
  );

  const updateLocalPrices = (prices: number[]) => {
    setLocalPrices({
      priceFrom: prices[0],
      priceTo: prices[1],
    });
  };

  // --- ДАНІ ---
  const itemsDom = [
    { text: "Salon", value: "salon" },
    { text: "Sypialnia", value: "sypialnia" },
    { text: "Kuchnia / Jadalnia", value: "kuchnia" },
    { text: "Łazienka", value: "lazienka" },
    { text: "Przedpokój", value: "przedpokoj" },
    { text: "Pokój dziecięcy", value: "dzieciecy" },
    { text: "Gabinet domowy", value: "home-office" },
  ];

  const itemsBiuro = [
    { text: "Gabinet prezesa", value: "gabinet" },
    { text: "Open Space", value: "open-space" },
    { text: "Sala konferencyjna", value: "konferencyjna" },
    { text: "Recepcja / Lobby", value: "recepcja" },
    { text: "Strefa Chillout", value: "chillout" },
  ];

  const itemsKawiarnia = [
    { text: "Sala główna", value: "sala-glowna" },
    { text: "Bar", value: "bar" },
    { text: "Ogródek letni", value: "taras" },
    { text: "Strefa VIP", value: "vip" },
  ];

  const itemsHotel = [
    { text: "Pokój hotelowy", value: "pokoj" },
    { text: "Lobby hotelowe", value: "lobby" },
    { text: "Restauracja hotelowa", value: "restauracja" },
  ];

  return (
    <div className={className}>
      <Title text="Filtrowanie" size="sm" className="mb-5 font-bold" />

      {/* --- ЦІНА --- */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-bold">Cena od i do:</p>
        <div className="mb-5 flex gap-3">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={10000}
            step={100}
            value={String(localPrices.priceFrom)}
            onChange={(e) =>
              setLocalPrices({
                ...localPrices,
                priceFrom: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            min={100}
            max={10000}
            step={100}
            placeholder="10000"
            value={String(localPrices.priceTo)}
            onChange={(e) =>
              setLocalPrices({
                ...localPrices,
                priceTo: Number(e.target.value),
              })
            }
          />
        </div>

        <RangeSlider
          min={0}
          max={10000}
          step={100}
          value={[localPrices.priceFrom, localPrices.priceTo]}
          onValueChange={updateLocalPrices}
        />
      </div>

      <div className="my-6 border-t border-gray-100"></div>

      {/* --- КАТЕГОРІЇ ГОЛОВНІ --- */}
      <div className="mb-6">
        <Title text="Kategoria główna" size="xs" className="mb-3 font-bold" />

        <div className="flex flex-col gap-2">
          {/* 🏠 DO DOMU */}
          <button
            onClick={() => {
              setMainCategory("dom");
              setCommercialType(null);
              // 🔥 Очищаємо всі комерційні фільтри при переході додому
              filters.clearOfficeZones();
              filters.clearCafeZones();
              filters.clearHotelZones();
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-all",
              mainCategory === "dom"
                ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>🏠 Do domu</span>
            {mainCategory === "dom" && (
              <span className="h-2 w-2 rounded-full bg-violet-500"></span>
            )}
          </button>

          {/* 🏢 MEBLE KOMERCYJNE */}
          <button
            onClick={() => {
              setMainCategory("commercial");
              // 🔥 Очищаємо домашні фільтри при переході в комерцію
              filters.clearRooms();
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-all",
              mainCategory === "commercial"
                ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>🏢 Meble komercyjne</span>
            {mainCategory === "commercial" && (
              <span className="h-2 w-2 rounded-full bg-violet-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* --- СПИСКИ --- */}

      {mainCategory === "dom" && (
        <div className="animate-fade-in">
          <CheckboxFiltersGroup
            title="Pokoje"
            name="rooms"
            className="mb-5"
            limit={6}
            defaultItems={itemsDom}
            items={itemsDom}
            loading={false}
            onClickCheckbox={filters.setRooms}
            selected={filters.rooms}
          />
        </div>
      )}

      {mainCategory === "commercial" && (
        <div className="animate-fade-in space-y-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Rodzaj lokalu:
            </p>
            <div className="flex flex-col gap-2">
              {/* BIURO */}
              <button
                onClick={() => {
                  setCommercialType("biuro");
                  // 🔥 Очищаємо інші категорії комерції
                  filters.clearCafeZones();
                  filters.clearHotelZones();
                  filters.clearRooms(); // На всяк випадок
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-left text-sm transition-colors",
                  commercialType === "biuro"
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                Biuro / Gabinet
              </button>
              {commercialType === "biuro" && (
                <div className="ml-2 border-l-2 border-violet-100 py-2 pl-4">
                  <CheckboxFiltersGroup
                    title="Strefy biurowe"
                    name="office_zones"
                    limit={5}
                    defaultItems={itemsBiuro}
                    items={itemsBiuro}
                    loading={false}
                    onClickCheckbox={filters.setOfficeZones}
                    selected={filters.office_zones}
                  />
                </div>
              )}

              {/* KAWIARNIA */}
              <button
                onClick={() => {
                  setCommercialType("kawiarnia");
                  // 🔥 Очищаємо інші
                  filters.clearOfficeZones();
                  filters.clearHotelZones();
                  filters.clearRooms();
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-left text-sm transition-colors",
                  commercialType === "kawiarnia"
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                Restauracja / Kawiarnia
              </button>
              {commercialType === "kawiarnia" && (
                <div className="ml-2 border-l-2 border-violet-100 py-2 pl-4">
                  <CheckboxFiltersGroup
                    title="Strefy lokalu"
                    name="cafe_zones"
                    limit={5}
                    defaultItems={itemsKawiarnia}
                    items={itemsKawiarnia}
                    loading={false}
                    onClickCheckbox={filters.setCafeZones}
                    selected={filters.cafe_zones}
                  />
                </div>
              )}

              {/* HOTEL */}
              <button
                onClick={() => {
                  setCommercialType("hotel");
                  // 🔥 Очищаємо інші
                  filters.clearOfficeZones();
                  filters.clearCafeZones();
                  filters.clearRooms();
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-left text-sm transition-colors",
                  commercialType === "hotel"
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                Hotel / Lobby
              </button>
              {commercialType === "hotel" && (
                <div className="ml-2 border-l-2 border-violet-100 py-2 pl-4">
                  <CheckboxFiltersGroup
                    title="Strefy hotelowe"
                    name="hotel_zones"
                    limit={5}
                    defaultItems={itemsHotel}
                    items={itemsHotel}
                    loading={false}
                    onClickCheckbox={filters.setHotelZones}
                    selected={filters.hotel_zones}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
